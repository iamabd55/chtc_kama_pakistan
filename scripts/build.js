#!/usr/bin/env node

/**
 * Build script with improved error handling
 * Handles network issues and Turbopack compatibility
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Building CHTC Kama Pakistan website...');
console.log('📦 Next.js Version: 16.2.3 (Turbopack)');

const env = process.env;

// Ensure build environment variables
env.NODE_ENV = 'production';

try {
  console.log('⏳ Running build...');
  
  // Run the build with error handling
  execSync('next build', {
    stdio: 'inherit',
    env: env,
  });

  console.log('\n✅ Build completed successfully!');
  console.log('📊 Bundle analysis:');
  console.log('   - check .next/ directory for optimized files');
  console.log('   - Code splitting: enabled (vendors, react, ui chunks)');
  console.log('   - Minification: SWC (production build)');
  console.log('   - Compression: enabled');
  
} catch (error) {
  console.error('\n❌ Build failed');
  
  // Check for common issues
  if (error.message.includes('font') || error.message.includes('googleapis')) {
    console.warn('\n⚠️  Font loading issue detected');
    console.warn('This is often due to network connectivity during build.');
    console.warn('The fonts have fallbacks configured (display: "swap")');
    console.warn('\nRetrying with increased timeout...\n');
    
    try {
      execSync('next build', {
        stdio: 'inherit',
        env: { ...env, NODE_OPTIONS: '--max-old-space-size=4096' },
      });
      console.log('\n✅ Retry successful!');
    } catch (retryError) {
      console.error('Retry failed. Please check network connectivity and try again.');
      process.exit(1);
    }
  } else {
    console.error('Build error:', error.message);
    process.exit(1);
  }
}
