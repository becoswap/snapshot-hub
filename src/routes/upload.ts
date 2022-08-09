import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { sendError } from '../helpers/utils';
import { create } from 'ipfs-http-client';

const router = express.Router();

const fileSize = 1000 * 1000;
const upload = multer({ dest: 'uploads/', limits: { fileSize } });
const client = create({ url: (process.env.IPFS as any) + '/api/v0' });

router.post('/upload', upload.single('file'), async (req, res) => {
  const path = `${req.file.destination}${req.file.filename}`;
  const readableStreamForFile = fs.createReadStream(path);
  try {
    const { cid } = await client.add(readableStreamForFile);
    const file = {
      ipfs_hash: cid.toString(),
      mimetype: req.file.mimetype,
      size: req.file.size
    };
    res.json({ file });
  } catch (error) {
    console.log(error);
    return sendError(res, 'upload failed');
  }
  await fs.unlinkSync(path);
});

export default router;
