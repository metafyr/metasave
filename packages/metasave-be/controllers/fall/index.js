import { createHelia } from 'helia';
import { unixfs } from '@helia/unixfs';

const fall = async (req, res) => {
  try {
    const helia = await createHelia();
    const fs = unixfs(helia);
    const file = req.file;
    const result = await fs.add(file.path);
    res.send({ cid: result });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

export default fall;
