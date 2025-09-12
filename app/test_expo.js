const { spawn } = require('child_process');

console.log('🚀 Testing Expo start...');

const expo = spawn('npx', ['expo', 'start', '--clear', '--port', '8081', '--host', 'localhost'], {
  stdio: 'pipe',
  shell: true,
  cwd: process.cwd()
});

expo.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(`STDOUT: ${output}`);
  
  // Check for QR code or success indicators
  if (output.includes('QR code') || output.includes('Metro waiting') || output.includes('exp://')) {
    console.log('✅ App appears to be starting successfully!');
  }
});

expo.stderr.on('data', (data) => {
  const output = data.toString();
  console.log(`STDERR: ${output}`);
  
  // Check for specific errors
  if (output.includes('AutoCleanFileStore')) {
    console.log('❌ Still having AutoCleanFileStore issues');
  }
});

expo.on('close', (code) => {
  console.log(`Expo process exited with code ${code}`);
});

// Kill after 30 seconds
setTimeout(() => {
  expo.kill();
  console.log('Test completed');
}, 30000);
