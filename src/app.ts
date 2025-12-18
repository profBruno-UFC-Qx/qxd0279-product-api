import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';
import morgan from 'morgan'
import productsRouter from './modules/products/products.routes.js';
import { handlerError } from './middlewares/errorMiddleware.js';

const app: Application = express();
const PORT: number = 3000;

app.use(express.json())
app.use(handlerError)
app.use(morgan('tiny'))
app.use(cors({
    origin: 'http://localhost:8080', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use('/products', productsRouter)

app.get('/', (req: Request, res: Response) => {
    res.send({ message: 'API de Produtos rodando com sucesso!' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});