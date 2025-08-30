import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { get } from 'https';
import { createHash } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const htmlFilePath = join(__dirname, '../public/admin/index.html');

// Function to fetch package info from npm registry
function getLatestVersion() {
  return new Promise((resolve, reject) => {
    get('https://registry.npmjs.org/@sveltia/cms', (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const packageInfo = JSON.parse(data);
          resolve(packageInfo['dist-tags'].latest);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Function to calculate SRI hash
function calculateSRI(content) {
  const hash = createHash('sha384').update(content).digest('base64');
  return `sha384-${hash}`;
}

// Function to fetch the script content
// Function to fetch the script content (as Buffer)
function fetchScriptContent(version) {
  return new Promise((resolve, reject) => {
    get(`https://unpkg.com/@sveltia/cms@${version}/dist/sveltia-cms.js`, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

try {
  // Get latest version
  const version = await getLatestVersion();
  console.log(`Latest version: ${version}`);

  // Fetch script content
  const scriptContent = await fetchScriptContent(version);
  const integrity = calculateSRI(scriptContent);

  console.log(`New integrity: ${integrity}`);

  // Read HTML file
  let htmlContent = readFileSync(htmlFilePath, 'utf8');

  // Update script tag
  const newScriptTag = `<script src="https://unpkg.com/@sveltia/cms@${version}/dist/sveltia-cms.js" integrity="${integrity}" crossorigin="anonymous"></script>`;
  htmlContent = htmlContent.replace(
    /<script[^>]*src="https:\/\/unpkg\.com\/@sveltia\/cms@[^"]*"[^>]*crossorigin="[^"]*"[^>]*><\/script>/s,
    newScriptTag,
  );

  // Write updated content back to file
  writeFileSync(htmlFilePath, htmlContent);
  console.log('Successfully updated @sveltia/cms version and integrity hash');
} catch (error) {
  console.error('Error updating CMS version:', error);
  process.exit(1);
}
