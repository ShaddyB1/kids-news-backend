const { spawn } = require('child_process');

console.log('🚀 Testing Expo start...');

const expo = spawn('npx', ['expo', 'start', '--clear'], {
  stdio: 'pipe',
  shell: true
});

expo.stdout.on('data', (data) => {
  console.log(`STDOUT: ${data}`);
});

expo.stderr.on('data', (data) => {
  console.log(`STDERR: ${data}`);
});

expo.on('close', (code) => {
  console.log(`Expo process exited with code ${code}`);
});

// Kill after 10 seconds
setTimeout(() => {
  expo.kill();
  console.log('Test completed');
}, 10000);
