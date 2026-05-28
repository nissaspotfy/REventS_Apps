import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Load the swagger JSON definition
const swaggerPath = path.resolve(__dirname, './swagger.json');
let swaggerDocument = {};
try {
  const fileContent = fs.readFileSync(swaggerPath, 'utf8');
  swaggerDocument = JSON.parse(fileContent);
} catch (err) {
  console.error('Failed to load Swagger JSON specification:', err);
}

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument));

export default router;
