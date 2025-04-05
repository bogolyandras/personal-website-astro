import fs from 'fs';
import path from 'path';

const buildDate = new Date().toISOString();
const content = `export const buildDate = "${buildDate}";\n`;

const dirPath = path.join(process.cwd(), '.data');
const filePath = path.join(dirPath, 'build-date.ts');
// Ensure the directory exists
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
}
fs.writeFileSync(filePath, content);