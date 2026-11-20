// Servidor Node.js (Express) que entrega o build de produção da landing page.
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = join(__dirname, '..', 'dist');
const app = express();
const port = process.env.PORT || 3000;

app.disable('x-powered-by');
app.use('/assets', express.static(join(dist, 'assets'), { maxAge: '30d', immutable: true }));
app.use(express.static(dist, { maxAge: '1h' }));
app.get('/health', (_req, res) => res.json({ ok: true }));
app.get('*', (_req, res) => res.sendFile(join(dist, 'index.html')));

app.listen(port, () => console.log(`Pronto Week rodando em http://localhost:${port}`));
