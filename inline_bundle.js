// GCC Atlas - Inlining Script
// Inlines CSS and JS into index.html to guarantee 100% zero-404 delivery across all hosting providers.

const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'css', 'styles.css');
const dataPath = path.join(__dirname, 'js', 'data.js');
const storagePath = path.join(__dirname, 'js', 'storage.js');
const calcPath = path.join(__dirname, 'js', 'calculator.js');
const exportPath = path.join(__dirname, 'js', 'export.js');
const appPath = path.join(__dirname, 'js', 'app.js');
const indexPath = path.join(__dirname, 'index.html');

const css = fs.readFileSync(cssPath, 'utf-8');
const dataJs = fs.readFileSync(dataPath, 'utf-8');
const storageJs = fs.readFileSync(storagePath, 'utf-8');
const calcJs = fs.readFileSync(calcPath, 'utf-8');
const exportJs = fs.readFileSync(exportPath, 'utf-8');
const appJs = fs.readFileSync(appPath, 'utf-8');
let html = fs.readFileSync(indexPath, 'utf-8');

// Fix SVG search-icon if width/height missing
html = html.replace(
  '<svg class="search-icon" viewBox="0 0 24 24"',
  '<svg class="search-icon" width="16" height="16" viewBox="0 0 24 24"'
);

// Replace stylesheet link with inline style tag
const cssTag = `<style>\n/* Inlined styles.css for 100% zero-404 reliability */\n${css}\n</style>`;
html = html.replace('<link rel="stylesheet" href="css/styles.css">', cssTag);

// Replace external script tags with inlined script tags
const scriptsBlock = `
  <script>
    // GCC Atlas Inlined Application Scripts
    ${dataJs}
    ${storageJs}
    ${calcJs}
    ${exportJs}
    ${appJs}
  </script>
`;

const oldScriptTags = `  <!-- Scripts -->
  <script src="js/data.js"></script>
  <script src="js/storage.js"></script>
  <script src="js/calculator.js"></script>
  <script src="js/export.js"></script>
  <script src="js/app.js"></script>`;

if (html.includes(oldScriptTags)) {
  html = html.replace(oldScriptTags, `  <!-- Inlined Scripts for guaranteed zero-404 delivery -->\n${scriptsBlock}`);
} else {
  // Regex replacement fallback
  html = html.replace(/<!-- Scripts -->[\s\S]*?<script src="js\/app.js"><\/script>/, `<!-- Inlined Scripts -->\n${scriptsBlock}`);
}

fs.writeFileSync(indexPath, html, 'utf-8');
console.log('Successfully generated self-contained index.html with inlined CSS and JavaScript!');
