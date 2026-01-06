import "reflect-metadata"
import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import { buildOpenAPIDocument } from './docs/openapi.js';
import { handlerError } from './middlewares/errorMiddleware.js';
import { AppDataSource } from './config/datasource.js';
import productsRouter from './modules/products/products.routes.js';


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

AppDataSource.initialize()
  .then(() => console.log("📦 Database connected"))
  .catch((err) => console.error("❌ Error connecting database:", err));



const openApiDocs = buildOpenAPIDocument()
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocs))


app.use('/products', productsRouter)

app.get('/', (req: Request, res: Response) => {
    res.send({ message: 'API de Produtos rodando com sucesso!' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});