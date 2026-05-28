import { Router, Response } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.middleware';
import fs from 'fs';
import path from 'path';

const router = Router();

router.post('/upload', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { image } = req.body; // base64 data url
    if (!image) {
      res.status(400).json({ error: 'Image data is required.' });
      return;
    }

    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      res.status(400).json({ error: 'Invalid base64 image format.' });
      return;
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    let extension = 'png';
    if (mimeType.includes('jpeg') || mimeType.includes('jpg')) {
      extension = 'jpg';
    } else if (mimeType.includes('gif')) {
      extension = 'gif';
    } else if (mimeType.includes('webp')) {
      extension = 'webp';
    }

    const filename = `logo-${req.user?.userId || 'guest'}-${Date.now()}.${extension}`;
    const uploadDir = path.join(process.cwd(), 'uploads');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, buffer);

    const fileUrl = `/uploads/${filename}`;
    res.status(200).json({ url: fileUrl });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
