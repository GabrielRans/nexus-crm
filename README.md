# Nexus CRM

Aplicação de gestão de clientes em desenvolvimento, com interface React e API Node.js conectada ao PostgreSQL. Projeto de portfólio focado em integração entre frontend, backend e banco de dados.

## Funcionalidades

- Cadastro, listagem, busca, edição e exclusão de clientes.
- Validação dos dados com Zod e tratamento de e-mails duplicados.
- Navegação entre dashboard e gestão de clientes.
- API com consultas SQL parametrizadas e endpoint de saúde.

## Tecnologias

React, TypeScript, Vite, React Router, Node.js, Fastify, PostgreSQL e Zod. Dependências gerenciadas com pnpm.

## Estrutura

```text
backend/src/lib/       Conexão com o banco
backend/src/routes/    Rotas da API
backend/src/schemas/   Validação dos dados
frontend/src/pages/    Dashboard e clientes
frontend/src/services/ Comunicação com a API
```

## Desenvolvimento local

Pré-requisitos: Git, Node.js compatível com as dependências, pnpm e PostgreSQL. O backend declara a versão do pnpm em seu `package.json`.

```sh
git clone https://github.com/GabrielRans/nexus-crm.git
cd nexus-crm
cd backend
pnpm install --frozen-lockfile
```

Copie `backend/.env.example` para `backend/.env` e configure `DATABASE_URL` com uma base local de desenvolvimento.

**Preparação do banco:** o repositório ainda não inclui uma migração SQL para criar a tabela `clients`. A API espera os campos `id`, `name`, `email`, `phone` e `created_at`. A inicialização do banco precisa ser documentada e versionada antes de uma instalação totalmente reproduzível.

Com o banco preparado, execute no diretório `backend`:

```sh
pnpm dev
```

Em outro terminal, dentro de `frontend`:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Abra a interface em `http://localhost:5173`. A API local usa `http://127.0.0.1:3333`; o CORS está configurado para `http://localhost:5173`. Evite executar outra API na mesma porta.

## Rotas da API

| Método | Rota | Finalidade |
| --- | --- | --- |
| GET | `/health` | Estado do serviço |
| GET | `/clients` | Listar clientes |
| GET | `/clients/:id` | Consultar cliente |
| POST | `/clients` | Cadastrar cliente |
| PUT | `/clients/:id` | Atualizar cliente |
| DELETE | `/clients/:id` | Excluir cliente |

## Verificações disponíveis

No frontend: `pnpm lint` e `pnpm build`. No backend: `pnpm build`. Esses comandos não substituem testes de integração com o banco.

## Segurança e próximos passos

O projeto usa validação de entrada, consultas parametrizadas, credenciais por variável de ambiente e escuta local da API. Ainda não há autenticação ou autorização nas rotas de clientes; CORS não substitui controle de acesso. Utilize dados fictícios e mantenha a API em ambiente local até implementar esses controles.

Próximas etapas: migrações do banco, autenticação, autorização, testes automatizados e evolução do dashboard. Não publique `.env`, credenciais ou dados reais de clientes.

## Autor

[GabrielRans](https://github.com/GabrielRans)
