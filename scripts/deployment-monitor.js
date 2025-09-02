#!/usr/bin/env node

/**
 * Real-Time Deployment Monitoring Dashboard
 * 
 * Provides comprehensive monitoring of:
 * - Build status and health checks
 * - Deployment validation reports
 * - Error trending and failure prediction
 * - Integration with error correlation system
 * - Performance metrics and alerts
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const http = require('http');
const WebSocket = require('ws');

const execAsync = promisify(exec);

class DeploymentMonitor {
  constructor() {
    this.config = {
      port: process.env.MONITOR_PORT || 8888,
      wsPort: process.env.WS_PORT || 8889,
      monitorInterval: 30000, // 30 seconds
      healthCheckInterval: 60000, // 1 minute
      performanceCheckInterval: 300000, // 5 minutes
      alertThresholds: {
        buildTime: 300000, // 5 minutes
        errorRate: 0.1, // 10%
        performanceScore: 80,
        availabilityRate: 0.995 // 99.5%
      }
    };

    this.state = {
      builds: [],
      deployments: [],
      health: {},
      performance: {},
      errors: [],
      metrics: {
        totalBuilds: 0,
        successfulBuilds: 0,
        totalDeployments: 0,
        successfulDeployments: 0,
        averageBuildTime: 0,
        currentUptime: 0,
        lastError: null
      }
    };

    this.wsServer = null;
    this.clients = new Set();
    this.monitors = new Map();
    
    this.initialize();
  }

  async initialize() {
    console.log('🚀 Initializing Deployment Monitor Dashboard...');
    
    try {
      await this.setupDirectories();
      await this.loadHistoricalData();
      await this.startWebSocketServer();
      await this.startHTTPServer();
      await this.initializeMonitors();
      
      console.log(`✅ Dashboard available at http://localhost:${this.config.port}`);
      console.log(`📡 WebSocket server running on ws://localhost:${this.config.wsPort}`);
      
    } catch (error) {
      console.error('❌ Failed to initialize monitor:', error);
      throw error;
    }
  }

  async setupDirectories() {
    const dirs = ['./scripts/monitor', './scripts/monitor/data', './scripts/monitor/reports'];
    for (const dir of dirs) {
      try {
        await fs.access(dir);
      } catch {
        await fs.mkdir(dir, { recursive: true });
      }
    }
  }

  async loadHistoricalData() {
    try {
      const dataPath = './scripts/monitor/data/historical.json';
      const data = await fs.readFile(dataPath, 'utf8');
      const historical = JSON.parse(data);
      
      this.state.builds = historical.builds || [];
      this.state.deployments = historical.deployments || [];
      this.state.errors = historical.errors || [];
      this.calculateMetrics();
      
      console.log('📊 Loaded historical monitoring data');
    } catch {
      console.log('📝 No historical data found, starting fresh');
    }
  }

  async startWebSocketServer() {
    this.wsServer = new WebSocket.Server({ port: this.config.wsPort });
    
    this.wsServer.on('connection', (ws) => {
      console.log('📡 New WebSocket client connected');
      this.clients.add(ws);
      
      // Send current state to new client
      ws.send(JSON.stringify({
        type: 'initial_state',
        data: this.state
      }));
      
      ws.on('close', () => {
        this.clients.delete(ws);
        console.log('📡 WebSocket client disconnected');
      });
      
      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });
    });
    
    console.log(`📡 WebSocket server started on port ${this.config.wsPort}`);
  }

  async startHTTPServer() {
    const server = http.createServer(async (req, res) => {
      const url = new URL(req.url, `http://localhost:${this.config.port}`);
      
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      
      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }
      
      try {
        await this.handleRequest(req, res, url);
      } catch (error) {
        console.error('HTTP request error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
    
    server.listen(this.config.port, () => {
      console.log(`🌐 HTTP server started on port ${this.config.port}`);
    });
  }

  async handleRequest(req, res, url) {
    switch (url.pathname) {
      case '/':
        await this.serveDashboard(res);
        break;
      case '/api/status':
        await this.serveStatus(res);
        break;
      case '/api/metrics':
        await this.serveMetrics(res);
        break;
      case '/api/health':
        await this.serveHealthCheck(res);
        break;
      case '/api/builds':
        await this.serveBuilds(res);
        break;
      case '/api/deployments':
        await this.serveDeployments(res);
        break;
      case '/api/errors':
        await this.serveErrors(res);
        break;
      case '/api/trigger-build':
        await this.handleTriggerBuild(req, res);
        break;
      default:
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
  }

  async serveDashboard(res) {
    const dashboard = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StartupnameAI - Deployment Monitor</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #f5f5f5; }
        .header { background: #2563eb; color: white; padding: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header h1 { font-size: 1.5rem; }
        .header .subtitle { opacity: 0.9; font-size: 0.9rem; margin-top: 0.25rem; }
        .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
        .card { background: white; border-radius: 8px; padding: 1.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .metric { text-align: center; }
        .metric-value { font-size: 2rem; font-weight: bold; color: #2563eb; }
        .metric-label { color: #6b7280; margin-top: 0.5rem; }
        .status-indicator { display: inline-block; width: 12px; height: 12px; border-radius: 50%; margin-right: 8px; }
        .status-healthy { background: #10b981; }
        .status-warning { background: #f59e0b; }
        .status-error { background: #ef4444; }
        .build-item, .error-item { padding: 1rem; border-bottom: 1px solid #e5e7eb; }
        .build-item:last-child, .error-item:last-child { border-bottom: none; }
        .build-success { border-left: 4px solid #10b981; }
        .build-failure { border-left: 4px solid #ef4444; }
        .build-running { border-left: 4px solid #f59e0b; }
        .timestamp { color: #6b7280; font-size: 0.875rem; }
        .chart-container { height: 300px; margin-top: 1rem; }
        .controls { margin-bottom: 2rem; }
        .btn { background: #2563eb; color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; margin-right: 0.5rem; }
        .btn:hover { background: #1d4ed8; }
        .btn-danger { background: #ef4444; }
        .btn-danger:hover { background: #dc2626; }
        .log { background: #1f2937; color: #f9fafb; padding: 1rem; border-radius: 6px; font-family: 'Monaco', 'Menlo', monospace; font-size: 0.875rem; max-height: 300px; overflow-y: auto; }
        .connection-status { position: fixed; top: 1rem; right: 1rem; padding: 0.5rem 1rem; border-radius: 6px; color: white; font-size: 0.875rem; }
        .connected { background: #10b981; }
        .disconnected { background: #ef4444; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 StartupnameAI - Deployment Monitor</h1>
        <div class="subtitle">Real-time monitoring dashboard with error correlation and automated recovery</div>
    </div>
    
    <div class="connection-status" id="connectionStatus">
        <span class="status-indicator"></span> Connecting...
    </div>
    
    <div class="container">
        <div class="controls">
            <button class="btn" onclick="triggerBuild()">🔄 Trigger Build</button>
            <button class="btn" onclick="runHealthCheck()">🏥 Health Check</button>
            <button class="btn" onclick="generateReport()">📊 Generate Report</button>
            <button class="btn btn-danger" onclick="emergencyStop()">🛑 Emergency Stop</button>
        </div>
        
        <div class="grid">
            <div class="card">
                <div class="metric">
                    <div class="metric-value" id="totalBuilds">0</div>
                    <div class="metric-label">Total Builds</div>
                </div>
            </div>
            <div class="card">
                <div class="metric">
                    <div class="metric-value" id="successRate">0%</div>
                    <div class="metric-label">Success Rate</div>
                </div>
            </div>
            <div class="card">
                <div class="metric">
                    <div class="metric-value" id="avgBuildTime">0s</div>
                    <div class="metric-label">Avg Build Time</div>
                </div>
            </div>
            <div class="card">
                <div class="metric">
                    <div class="metric-value" id="uptime">0h</div>
                    <div class="metric-label">System Uptime</div>
                </div>
            </div>
        </div>
        
        <div class="grid">
            <div class="card">
                <h3>🔄 Recent Builds</h3>
                <div id="buildsList">No builds yet...</div>
            </div>
            <div class="card">
                <h3>⚠️ Recent Errors</h3>
                <div id="errorsList">No errors detected</div>
            </div>
        </div>
        
        <div class="grid">
            <div class="card">
                <h3>📈 Build Trends</h3>
                <div class="chart-container">
                    <canvas id="buildChart"></canvas>
                </div>
            </div>
            <div class="card">
                <h3>🎯 Performance Metrics</h3>
                <div class="chart-container">
                    <canvas id="performanceChart"></canvas>
                </div>
            </div>
        </div>
        
        <div class="card">
            <h3>📋 System Log</h3>
            <div class="log" id="systemLog">
                [${new Date().toISOString()}] Deployment monitor dashboard loaded<br>
                [${new Date().toISOString()}] Connecting to WebSocket server...<br>
            </div>
        </div>
    </div>

    <script>
        let ws = null;
        let buildChart = null;
        let performanceChart = null;
        
        function connectWebSocket() {
            ws = new WebSocket('ws://localhost:${this.config.wsPort}');
            
            ws.onopen = function() {
                updateConnectionStatus(true);
                addLog('WebSocket connected successfully');
            };
            
            ws.onmessage = function(event) {
                const message = JSON.parse(event.data);
                handleWebSocketMessage(message);
            };
            
            ws.onclose = function() {
                updateConnectionStatus(false);
                addLog('WebSocket disconnected - attempting to reconnect...');
                setTimeout(connectWebSocket, 5000);
            };
            
            ws.onerror = function(error) {
                addLog('WebSocket error: ' + error.message);
            };
        }
        
        function updateConnectionStatus(connected) {
            const status = document.getElementById('connectionStatus');
            if (connected) {
                status.className = 'connection-status connected';
                status.innerHTML = '<span class="status-indicator status-healthy"></span> Connected';
            } else {
                status.className = 'connection-status disconnected';
                status.innerHTML = '<span class="status-indicator status-error"></span> Disconnected';
            }
        }
        
        function handleWebSocketMessage(message) {
            switch (message.type) {
                case 'initial_state':
                    updateDashboard(message.data);
                    break;
                case 'build_update':
                    updateBuilds(message.data);
                    break;
                case 'error_update':
                    updateErrors(message.data);
                    break;
                case 'metrics_update':
                    updateMetrics(message.data);
                    break;
                case 'log_message':
                    addLog(message.data.message);
                    break;
            }
        }
        
        function updateDashboard(state) {
            updateMetrics(state.metrics);
            updateBuilds(state.builds);
            updateErrors(state.errors);
            updateCharts(state);
        }
        
        function updateMetrics(metrics) {
            document.getElementById('totalBuilds').textContent = metrics.totalBuilds || 0;
            
            const successRate = metrics.totalBuilds > 0 ? 
                ((metrics.successfulBuilds / metrics.totalBuilds) * 100).toFixed(1) : 0;
            document.getElementById('successRate').textContent = successRate + '%';
            
            const avgTime = metrics.averageBuildTime > 0 ? 
                Math.round(metrics.averageBuildTime / 1000) : 0;
            document.getElementById('avgBuildTime').textContent = avgTime + 's';
            
            const uptimeHours = Math.floor(metrics.currentUptime / 3600000);
            document.getElementById('uptime').textContent = uptimeHours + 'h';
        }
        
        function updateBuilds(builds) {
            const buildsList = document.getElementById('buildsList');
            if (!builds || builds.length === 0) {
                buildsList.innerHTML = 'No builds yet...';
                return;
            }
            
            const recentBuilds = builds.slice(-5).reverse();
            buildsList.innerHTML = recentBuilds.map(build => \`
                <div class="build-item build-\${build.status}">
                    <div><strong>Build #\${build.id}</strong> - \${build.status}</div>
                    <div class="timestamp">\${new Date(build.timestamp).toLocaleString()}</div>
                    <div>Duration: \${Math.round(build.duration / 1000)}s</div>
                </div>
            \`).join('');
        }
        
        function updateErrors(errors) {
            const errorsList = document.getElementById('errorsList');
            if (!errors || errors.length === 0) {
                errorsList.innerHTML = 'No errors detected';
                return;
            }
            
            const recentErrors = errors.slice(-5).reverse();
            errorsList.innerHTML = recentErrors.map(error => \`
                <div class="error-item">
                    <div><strong>\${error.type}</strong></div>
                    <div>\${error.message.substring(0, 100)}...</div>
                    <div class="timestamp">\${new Date(error.timestamp).toLocaleString()}</div>
                </div>
            \`).join('');
        }
        
        function updateCharts(state) {
            // Update build chart
            if (buildChart) buildChart.destroy();
            const buildCtx = document.getElementById('buildChart').getContext('2d');
            
            const buildData = state.builds || [];
            const last24Hours = buildData.filter(b => 
                new Date(b.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
            );
            
            buildChart = new Chart(buildCtx, {
                type: 'line',
                data: {
                    labels: last24Hours.map(b => new Date(b.timestamp).toLocaleTimeString()),
                    datasets: [{
                        label: 'Build Duration (s)',
                        data: last24Hours.map(b => Math.round(b.duration / 1000)),
                        borderColor: '#2563eb',
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        }
        
        function addLog(message) {
            const log = document.getElementById('systemLog');
            const timestamp = new Date().toISOString();
            log.innerHTML += \`[${timestamp}] \${message}<br>\`;
            log.scrollTop = log.scrollHeight;
        }
        
        async function triggerBuild() {
            try {
                addLog('Triggering new build...');
                const response = await fetch('/api/trigger-build', { method: 'POST' });
                const result = await response.json();
                addLog('Build triggered: ' + result.message);
            } catch (error) {
                addLog('Failed to trigger build: ' + error.message);
            }
        }
        
        async function runHealthCheck() {
            try {
                addLog('Running health check...');
                const response = await fetch('/api/health');
                const result = await response.json();
                addLog('Health check completed: ' + result.status);
            } catch (error) {
                addLog('Health check failed: ' + error.message);
            }
        }
        
        async function generateReport() {
            try {
                addLog('Generating monitoring report...');
                const response = await fetch('/api/generate-report', { method: 'POST' });
                const result = await response.json();
                addLog('Report generated: ' + result.reportPath);
            } catch (error) {
                addLog('Report generation failed: ' + error.message);
            }
        }
        
        function emergencyStop() {
            if (confirm('This will stop all monitoring and deployment processes. Continue?')) {
                addLog('Emergency stop initiated');
                if (ws) ws.close();
            }
        }
        
        // Initialize dashboard
        connectWebSocket();
    </script>
</body>
</html>`;

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(dashboard);
  }

  async serveStatus(res) {
    const status = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      monitors: Array.from(this.monitors.keys()),
      activeClients: this.clients.size,
      metrics: this.state.metrics
    };
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(status));
  }

  async serveMetrics(res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(this.state.metrics));
  }

  async serveHealthCheck(res) {
    const health = await this.performHealthCheck();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(health));
  }

  async serveBuilds(res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(this.state.builds));
  }

  async serveDeployments(res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(this.state.deployments));
  }

  async serveErrors(res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(this.state.errors));
  }

  async handleTriggerBuild(req, res) {
    try {
      const buildResult = await this.triggerBuild();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Build triggered', buildId: buildResult.id }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: error.message }));
    }
  }

  async initializeMonitors() {
    console.log('🔍 Initializing monitoring services...');
    
    // Build monitor
    this.monitors.set('build', setInterval(() => {
      this.monitorBuilds();
    }, this.config.monitorInterval));
    
    // Health monitor
    this.monitors.set('health', setInterval(() => {
      this.performHealthCheck();
    }, this.config.healthCheckInterval));
    
    // Performance monitor
    this.monitors.set('performance', setInterval(() => {
      this.monitorPerformance();
    }, this.config.performanceCheckInterval));
    
    console.log('✅ All monitors initialized');
  }

  async monitorBuilds() {
    try {
      // Check if build is currently running
      const { stdout } = await execAsync('ps aux | grep "npm.*build" | grep -v grep || echo "none"', { shell: true });
      
      if (stdout.trim() !== 'none') {
        this.broadcast({ type: 'log_message', data: { message: 'Build process detected running' } });
      }
      
    } catch (error) {
      console.error('Build monitoring error:', error);
    }
  }

  async performHealthCheck() {
    const health = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      checks: {}
    };
    
    try {
      // Check Node.js process
      health.checks.nodejs = { status: 'healthy', uptime: process.uptime() };
      
      // Check disk space
      try {
        const { stdout } = await execAsync('df -h . | tail -1', { shell: true });
        const diskInfo = stdout.trim().split(/\s+/);
        health.checks.disk = { 
          status: 'healthy', 
          usage: diskInfo[4] || 'unknown',
          available: diskInfo[3] || 'unknown'
        };
      } catch {
        health.checks.disk = { status: 'warning', message: 'Cannot check disk space' };
      }
      
      // Check memory usage
      const memUsage = process.memoryUsage();
      health.checks.memory = {
        status: memUsage.heapUsed > 1024 * 1024 * 512 ? 'warning' : 'healthy', // 512MB threshold
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + 'MB',
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + 'MB'
      };
      
      // Overall status
      const hasWarnings = Object.values(health.checks).some(check => check.status === 'warning');
      const hasErrors = Object.values(health.checks).some(check => check.status === 'error');
      
      if (hasErrors) health.status = 'error';
      else if (hasWarnings) health.status = 'warning';
      
    } catch (error) {
      health.status = 'error';
      health.error = error.message;
    }
    
    this.state.health = health;
    this.broadcast({ type: 'health_update', data: health });
    
    return health;
  }

  async monitorPerformance() {
    try {
      // Run quick lighthouse check if available
      try {
        const { stdout } = await execAsync('cd client && npm run lighthouse:ci || echo "lighthouse_unavailable"', { 
          shell: true, 
          timeout: 60000 
        });
        
        if (!stdout.includes('lighthouse_unavailable')) {
          this.broadcast({ type: 'log_message', data: { message: 'Performance check completed' } });
        }
      } catch {
        // Lighthouse not available or failed
      }
      
      // Monitor system performance
      const cpuInfo = await this.getCPUUsage();
      this.state.performance = {
        timestamp: new Date().toISOString(),
        cpu: cpuInfo,
        memory: process.memoryUsage(),
        uptime: process.uptime()
      };
      
      this.broadcast({ type: 'performance_update', data: this.state.performance });
      
    } catch (error) {
      console.error('Performance monitoring error:', error);
    }
  }

  async getCPUUsage() {
    try {
      const { stdout } = await execAsync('top -bn1 | grep "Cpu(s)" | awk \'{print $2}\' | cut -d\'%\' -f1 || echo "0"', { shell: true });
      return { usage: parseFloat(stdout.trim()) || 0 };
    } catch {
      return { usage: 0, error: 'Unable to determine CPU usage' };
    }
  }

  async triggerBuild() {
    const buildId = Date.now();
    const startTime = Date.now();
    
    const build = {
      id: buildId,
      status: 'running',
      timestamp: new Date().toISOString(),
      startTime,
      duration: 0
    };
    
    this.state.builds.push(build);
    this.state.metrics.totalBuilds++;
    
    this.broadcast({ type: 'build_update', data: this.state.builds });
    this.broadcast({ type: 'log_message', data: { message: `Build #${buildId} started` } });
    
    try {
      // Run the actual build process
      const { stdout, stderr } = await execAsync('npm run ci:build', { 
        shell: true, 
        timeout: 600000 // 10 minutes
      });
      
      const duration = Date.now() - startTime;
      
      // Update build status
      build.status = 'success';
      build.duration = duration;
      build.output = stdout;
      
      this.state.metrics.successfulBuilds++;
      this.updateAverageBuildTime(duration);
      
      this.broadcast({ type: 'build_update', data: this.state.builds });
      this.broadcast({ type: 'log_message', data: { message: `Build #${buildId} completed successfully in ${Math.round(duration/1000)}s` } });
      
    } catch (error) {
      const duration = Date.now() - startTime;
      
      // Update build status
      build.status = 'failure';
      build.duration = duration;
      build.error = error.message;
      
      // Log error for correlation
      const errorInfo = {
        type: 'build_failure',
        buildId,
        message: error.message,
        timestamp: new Date().toISOString()
      };
      
      this.state.errors.push(errorInfo);
      
      this.broadcast({ type: 'build_update', data: this.state.builds });
      this.broadcast({ type: 'error_update', data: this.state.errors });
      this.broadcast({ type: 'log_message', data: { message: `Build #${buildId} failed: ${error.message}` } });
      
      // Trigger error correlation if available
      try {
        const AdvancedErrorCorrelator = require('./error-correlator.js');
        const correlator = new AdvancedErrorCorrelator();
        await correlator.analyzeError('build_monitor', errorInfo);
      } catch {
        // Error correlator not available
      }
    }
    
    await this.saveHistoricalData();
    return build;
  }

  updateAverageBuildTime(duration) {
    const totalDuration = this.state.metrics.averageBuildTime * (this.state.metrics.totalBuilds - 1) + duration;
    this.state.metrics.averageBuildTime = Math.round(totalDuration / this.state.metrics.totalBuilds);
  }

  calculateMetrics() {
    this.state.metrics.totalBuilds = this.state.builds.length;
    this.state.metrics.successfulBuilds = this.state.builds.filter(b => b.status === 'success').length;
    
    if (this.state.builds.length > 0) {
      const totalDuration = this.state.builds.reduce((sum, build) => sum + (build.duration || 0), 0);
      this.state.metrics.averageBuildTime = Math.round(totalDuration / this.state.builds.length);
    }
    
    this.state.metrics.currentUptime = Date.now() - this.startTime || Date.now();
    
    if (this.state.errors.length > 0) {
      this.state.metrics.lastError = this.state.errors[this.state.errors.length - 1];
    }
  }

  broadcast(message) {
    const messageStr = JSON.stringify(message);
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }

  async saveHistoricalData() {
    try {
      const data = {
        builds: this.state.builds.slice(-100), // Keep last 100 builds
        deployments: this.state.deployments.slice(-50),
        errors: this.state.errors.slice(-50),
        lastUpdated: new Date().toISOString()
      };
      
      await fs.writeFile('./scripts/monitor/data/historical.json', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Failed to save historical data:', error);
    }
  }

  async generateMonitoringReport() {
    const report = {
      timestamp: new Date().toISOString(),
      reportType: 'deployment_monitoring',
      period: '24h',
      metrics: this.state.metrics,
      buildSummary: {
        total: this.state.builds.length,
        successful: this.state.builds.filter(b => b.status === 'success').length,
        failed: this.state.builds.filter(b => b.status === 'failure').length,
        averageDuration: this.state.metrics.averageBuildTime
      },
      errorSummary: {
        total: this.state.errors.length,
        categories: this.categorizeErrors(),
        trends: this.analyzeErrorTrends()
      },
      recommendations: this.generateRecommendations(),
      systemHealth: this.state.health
    };

    const reportPath = `./scripts/monitor/reports/monitoring-report-${Date.now()}.json`;
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📊 Monitoring report generated: ${reportPath}`);
    return report;
  }

  categorizeErrors() {
    const categories = {};
    this.state.errors.forEach(error => {
      const category = error.type || 'unknown';
      categories[category] = (categories[category] || 0) + 1;
    });
    return categories;
  }

  analyzeErrorTrends() {
    const now = Date.now();
    const last24h = this.state.errors.filter(e => new Date(e.timestamp).getTime() > now - 24 * 60 * 60 * 1000);
    const last7d = this.state.errors.filter(e => new Date(e.timestamp).getTime() > now - 7 * 24 * 60 * 60 * 1000);
    
    return {
      last24h: last24h.length,
      last7d: last7d.length,
      trend: last24h.length > last7d.length / 7 ? 'increasing' : 'stable'
    };
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.state.metrics.totalBuilds > 0) {
      const successRate = this.state.metrics.successfulBuilds / this.state.metrics.totalBuilds;
      if (successRate < 0.8) {
        recommendations.push({
          type: 'build_reliability',
          priority: 'high',
          message: 'Build success rate is below 80% - investigate common failure patterns'
        });
      }
    }
    
    if (this.state.metrics.averageBuildTime > this.config.alertThresholds.buildTime) {
      recommendations.push({
        type: 'performance',
        priority: 'medium',
        message: 'Average build time exceeds threshold - consider optimization'
      });
    }
    
    if (this.state.errors.length > 10) {
      recommendations.push({
        type: 'error_management',
        priority: 'medium',
        message: 'High error count detected - implement proactive error handling'
      });
    }
    
    return recommendations;
  }

  async shutdown() {
    console.log('🛑 Shutting down Deployment Monitor...');
    
    // Clear all monitors
    this.monitors.forEach((interval, name) => {
      clearInterval(interval);
      console.log(`   Stopped ${name} monitor`);
    });
    
    // Close WebSocket server
    if (this.wsServer) {
      this.wsServer.close();
      console.log('   WebSocket server closed');
    }
    
    // Save final state
    await this.saveHistoricalData();
    console.log('   Historical data saved');
    
    console.log('✅ Deployment Monitor shut down gracefully');
  }
}

// Start monitor if called directly
if (require.main === module) {
  const monitor = new DeploymentMonitor();
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    await monitor.shutdown();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    await monitor.shutdown();
    process.exit(0);
  });
  
  // Handle uncaught errors
  process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
    monitor.shutdown().then(() => process.exit(1));
  });
}

module.exports = DeploymentMonitor;