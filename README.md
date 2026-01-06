# API de Produtos - Exemplo Didático

Esta é uma API REST para gerenciamento de produtos, desenvolvida como um material de estudo para demonstrar boas práticas na construção de aplicações backend com Node.js e TypeScript.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript no servidor.
- **Express**: Framework para construção de APIs.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
- **TypeORM**: ORM (Object-Relational Mapper) para interação com o banco de dados.
- **SQLite3**: Banco de dados SQL leve e baseado em arquivo, usado para desenvolvimento.
- **Zod**: Biblioteca para declaração e validação de schemas.
- **@asteasolutions/zod-to-openapi**: Ferramenta para gerar documentação OpenAPI (Swagger) a partir de schemas Zod.
- **swagger-ui-express**: Middleware para servir a interface do Swagger UI.
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
    O servidor iniciará em `http://localhost:3000` e será reiniciado automaticamente a cada alteração no código. O TypeORM criará um arquivo `database.sqlite` na raiz do projeto para armazenar os dados.
    ```bash
    npm run dev
    ```

## Documentação da API

A documentação completa da API, gerada automaticamente, está disponível em:

- **[http://localhost:3000/docs](http://localhost:3000/docs)**

## Endpoints da API

O CRUD de produtos está completo e todos os endpoints estão documentados via Swagger.

- `GET /products`: Retorna uma lista de todos os produtos.
- `GET /products/:id`: Retorna um produto específico pelo seu ID.
- `POST /products`: Cria um novo produto. O corpo da requisição deve seguir o schema definido.
- `PUT /products/:id`: Atualiza um produto existente.
- `DELETE /products/:id`: Remove um produto pelo seu ID.

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
- **Reutilização:** A lógica de serviço pode ser facilmente reutilizada por outras partes do sistema.
- **Testabilidade:** Cada camada pode ser testada de forma isolada.

### 2. Persistência de Dados com TypeORM e Padrão Repository

A versão anterior desta API armazenava os dados em um array em memória, o que significava que os dados eram perdidos a cada reinicialização do servidor. Esta versão introduz a persistência de dados usando **TypeORM**, um poderoso ORM para TypeScript.

-   **Configuração do Banco de Dados (`src/config/datasource.ts`)**:
    Aqui é configurada a conexão com o banco de dados. Para este projeto, usamos o **SQLite**, um banco de dados leve que armazena tudo em um único arquivo (`database.sqlite`). A opção `synchronize: true` é ideal para desenvolvimento, pois cria e atualiza o schema do banco de dados automaticamente com base nas entidades.

-   **Entidades (`src/modules/products/products.entity.ts`)**:
    Uma entidade é uma classe que mapeia para uma tabela no banco de dados. A classe `Product` é decorada com anotações do TypeORM (`@Entity`, `@Column`, `@PrimaryGeneratedColumn`) para definir a estrutura da tabela `product`.

-   **Padrão Repository (`src/modules/products/products.repository.ts`)**:
    A camada de serviço não interage diretamente com o TypeORM. Em vez disso, ela depende de um "repositório". O `ProductRepository` é criado estendendo o repositório base do TypeORM, o que nos permite adicionar métodos customizados para consultas específicas.

**Por que isso é bom?**
-   **Abstração e Flexibilidade:** A lógica de negócio no serviço não sabe qual banco de dados está sendo usado. Se decidirmos trocar o SQLite por PostgreSQL, apenas a configuração do `datasource` e talvez o repositório precisariam ser alterados. A camada de serviço permanece intacta.
-   **Código Organizado:** A lógica de acesso a dados fica centralizada no repositório, tornando o código mais limpo e fácil de manter.
-   **Poder do ORM:** O TypeORM oferece recursos avançados como migrações, relações entre entidades e um construtor de consultas robusto, facilitando o trabalho com bancos de dados complexos.

### 3. Validação de Schema com Zod

A API não confia cegamente nos dados recebidos. Antes de processar uma requisição, um middleware valida o corpo (`body`), os parâmetros (`params`) ou as queries (`query`) para garantir que eles contenham os campos necessários e com os tipos corretos.

**Exemplo (`src/modules/products/products.routes.ts`):**
```typescript
// ...
import { validate } from "../../middlewares/zodMiddleware.js"
import { createProductSchema } from "./products.schema.js"

// A rota de POST usa o middleware 'validate' antes de chamar o controller
productsRouter.post('/', validate(createProductSchema), add)
```

**Por que isso é bom?**
- **Segurança e Robustez:** Protege a aplicação contra dados malformados ou maliciosos.
- **Centralização:** A "forma" dos dados é definida em um único lugar, servindo como documentação viva.
- **Melhor Feedback para o Cliente:** Retorna erros claros se os dados enviados estiverem incorretos.

### 4. Documentação Automatizada com Swagger e Zod

Manter a documentação da API atualizada é um desafio. Esta API resolve isso gerando a documentação dinamicamente a partir dos próprios schemas Zod.

Usamos a biblioteca **`@asteasolutions/zod-to-openapi`** para converter os schemas de validação em definições OpenAPI (Swagger). Em seguida, o **`swagger-ui-express`** serve uma página interativa com todos os endpoints.

**Exemplo (`src/docs/openapi.ts`):**
```typescript
import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';


const registry = new OpenAPIRegistry();
// ... registro das rotas ...

export const buildOpenAPIDocument = (): ReturnType<OpenApiGeneratorV3['generateDocument']> => {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
        version: '1.0.0',
        title: 'API de Produtos',
    },
  });
}
```

**Por que isso é bom?**
- **Fonte Única de Verdade (Single Source of Truth):** A validação e a documentação são baseadas no mesmo schema. Se você atualizar o schema, a documentação é atualizada automaticamente.
- **Sempre Atualizada:** Elimina o risco de a documentação ficar obsoleta em relação ao código.
- **Desenvolvimento Eficiente:** Facilita o consumo da API por outros desenvolvedores (frontend ou outros serviços).

### 5. Middleware Centralizado para Tratamento de Erros

A aplicação possui um middleware de erro que captura todas as exceções lançadas nos controllers ou serviços, evitando que o servidor quebre (`crash`) e garantindo que uma resposta de erro formatada seja enviada ao cliente.

**Exemplo (`src/app.ts`):**
```typescript
// ...
import { handlerError } from './middlewares/errorMiddleware.js';

// ...
app.use(handlerError) // Registrado após as rotas
```

**Exemplo (`src/middlewares/errorMiddleware.ts`):**
```typescript
export const handlerError = (err, req, res, next) => {
  // Lógica para formatar e logar o erro
  const statusCode = err.statusCode || 500;
  res.status(statusCode).send({
    message: err.message || 'Erro interno do servidor',
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
```

**Por que isso é bom?**
- **Robustez:** Impede que erros não tratados parem a aplicação.
- **Consistência:** Padroniza o formato das respostas de erro em toda a API.
- **Segurança:** Evita o vazamento de detalhes sensíveis da implementação (como *stack traces*) em ambiente de produção.

### 6. Uso de TypeScript para Segurança de Tipo

O uso de TypeScript em todo o projeto adiciona segurança de tipo, o que ajuda a prevenir uma categoria inteira de bugs em tempo de desenvolvimento, em vez de em produção.

**Por que isso é bom?**
- **Detecção Antecipada de Erros:** O compilador avisa sobre tipos incompatíveis.
- **Autocomplete e IntelliSense:** Melhora a experiência de desenvolvimento.
- **Código Auto-Documentado:** As assinaturas de função e tipos de dados tornam o código mais fácil de entender.

### 7. Middlewares para Tarefas Comuns

A aplicação utiliza middlewares do Express para lidar com tarefas transversais, como logging de requisições (`morgan`) e configuração de CORS.

**Por que isso é bom?**
- **Código DRY (Don't Repeat Yourself):** Evita a repetição de código em todas as rotas.
- **Organização:** Mantém a lógica de cada rota focada em sua tarefa principal.