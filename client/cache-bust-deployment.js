#!/usr/bin/env node
/**
 * CACHE-BUSTING DEPLOYMENT PROTOCOL
 * 
 * Advanced deployment validation and cache management for Netlify
 * Ensures clean deployments without dependency conflicts
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CACHE_BUST_LOG = 'deployment-cache-bust.log';

function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    console.log(message);
    fs.appendFileSync(CACHE_BUST_LOG, logMessage);
}

function executeCommand(command, description) {
    log(`🔧 ${description}`);
    try {
        const output = execSync(command, { 
            cwd: process.cwd(), 
            encoding: 'utf-8',
            stdio: 'pipe'
        });
        log(`✅ SUCCESS: ${description}`);
        return output;
    } catch (error) {
        log(`❌ FAILED: ${description} - ${error.message}`);
        throw error;
    }
}

function validateSchemaUtilsFix() {
    log('🔍 Validating schema-utils compatibility fix...');
    
    const schemaUtilsPath = path.join('node_modules', 'schema-utils', 'dist', 'index.js');
    if (!fs.existsSync(schemaUtilsPath)) {
        throw new Error('schema-utils not found');
    }
    
    const content = fs.readFileSync(schemaUtilsPath, 'utf-8');
    if (!content.includes('Enhanced compatibility export structure')) {
        log('⚠️  Applying schema-utils compatibility fix...');
        applySchemaUtilsFix();
    } else {
        log('✅ schema-utils compatibility fix already applied');
    }
}

function applySchemaUtilsFix() {
    const schemaUtilsPath = path.join('node_modules', 'schema-utils', 'dist', 'index.js');
    const fixedContent = `"use strict";

const validate = require('./validate');
const validateError = require('./ValidationError');

// Enhanced compatibility export structure for terser-webpack-plugin
const validationFunction = validate.default;

module.exports = validationFunction;
module.exports.validate = validationFunction;
module.exports.ValidateError = validateError.default;

// Additional export patterns for compatibility
module.exports.default = validationFunction;`;
    
    fs.writeFileSync(schemaUtilsPath, fixedContent);
    log('✅ Applied schema-utils compatibility fix');
}

function cacheBustProtocol() {
    log('🚀 STARTING CACHE-BUSTING DEPLOYMENT PROTOCOL');
    
    // Clear npm cache
    executeCommand('npm cache clean --force', 'Clearing npm cache');
    
    // Clear build directory
    if (fs.existsSync('build')) {
        executeCommand('rmdir /s /q build', 'Clearing build directory');
    }
    
    // Clear webpack cache
    if (fs.existsSync('node_modules/.cache')) {
        executeCommand('rmdir /s /q node_modules\\.cache', 'Clearing webpack cache');
    }
    
    // Validate and apply fixes
    validateSchemaUtilsFix();
    
    // Run clean install with locked versions
    executeCommand('npm install --no-optional', 'Clean dependency installation');
    
    // Validate the fix
    executeCommand('npm run build', 'Testing build process');
    
    log('🎉 CACHE-BUSTING PROTOCOL COMPLETED SUCCESSFULLY');
    log('📊 Build artifacts generated with fixed dependencies');
}

if (require.main === module) {
    try {
        cacheBustProtocol();
        process.exit(0);
    } catch (error) {
        log(`💥 DEPLOYMENT PROTOCOL FAILED: ${error.message}`);
        process.exit(1);
    }
}

module.exports = { cacheBustProtocol, validateSchemaUtilsFix };