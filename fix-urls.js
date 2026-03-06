const fs = require('fs');
const path = require('path');

const dirs = [
    'admin/src/redux/api',
    'client/src/redux/api'
];

dirs.forEach(dir => {
    const fullDir = path.join(__dirname, dir);
    if (!fs.existsSync(fullDir)) return;

    const files = fs.readdirSync(fullDir).filter(f => f.endsWith('.api.ts'));

    files.forEach(file => {
        const filePath = path.join(fullDir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // 1. Ensure Import
        const importLine = 'import { getViteServerUrl } from "../../utils/url";';
        if (!content.includes('getViteServerUrl')) {
            // Find a good place to insert - after existing imports
            const lastImportEnd = content.lastIndexOf('import');
            if (lastImportEnd !== -1) {
                const afterLastImport = content.indexOf(';', lastImportEnd) + 1;
                content = content.slice(0, afterLastImport) + '\n' + importLine + content.slice(afterLastImport);
            } else {
                content = importLine + '\n' + content;
            }
        }

        // 2. Aggressive Regex to replace ANY baseUrl that uses VITE_SERVER_URL improperly
        // This handles both ternary and template literals
        const baseUrlRegex = /baseUrl:\s*(`\${import\.meta\.env\.VITE_SERVER_URL}(\/.*?)`|import\.meta\.env\.VITE_SERVER_URL\s*\?\s*[`'"]\${import\.meta\.env\.VITE_SERVER_URL}(\/.*?)`\s*:\s*[`'"](\/.*?)`)/g;

        content = content.replace(baseUrlRegex, (match, templateMatch, path1, ternaryPath1, ternaryPath2) => {
            const pathSuffix = path1 || ternaryPath1 || '';
            return `baseUrl: \`\${getViteServerUrl(import.meta.env.VITE_SERVER_URL)}${pathSuffix}\``;
        });

        // 3. Fallback for VERY simple one: baseUrl: import.meta.env.VITE_SERVER_URL
        if (content.match(/baseUrl: import\.meta\.env\.VITE_SERVER_URL,/)) {
            content = content.replace(/baseUrl: import\.meta\.env\.VITE_SERVER_URL,/, 'baseUrl: getViteServerUrl(import.meta.env.VITE_SERVER_URL),');
        }

        fs.writeFileSync(filePath, content);
        console.log(`Updated ${dir}/${file}`);
    });
});
