import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '..', 'public', 'logo_trans.png');

if (!fs.existsSync(filePath)) {
  console.log('logo_trans.png does not exist in public/');
  process.exit(1);
}

const buffer = fs.readFileSync(filePath);
console.log('File size:', buffer.length);
console.log('First 8 bytes in Hex:', buffer.subarray(0, 8).toString('hex'));

if (buffer[0] !== 0x89 || buffer[1] !== 0x50 || buffer[2] !== 0x4e || buffer[3] !== 0x47) {
  console.log('Not a valid PNG file');
  process.exit(1);
}

console.log('Valid PNG signature.');
