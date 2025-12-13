# API de Produtos - Exemplo Didático

Esta é uma API REST para gerenciamento de produtos, desenvolvida como um material de estudo para demonstrar boas práticas na construção de aplicações backend com Node.js e TypeScript.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript no servidor.
- **Express**: Framework para construção de APIs.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
- **Zod**: Biblioteca para declaração e validação de schemas.
- **tsx**: Ferramenta para executar arquivos TypeScript diretamente, sem compilação prévia em desenvolvimento.
- **Morgan**: Middleware para logs de requisições HTTP.
- **CORS**: Middleware para habilitar o Cross-Origin Resource Sharing.

## Como Executar

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd product-api
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Execute em modo de desenvolvimento:**
    O servidor iniciará em `http://localhost:3000` e será reiniciado automaticamente a cada alteração no código.
    ```bash
    npm run dev
    ```

## Endpoints da API

- `GET /products`: Retorna uma lista de todos os produtos.
- `GET /products/:id`: Retorna um produto específico pelo seu ID.
- `POST /products`: Cria um novo produto. O corpo da requisição deve seguir o schema definido.

---

## Boas Práticas Aplicadas

Esta seção destaca as decisões de arquitetura e as ferramentas utilizadas que contribuem para um código mais limpo, manutenível e escalável.

### 1. Arquitetura Modular e Separação de Responsabilidades

Em vez de colocar toda a lógica em um único arquivo, a aplicação é dividida em módulos baseados em funcionalidades (`products`). Dentro de cada módulo, as responsabilidades são claramente separadas:

-   **`products.routes.ts`**: Define os endpoints da API e os associa aos controllers.
-   **`products.controller.ts`**: Orquestra o fluxo. Recebe a requisição, chama o serviço apropriado e retorna a resposta. Não contém lógica de negócio.
-   **`products.service.ts`**: Contém a lógica de negócio pura, sem depender de detalhes do Express (como `req` e `res`).
-   **`products.repository.ts`**: Abstrai o acesso aos dados. É o único lugar que sabe como e onde os dados são armazenados.

**Por que isso é bom?**
- **Manutenibilidade:** É mais fácil encontrar e modificar o código.
- **Reutilização:** A lógica de serviço pode ser facilmente reutilizada por outros partes do sistema.
- **Testabilidade:** Cada camada pode ser testada de forma isolada.

### 2. Validação de Schema com Zod

A API não confia cegamente nos dados recebidos. Antes de processar uma requisição de criação de produto, um middleware valida o corpo (`body`) para garantir que ele contenha os campos necessários e com os tipos corretos.

**Exemplo (`src/modules/products/products.routes.ts`):**
```typescript
// ...
import { validate } from "../../middlewares/zodMiddleware.js"
import { createProduct } from "./products.schema.js"

// A rota de POST usa o middleware 'validate' antes de chamar o controller 'add'
productsRouter.post('/', validate(createProduct), add)
```

**Exemplo de Schema (`src/modules/products/products.schema.ts`):**
```typescript
import { z } from 'zod';

export const createProduct = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    price: z.number().positive(),
    description: z.string().optional(),
  }),
});
```

**Por que isso é bom?**
- **Segurança e Robustez:** Protege a aplicação contra dados malformados ou maliciosos.
- **Centralização:** A "forma" dos dados é definida em um único lugar, servindo como documentação.
- **Melhor Feedback para o Cliente:** Retorna erros claros se os dados enviados estiverem incorretos.

### 3. Uso de TypeScript

O uso de TypeScript em todo o projeto adiciona segurança de tipo, o que ajuda a prevenir uma categoria inteira de bugs em tempo de desenvolvimento, em vez de em produção.

**Exemplo (`src/app.ts`):**
```typescript
import express, { type Application, type Request, type Response } from 'express';

const app: Application = express();
const PORT: number = 3000;

app.get('/', (req: Request, res: Response) => {
    res.send({ message: 'API de Produtos rodando com sucesso!' });
});
```
**Por que isso é bom?**
- **Detecção Antecipada de Erros:** O compilador avisa sobre tipos incompatíveis.
- **Autocomplete e IntelliSense:** Melhora a experiência de desenvolvimento.
- **Código Auto-Documentado:** As assinaturas de função e tipos de dados tornam o código mais fácil de entender.

### 4. Abstração da Lógica de Dados (Repository Pattern)

A camada de serviço não interage diretamente com um banco de dados. Em vez disso, ela depende de um "repositório" que expõe métodos como `getAll` ou `save`.

**Exemplo (`src/modules/products/products.repository.ts`):**
```typescript
// Exemplo hipotético de como o repositório poderia ser
interface Product {
  id: number;
  name: string;
  price: number;
}

const products: Product[] = [];
let id = 1;

export const repository = {
  getAll: (): Product[] => products,
  getById: (id: number): Product | undefined => products.find(p => p.id === id),
  save: (name: string, price: number): Product => {
    const newProduct = { id: id++, name, price };
    products.push(newProduct);
    return newProduct;
  }
}
```

**Por que isso é bom?**
- **Flexibilidade:** Se você decidir trocar o armazenamento de um array em memória para um banco de dados como PostgreSQL ou MongoDB, precisará alterar apenas o repositório. A camada de serviço e os controllers permanecem intactos.
- **Testes:** É fácil criar um "mock" do repositório para testar a lógica de negócio sem precisar de um banco de dados real.

### 5. Middlewares para Tarefas Comuns

A aplicação utiliza middlewares do Express para lidar com tarefas transversais, como logging de requisições e configuração de CORS.

**Exemplo (`src/app.ts`):**
```typescript
import cors from 'cors';
import morgan from 'morgan'

// ...
app.use(morgan('tiny'))
app.use(cors({
    origin: 'http://localhost:8080', 
}));
```
**Por que isso é bom?**
- **Código DRY (Don't Repeat Yourself):** Evita a repetição de código em todas as rotas.
- **Organização:** Mantém a lógica de cada rota focada em sua tarefa principal, delegando preocupações comuns aos middlewares.
