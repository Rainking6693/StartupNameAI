const { telemetryHelpers } = require('../config/telemetry');
const os = require('os');
const cluster = require('cluster');

class LoadBalancingService {
  constructor() {
    this.instanceId = process.env.INSTANCE_ID || `instance_${Date.now()}`;
    this.nodeMetrics = {
      cpu_usage: 0,
      memory_usage: 0,
      active_connections: 0,
      request_queue_size: 0,
      response_times: [],
      error_rate: 0
    };
    
    this.loadBalancingConfig = {
      max_cpu_threshold: parseFloat(process.env.MAX_CPU_THRESHOLD) || 80,
      max_memory_threshold: parseFloat(process.env.MAX_MEMORY_THRESHOLD) || 85,
      max_connections: parseInt(process.env.MAX_CONNECTIONS) || 1000,
      health_check_interval: parseInt(process.env.HEALTH_CHECK_INTERVAL) || 30000,
      circuit_breaker_threshold: parseInt(process.env.CIRCUIT_BREAKER_THRESHOLD) || 5
    };
    
    this.circuitBreaker = {
      state: 'CLOSED', // CLOSED, OPEN, HALF_OPEN
      failure_count: 0,
      last_failure_time: null,
      timeout: 60000 // 1 minute
    };
    
    this.requestQueue = [];
    this.isProcessingQueue = false;
    
    this.initializeLoadBalancing();
  }

  // Initialize load balancing and monitoring
  async initializeLoadBalancing() {
    try {
      this.startMetricsCollection();
      this.initializeCircuitBreaker();
      this.setupRequestQueueProcessing();
      this.initializeClusterManagement();
      
      console.log(`✅ Load balancing service initialized for ${this.instanceId}`);
    } catch (error) {
      console.error('❌ Failed to initialize load balancing:', error);
    }
  }

  // Start collecting system metrics
  startMetricsCollection() {
    setInterval(() => {
      this.collectSystemMetrics();
    }, 5000); // Collect every 5 seconds

    setInterval(() => {
      this.reportMetrics();
    }, 30000); // Report every 30 seconds
  }

  // Collect system performance metrics
  collectSystemMetrics() {
    return telemetryHelpers.createSpan('system_metrics_collection', async (span) => {
      try {
        // CPU Usage
        const cpus = os.cpus();
        let totalIdle = 0;
        let totalTick = 0;
        
        cpus.forEach(cpu => {
          for (const type in cpu.times) {
            totalTick += cpu.times[type];
          }
          totalIdle += cpu.times.idle;
        });
        
        this.nodeMetrics.cpu_usage = 100 - (totalIdle / totalTick * 100);
        
        // Memory Usage
        const totalMemory = os.totalmem();
        const freeMemory = os.freemem();
        this.nodeMetrics.memory_usage = ((totalMemory - freeMemory) / totalMemory) * 100;
        
        // Process-specific metrics
        const memUsage = process.memoryUsage();
        this.nodeMetrics.heap_usage = (memUsage.heapUsed / memUsage.heapTotal) * 100;
        this.nodeMetrics.external_memory = memUsage.external;
        
        // Request queue metrics
        this.nodeMetrics.request_queue_size = this.requestQueue.length;
        
        span.setAttributes({
          'system.cpu_usage': this.nodeMetrics.cpu_usage,
          'system.memory_usage': this.nodeMetrics.memory_usage,
          'system.heap_usage': this.nodeMetrics.heap_usage,
          'system.queue_size': this.nodeMetrics.request_queue_size
        });
        
      } catch (error) {
        span.recordException(error);
        console.warn('Failed to collect system metrics:', error.message);
      }
    });
  }

  // Initialize circuit breaker pattern
  initializeCircuitBreaker() {
    setInterval(() => {
      this.updateCircuitBreakerState();
    }, 10000); // Check every 10 seconds
  }

