import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';

const app: Application = express();
const PORT: number = 3000;

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:8080', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.get('/', (req: Request, res: Response) => {
    res.send({ message: 'API de Produtos rodando com sucesso!' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});