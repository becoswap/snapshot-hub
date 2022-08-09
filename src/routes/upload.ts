import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { sendError } from '../helpers/utils';
import { create, IPFSHTTPClient } from 'ipfs-http-client';

const router = express.Router();

const fileSize = 1000 * 1000;
const upload = multer({ dest: 'uploads/', limits: { fileSize } });

const ipfsClient: IPFSHTTPClient = create(process.env.IPFS as any);

router.post('/upload', upload.single('file'), async (req, res) => {
  const path = `${req.file.destination}${req.file.filename}`;
  const readableStreamForFile = fs.createReadStream(path);
  try {
    const result = await ipfsClient.add(readableStreamForFile);
    const file = {
      ipfs_hash: result.cid.toString(),
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