  // Update circuit breaker state based on system health
  updateCircuitBreakerState() {
    const now = Date.now();
    
    switch (this.circuitBreaker.state) {
      case 'CLOSED':
        if (this.shouldOpenCircuit()) {
          this.circuitBreaker.state = 'OPEN';
          this.circuitBreaker.last_failure_time = now;
          console.warn('🔴 Circuit breaker OPENED due to high failure rate');
        }
        break;
        
      case 'OPEN':
        if (now - this.circuitBreaker.last_failure_time > this.circuitBreaker.timeout) {
          this.circuitBreaker.state = 'HALF_OPEN';
          console.log('🟡 Circuit breaker HALF_OPEN - testing recovery');
        }
        break;
        
      case 'HALF_OPEN':
        if (this.isSystemHealthy()) {
          this.circuitBreaker.state = 'CLOSED';
          this.circuitBreaker.failure_count = 0;
          console.log('🟢 Circuit breaker CLOSED - system recovered');
        } else if (this.shouldOpenCircuit()) {
          this.circuitBreaker.state = 'OPEN';
          this.circuitBreaker.last_failure_time = now;
          console.warn('🔴 Circuit breaker OPENED again - system still unhealthy');
        }
        break;
    }
  }

  // Check if circuit should be opened
  shouldOpenCircuit() {
    return (
      this.circuitBreaker.failure_count >= this.loadBalancingConfig.circuit_breaker_threshold ||
      this.nodeMetrics.cpu_usage > this.loadBalancingConfig.max_cpu_threshold ||
      this.nodeMetrics.memory_usage > this.loadBalancingConfig.max_memory_threshold ||
      this.nodeMetrics.error_rate > 10 // 10% error rate
    );
  }

  // Check if system is healthy
  isSystemHealthy() {
    return (
      this.nodeMetrics.cpu_usage < this.loadBalancingConfig.max_cpu_threshold * 0.7 &&
      this.nodeMetrics.memory_usage < this.loadBalancingConfig.max_memory_threshold * 0.7 &&
      this.nodeMetrics.error_rate < 5 &&
      this.requestQueue.length < 100
    );
  }

  // Setup request queue processing
  setupRequestQueueProcessing() {
    setInterval(() => {
      if (!this.isProcessingQueue && this.requestQueue.length > 0) {
        this.processRequestQueue();
      }
    }, 1000); // Process queue every second
  }

  // Process queued requests
  async processRequestQueue() {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    try {
      const batchSize = Math.min(10, this.requestQueue.length);
      const batch = this.requestQueue.splice(0, batchSize);

      for (const queuedRequest of batch) {
        try {
          await this.processQueuedRequest(queuedRequest);
        } catch (error) {
          console.error('Failed to process queued request:', error);
          this.recordFailure();
        }
      }

      console.log(`📦 Processed ${batch.length} queued requests`);

    } finally {
      this.isProcessingQueue = false;
    }
  }

  // Process individual queued request
  async processQueuedRequest(queuedRequest) {
    const { request, response, handler, startTime } = queuedRequest;
    
    // Check if request has timed out
    if (Date.now() - startTime > 30000) { // 30 second timeout
      response.status(408).json({
        error: 'Request timeout',
        message: 'Request was queued too long and timed out'
      });
      return;
    }

    // Execute the original handler
    await handler(request, response);
  }

