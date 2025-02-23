const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

async function build() {
  try {
    console.log('Building frontend...');
    execSync('cd frontend && npm install && npm run build', { stdio: 'inherit' });

    console.log('Copying frontend build to backend...');
    const sourceDir = path.join(__dirname, '..', 'frontend', 'build');
    const targetDir = path.join(__dirname, '..', 'backend', 'public');
    
    await fs.ensureDir(targetDir);
    await fs.emptyDir(targetDir);
    await fs.copy(sourceDir, targetDir);

    console.log('Build complete!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
