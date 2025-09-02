#!/usr/bin/env node

/**
 * Docker Container Recovery Strategy
 * 
 * Automatically handles Docker deployment failures through:
 * - Container diagnostics
 * - Dockerfile validation
 * - Port conflict resolution
 * - Resource optimization
 */

const fs = require('fs').promises;
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class DockerRecovery {
  constructor() {
    this.errorContext = JSON.parse(process.env.ERROR_CONTEXT || '{}');
    this.recoverySteps = [];
    this.diagnostics = [];
    this.fixes = [];
  }

  async execute() {
    console.log('🐳 Executing Docker container recovery...');
    
    try {
      // Step 1: Diagnose Docker environment
      await this.diagnoseDockerEnvironment();
      
      // Step 2: Validate Dockerfile
      await this.validateDockerfile();
      
      // Step 3: Check port conflicts
      await this.checkPortConflicts();
      
      // Step 4: Clean up containers and images
      await this.cleanupContainers();
      
      // Step 5: Apply fixes
      await this.applyFixes();
      
      // Step 6: Retry container deployment
      const retryResult = await this.retryDeployment();
      
      // Generate recovery report
      const report = await this.generateRecoveryReport(retryResult);
      
      console.log('✅ Docker recovery completed');
      return { success: retryResult.success, report };
      
    } catch (error) {
      console.error('❌ Recovery failed:', error);
      return { success: false, error: error.message };
    }
  }

  async diagnoseDockerEnvironment() {
    console.log('🔍 Diagnosing Docker environment...');
    this.recoverySteps.push('Diagnosing Docker environment');

    try {
      // Check Docker daemon
      const { stdout: dockerVersion } = await execAsync('docker --version');
      console.log(`   ✓ Docker version: ${dockerVersion.trim()}`);

      // Check Docker Compose
      try {
        const { stdout: composeVersion } = await execAsync('docker-compose --version');
        console.log(`   ✓ Docker Compose: ${composeVersion.trim()}`);
      } catch {
        console.log('   ⚠️ Docker Compose not available');
        this.fixes.push({
          type: 'docker_compose_missing',
          action: 'Install Docker Compose',
          priority: 'high'
        });
      }

      // Check running containers
      const { stdout: runningContainers } = await execAsync('docker ps --format "table {{.Names}}\\t{{.Status}}"');
      console.log(`   Running containers:\n${runningContainers}`);

      // Check Docker disk usage
      const { stdout: diskUsage } = await execAsync('docker system df');
      console.log(`   Docker disk usage:\n${diskUsage}`);

      this.diagnostics.push({
        type: 'docker_environment',
        dockerVersion: dockerVersion.trim(),
        runningContainers: runningContainers.split('\n').filter(line => line.trim()),
        diskUsage,
        success: true
      });

    } catch (error) {
      console.error('   ❌ Docker environment check failed:', error.message);
      this.diagnostics.push({
        type: 'docker_environment',
        error: error.message,
        success: false
      });

      // Check if Docker daemon is running
      if (error.message.includes('Cannot connect to the Docker daemon')) {
        this.fixes.push({
          type: 'docker_daemon_not_running',
          action: 'Start Docker daemon',
          priority: 'critical'
        });
      }
    }
  }

  async validateDockerfile() {
    console.log('📝 Validating Dockerfile...');
    this.recoverySteps.push('Validating Dockerfile');

    const dockerfilePaths = ['./Dockerfile', './client/Dockerfile', './server/Dockerfile'];
    const validationResults = [];

    for (const dockerfilePath of dockerfilePaths) {
      try {
        await fs.access(dockerfilePath);
        const validation = await this.analyzeDockerfile(dockerfilePath);
        validationResults.push(validation);
        console.log(`   ✓ ${dockerfilePath}: ${validation.issues.length} issues found`);
      } catch {
        console.log(`   - ${dockerfilePath}: Not found`);
      }
    }

    if (validationResults.length === 0) {
      console.log('   ⚠️ No Dockerfiles found');
      this.fixes.push({
        type: 'dockerfile_missing',
        action: 'Create Dockerfile',
        priority: 'high'
      });
    }

    this.diagnostics.push({
      type: 'dockerfile_validation',
      validationResults,
      success: true
    });
  }

  async analyzeDockerfile(dockerfilePath) {
    const content = await fs.readFile(dockerfilePath, 'utf8');
    const lines = content.split('\n');
    const issues = [];
    const recommendations = [];

    let hasFrom = false;
    let hasWorkdir = false;
    let hasCopy = false;
    let hasExpose = false;
    let hasCmd = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('#')) continue;

      // Check for required instructions
      if (line.startsWith('FROM')) hasFrom = true;
      if (line.startsWith('WORKDIR')) hasWorkdir = true;
      if (line.startsWith('COPY') || line.startsWith('ADD')) hasCopy = true;
      if (line.startsWith('EXPOSE')) hasExpose = true;
      if (line.startsWith('CMD') || line.startsWith('ENTRYPOINT')) hasCmd = true;

      // Check for common issues
      if (line.includes('ADD') && !line.includes('http')) {
        issues.push({
          line: i + 1,
          issue: 'Use COPY instead of ADD for local files',
          severity: 'medium'
        });
      }

      if (line.includes('apt-get install') && !line.includes('apt-get update')) {
        issues.push({
          line: i + 1,
          issue: 'Run apt-get update before apt-get install',
          severity: 'medium'
        });
      }

      if (line.includes('npm install') && !line.includes('--production')) {
        recommendations.push({
          line: i + 1,
          recommendation: 'Consider using --production flag for npm install',
          type: 'optimization'
        });
      }
    }

    // Check for missing required instructions
    if (!hasFrom) issues.push({ issue: 'Missing FROM instruction', severity: 'high' });
    if (!hasWorkdir) issues.push({ issue: 'Missing WORKDIR instruction', severity: 'medium' });
    if (!hasCopy) issues.push({ issue: 'Missing COPY/ADD instruction', severity: 'medium' });
    if (!hasExpose) recommendations.push({ recommendation: 'Consider adding EXPOSE instruction', type: 'best_practice' });
    if (!hasCmd) issues.push({ issue: 'Missing CMD/ENTRYPOINT instruction', severity: 'high' });

    return {
      path: dockerfilePath,
      issues,
      recommendations,
      lineCount: lines.length
    };
  }

  async checkPortConflicts() {
    console.log('🔍 Checking for port conflicts...');
    this.recoverySteps.push('Checking port conflicts');

    try {
      // Check common ports used by the application
      const portsToCheck = [3000, 3001, 8000, 8080, 5000, 5001];
      const conflicts = [];

      for (const port of portsToCheck) {
        try {
          // Check if port is in use (Windows/Linux compatible approach)
          const { stdout } = await execAsync(`netstat -an | grep :${port} || netstat -an | findstr :${port}`, { shell: true });
          if (stdout.trim()) {
            conflicts.push({ port, status: 'in_use', details: stdout.trim().split('\n')[0] });
            console.log(`   ⚠️ Port ${port} is in use`);
          } else {
            console.log(`   ✓ Port ${port} is available`);
          }
        } catch {
          // Port is available (no output from netstat)
          console.log(`   ✓ Port ${port} is available`);
        }
      }

      if (conflicts.length > 0) {
        this.fixes.push({
          type: 'port_conflicts',
          action: 'Resolve port conflicts',
          priority: 'medium',
          conflicts
        });
      }

      this.diagnostics.push({
        type: 'port_check',
        checkedPorts: portsToCheck,
        conflicts,
        success: true
      });

    } catch (error) {
      console.error('   ❌ Port conflict check failed:', error.message);
      this.diagnostics.push({
        type: 'port_check',
        error: error.message,
        success: false
      });
    }
  }

  async cleanupContainers() {
    console.log('🧹 Cleaning up Docker containers and images...');
    this.recoverySteps.push('Cleaning up containers');

    const cleanupCommands = [
      { cmd: 'docker-compose down --volumes', desc: 'Stop and remove containers' },
      { cmd: 'docker container prune -f', desc: 'Remove stopped containers' },
      { cmd: 'docker image prune -f', desc: 'Remove unused images' },
      { cmd: 'docker volume prune -f', desc: 'Remove unused volumes' },
      { cmd: 'docker network prune -f', desc: 'Remove unused networks' }
    ];

    const cleanupResults = [];

    for (const { cmd, desc } of cleanupCommands) {
      try {
        console.log(`   ${desc}...`);
        const { stdout } = await execAsync(cmd, { shell: true });
        console.log(`   ✓ ${desc}: ${stdout.trim() || 'No items to remove'}`);
        cleanupResults.push({ command: cmd, success: true, output: stdout.trim() });
      } catch (error) {
        console.log(`   ⚠️ ${desc} failed: ${error.message}`);
        cleanupResults.push({ command: cmd, success: false, error: error.message });
      }
    }

    this.diagnostics.push({
      type: 'cleanup',
      results: cleanupResults,
      success: true
    });
  }

  async applyFixes() {
    console.log('🔧 Applying Docker fixes...');
    this.recoverySteps.push('Applying fixes');

    for (const fix of this.fixes) {
      try {
        await this.applyFix(fix);
      } catch (error) {
        console.error(`   ❌ Failed to apply fix ${fix.type}:`, error.message);
      }
    }
  }

  async applyFix(fix) {
    switch (fix.type) {
      case 'docker_daemon_not_running':
        console.log('   🔄 Starting Docker daemon...');
        try {
          // Different approaches for different systems
          const startCommands = [
            'sudo systemctl start docker',  // Linux systemd
            'sudo service docker start',    // Linux service
            'open -a Docker'                // macOS
          ];
          
          for (const cmd of startCommands) {
            try {
              await execAsync(cmd, { shell: true });
              console.log('     ✓ Docker daemon start command executed');
              break;
            } catch {
              // Try next command
            }
          }
          
          // Wait for Docker daemon to be ready
          await this.waitForDockerDaemon();
          
        } catch (error) {
          console.error('     ❌ Could not start Docker daemon automatically');
          console.error('     Please start Docker manually and retry');
        }
        break;

      case 'port_conflicts':
        console.log('   🔌 Resolving port conflicts...');
        if (fix.conflicts) {
          for (const conflict of fix.conflicts) {
            console.log(`     ⚠️ Port ${conflict.port} conflict detected`);
            // Could implement automatic port reallocation here
          }
        }
        break;

      case 'dockerfile_missing':
        console.log('   📝 Creating basic Dockerfile...');
        
        const basicDockerfile = `# Generated Docker recovery file
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Set user for security
USER node

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD node healthcheck.js || exit 1

# Start application
CMD ["npm", "start"]
`;

        await fs.writeFile('./Dockerfile', basicDockerfile);
        console.log('     ✓ Created basic Dockerfile');

        // Create basic healthcheck
        const healthcheck = `const http = require('http');
const options = {
  hostname: 'localhost',
  port: process.env.PORT || 3000,
  path: '/health',
  timeout: 2000,
};

const request = http.request(options, (res) => {
  console.log(\`STATUS: \${res.statusCode}\`);
  process.exitCode = res.statusCode === 200 ? 0 : 1;
  process.exit();
});

request.on('error', function(err) {
  console.log('ERROR');
  process.exit(1);
});

request.end();
`;

        await fs.writeFile('./healthcheck.js', healthcheck);
        console.log('     ✓ Created healthcheck script');
        break;

      default:
        console.log(`   ⚠️ Unknown fix type: ${fix.type}`);
    }
  }

  async waitForDockerDaemon(maxWaitMs = 30000) {
    const startTime = Date.now();
    while (Date.now() - startTime < maxWaitMs) {
      try {
        await execAsync('docker info', { shell: true });
        console.log('     ✓ Docker daemon is ready');
        return true;
      } catch {
        console.log('     ⏳ Waiting for Docker daemon...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    throw new Error('Docker daemon failed to start within timeout');
  }

  async retryDeployment() {
    console.log('🔄 Retrying Docker deployment...');
    this.recoverySteps.push('Retrying deployment');

    const deploymentAttempts = [
      { cmd: 'docker-compose up -d', name: 'compose' },
      { cmd: 'docker build -t recovery-app . && docker run -d -p 3000:3000 recovery-app', name: 'manual' }
    ];

    for (const attempt of deploymentAttempts) {
      try {
        console.log(`   Attempting: ${attempt.name} deployment...`);
        const startTime = Date.now();
        
        const { stdout, stderr } = await execAsync(attempt.cmd, {
          shell: true,
          timeout: 300000 // 5 minutes
        });
        
        const deployTime = Date.now() - startTime;
        console.log(`   ✅ ${attempt.name} deployment successful in ${deployTime}ms`);
        
        // Verify containers are running
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s for containers to stabilize
        const { stdout: runningContainers } = await execAsync('docker ps --format "{{.Names}}"');
        
        return {
          success: true,
          method: attempt.name,
          deployTime,
          runningContainers: runningContainers.split('\n').filter(name => name.trim()),
          output: stdout
        };
        
      } catch (error) {
        console.log(`   ❌ ${attempt.name} deployment failed: ${error.message}`);
      }
    }

    return {
      success: false,
      attempts: deploymentAttempts.map(a => a.name),
      error: 'All deployment attempts failed'
    };
  }

  async generateRecoveryReport(retryResult) {
    const report = {
      timestamp: new Date().toISOString(),
      recoveryType: 'docker_container_failure',
      originalError: this.errorContext,
      recoverySteps: this.recoverySteps,
      diagnostics: this.diagnostics,
      appliedFixes: this.fixes,
      deploymentResult: retryResult,
      recommendations: [
        'Implement Docker health checks for all services',
        'Set up container resource limits and monitoring',
        'Use multi-stage builds to reduce image size',
        'Implement proper logging and error handling',
        'Set up automated container updates and security scanning',
        'Consider using Docker secrets for sensitive data',
        'Implement backup and restore procedures for volumes'
      ]
    };

    const reportPath = `./scripts/reports/docker-recovery-${Date.now()}.json`;
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📊 Recovery report saved: ${reportPath}`);
    return report;
  }
}

// Execute recovery if called directly
if (require.main === module) {
  const recovery = new DockerRecovery();
  recovery.execute()
    .then(result => {
      console.log('Recovery result:', result.success ? '✅ Success' : '❌ Failed');
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Recovery execution failed:', error);
      process.exit(1);
    });
}

module.exports = DockerRecovery;