  // Request admission control
  async admitRequest(req, res, next) {
    return telemetryHelpers.createSpan('request_admission_control', async (span) => {
      try {
        // Check circuit breaker state
        if (this.circuitBreaker.state === 'OPEN') {
          span.setAttributes({
            'admission_control.decision': 'rejected',
            'admission_control.reason': 'circuit_breaker_open'
          });
          
          return res.status(503).json({
            error: 'Service temporarily unavailable',
            message: 'System is recovering from high load',
            retry_after: Math.ceil(this.circuitBreaker.timeout / 1000)
          });
        }

        // Check system load
        if (this.isSystemOverloaded()) {
          // Queue the request if possible
          if (this.requestQueue.length < 100) {
            this.queueRequest(req, res, next);
            
            span.setAttributes({
              'admission_control.decision': 'queued',
              'admission_control.queue_size': this.requestQueue.length
            });
            
            return res.status(202).json({
              message: 'Request queued due to high load',
              queue_position: this.requestQueue.length,
              estimated_wait_time: this.estimateWaitTime()
            });
          } else {
            span.setAttributes({
              'admission_control.decision': 'rejected',
              'admission_control.reason': 'queue_full'
            });
            
            return res.status(503).json({
              error: 'Service overloaded',
              message: 'System is at capacity, please try again later'
            });
          }
        }

        // Admit request normally
        this.nodeMetrics.active_connections++;
        
        span.setAttributes({
          'admission_control.decision': 'admitted',
          'admission_control.active_connections': this.nodeMetrics.active_connections
        });
        
        // Track request completion
        const originalEnd = res.end;
        res.end = (...args) => {
          this.nodeMetrics.active_connections--;
          this.recordRequestCompletion(req, res);
          originalEnd.apply(res, args);
        };

        next();

      } catch (error) {
        span.recordException(error);
        this.recordFailure();
        next(error);
      }
    });
  }

  // Check if system is overloaded
  isSystemOverloaded() {
    return (
      this.nodeMetrics.cpu_usage > this.loadBalancingConfig.max_cpu_threshold ||
      this.nodeMetrics.memory_usage > this.loadBalancingConfig.max_memory_threshold ||
      this.nodeMetrics.active_connections > this.loadBalancingConfig.max_connections ||
      this.requestQueue.length > 50
    );
  }

  // Queue request for later processing
  queueRequest(req, res, handler) {
    this.requestQueue.push({
      request: req,
      response: res,
      handler,
      startTime: Date.now(),
      priority: this.calculateRequestPriority(req)
    });

    // Sort queue by priority
    this.requestQueue.sort((a, b) => b.priority - a.priority);
  }

  // Calculate request priority
  calculateRequestPriority(req) {
    let priority = 1; // Base priority

    // Premium users get higher priority
    if (req.user && req.user.isPremium) {
      priority += 3;
    }

    // Certain endpoints get higher priority
    if (req.path.includes('/health') || req.path.includes('/status')) {
      priority += 2;
    }

    // Streaming requests get higher priority
    if (req.path.includes('/stream')) {
      priority += 1;
    }

    return priority;
  }

  // Estimate wait time for queued requests
  estimateWaitTime() {
    const avgProcessingTime = this.calculateAverageResponseTime();
    const queuePosition = this.requestQueue.length;
    return Math.ceil((queuePosition * avgProcessingTime) / 1000); // Convert to seconds
  }

  // Calculate average response time
  calculateAverageResponseTime() {
    if (this.nodeMetrics.response_times.length === 0) {
      return 1000; // Default 1 second
    }

    const sum = this.nodeMetrics.response_times.reduce((a, b) => a + b, 0);
    return sum / this.nodeMetrics.response_times.length;
  }

  // Record request completion
  recordRequestCompletion(req, res) {
    const responseTime = Date.now() - req.startTime;
    
    // Track response times (keep last 100)
    this.nodeMetrics.response_times.push(responseTime);
    if (this.nodeMetrics.response_times.length > 100) {
      this.nodeMetrics.response_times.shift();
    }

    // Update error rate
    if (res.statusCode >= 400) {
      this.recordFailure();
    } else {
      this.recordSuccess();
    }

    // Record telemetry
    telemetryHelpers.metrics.nameGenerationDuration.record(responseTime / 1000, {
      status_code: res.statusCode.toString(),
      method: req.method,
      endpoint: req.route?.path || req.path
    });
  }

  // Record failure for circuit breaker
  recordFailure() {
    this.circuitBreaker.failure_count++;
    this.updateErrorRate(true);
  }

  // Record success for circuit breaker
  recordSuccess() {
    if (this.circuitBreaker.failure_count > 0) {
      this.circuitBreaker.failure_count--;
    }
    this.updateErrorRate(false);
  }

  // Update error rate calculation
  updateErrorRate(isError) {
    // Simple sliding window error rate calculation
    if (!this.errorWindow) {
      this.errorWindow = [];
    }

    this.errorWindow.push({ isError, timestamp: Date.now() });

    // Keep only last 5 minutes of data
    const fiveMinutesAgo = Date.now() - 300000;
    this.errorWindow = this.errorWindow.filter(entry => entry.timestamp > fiveMinutesAgo);

    // Calculate error rate
    const totalRequests = this.errorWindow.length;
    const errorRequests = this.errorWindow.filter(entry => entry.isError).length;
    this.nodeMetrics.error_rate = totalRequests > 0 ? (errorRequests / totalRequests) * 100 : 0;
  }

  // Initialize cluster management for multi-core systems
  initializeClusterManagement() {
    if (cluster.isMaster && process.env.ENABLE_CLUSTERING === 'true') {
      const numCPUs = os.cpus().length;
      const numWorkers = parseInt(process.env.CLUSTER_WORKERS) || Math.min(numCPUs, 4);

      console.log(`🔄 Starting ${numWorkers} worker processes`);

      for (let i = 0; i < numWorkers; i++) {
        cluster.fork();
      }

      cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
      });

      // Load balancing between workers
      this.setupWorkerLoadBalancing();
    }
  }

  // Setup load balancing between cluster workers
  setupWorkerLoadBalancing() {
    if (cluster.isMaster) {
      const workers = Object.values(cluster.workers);
      let currentWorker = 0;

      // Round-robin load balancing
      cluster.on('message', (worker, message) => {
        if (message.type === 'get_next_worker') {
          const nextWorker = workers[currentWorker % workers.length];
          currentWorker++;
          worker.send({ type: 'next_worker', workerId: nextWorker.id });
        }
      });
    }
  }

  // Get load balancing status
  getLoadBalancingStatus() {
    return {
      instance_id: this.instanceId,
      circuit_breaker: this.circuitBreaker,
      system_metrics: this.nodeMetrics,
      queue_status: {
        size: this.requestQueue.length,
        processing: this.isProcessingQueue,
        estimated_wait_time: this.estimateWaitTime()
      },
      thresholds: this.loadBalancingConfig,
      health_status: this.isSystemHealthy() ? 'healthy' : 'overloaded'
    };
  }

  // Report metrics to telemetry
  reportMetrics() {
    telemetryHelpers.metrics.nameGenerationCounter.add(1, {
      instance_id: this.instanceId,
      cpu_usage: this.nodeMetrics.cpu_usage.toFixed(2),
      memory_usage: this.nodeMetrics.memory_usage.toFixed(2),
      active_connections: this.nodeMetrics.active_connections.toString(),
      circuit_breaker_state: this.circuitBreaker.state,
      queue_size: this.requestQueue.length.toString()
    });
  }

  // Health check for load balancer
  async healthCheck() {
    const status = this.isSystemHealthy() ? 'healthy' : 'unhealthy';
    
    return {
      status,
      instance_id: this.instanceId,
      circuit_breaker_state: this.circuitBreaker.state,
      system_metrics: {
        cpu_usage: `${this.nodeMetrics.cpu_usage.toFixed(2)}%`,
        memory_usage: `${this.nodeMetrics.memory_usage.toFixed(2)}%`,
        heap_usage: `${this.nodeMetrics.heap_usage.toFixed(2)}%`,
        active_connections: this.nodeMetrics.active_connections,
        queue_size: this.requestQueue.length,
        error_rate: `${this.nodeMetrics.error_rate.toFixed(2)}%`,
        avg_response_time: `${this.calculateAverageResponseTime()}ms`
      },
      thresholds: this.loadBalancingConfig
    };
  }

  // Graceful shutdown
  async gracefulShutdown() {
    console.log('🔄 Starting graceful shutdown...');
    
    // Stop accepting new requests
    this.circuitBreaker.state = 'OPEN';
    
    // Process remaining queued requests
    while (this.requestQueue.length > 0 && !this.isProcessingQueue) {
      await this.processRequestQueue();
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('✅ Graceful shutdown completed');
  }
}

module.exports = new LoadBalancingService();