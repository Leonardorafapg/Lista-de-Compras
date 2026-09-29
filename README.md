# Lista de Compras

Sistema web de lista de compras doméstica: cadastre produtos e receitas, planeje as refeições em um calendário e gere automaticamente a lista de compras somando os ingredientes das receitas planejadas.

## Stack

**Frontend:** React + TypeScript + Vite + Tailwind CSS + React Router + Lucide React
**Backend:** Python + FastAPI + SQLAlchemy + Pydantic + Alembic
**Banco de dados:** PostgreSQL

## Estrutura do projeto

```
.
├── backend/
│   ├── app/
│   │   ├── models/        # Modelos SQLAlchemy (tabelas do banco)
│   │   ├── schemas/       # Schemas Pydantic (validação/serialização)
│   │   ├── routers/       # Endpoints da API, organizados por domínio
│   │   ├── services/      # Regras de negócio (inclui a geração da lista de compras)
│   │   ├── config.py      # Configurações (variáveis de ambiente)
│   │   ├── database.py    # Conexão com o banco e sessão
│   │   ├── exceptions.py  # Exceções de domínio (NotFound, Conflict)
│   │   └── main.py        # Instância FastAPI e registro dos routers
│   ├── alembic/           # Migrations do banco de dados
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/            # Funções de acesso à API REST (por domínio)
    │   ├── hooks/          # Hooks de dados (estado, loading, error, mutações)
    │   ├── components/
    │   │   ├── ui/         # Componentes de interface genéricos (Button, Modal, etc.)
    │   │   ├── layout/     # Sidebar, navegação mobile, layout geral
    │   │   ├── categories/ # Formulário de categoria
    │   │   ├── products/   # Formulário de produto
    │   │   ├── recipes/    # Formulários de receita e ingredientes
    │   │   ├── calendar/   # Visualizações de semana/mês e formulário de planejamento
    │   │   └── shopping-list/ # Itens, grupos por categoria e formulários da lista
    │   ├── pages/          # Páginas/rotas da aplicação
    │   ├── lib/            # Utilitários (datas, cores, className)
    │   └── types/          # Tipos TypeScript compartilhados
    └── .env.example
```

## Pré-requisitos

- **Python 3.11+** (recomendado; veja nota abaixo sobre versões mais novas)
- **Node.js 20+** e npm
- **PostgreSQL 14+** em execução localmente (ou via Docker)

> **Nota sobre Python:** o backend foi validado nesta máquina com Python 3.14. Caso use uma versão de Python muito recente e alguma dependência não tenha wheel pré-compilado disponível ainda, prefira Python 3.11 ou 3.12, que têm suporte mais maduro no ecossistema científico/binário do Windows.

## Configurando o PostgreSQL

Crie um banco de dados vazio para a aplicação:

```sql
CREATE DATABASE lista_de_compras;
```

Se preferir usar Docker em vez de uma instalação local:

```bash
docker run --name lista-compras-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=lista_de_compras -p 5432:5432 -d postgres:16
```

## Backend

### 1. Criar e ativar o ambiente virtual

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux/Mac
source .venv/bin/activate
```

### 2. Instalar dependências

```bash
pip install -r requirements.txt
```

### 3. Configurar variáveis de ambiente

Copie o arquivo de exemplo e ajuste conforme necessário:

```bash
cp .env.example .env
```

Variáveis disponíveis (`backend/.env`):

| Variável | Descrição | Padrão |
|---|---|---|
| `DATABASE_URL` | String de conexão do PostgreSQL | `postgresql+psycopg://postgres:postgres@localhost:5432/lista_de_compras` |
| `CORS_ORIGINS` | Origens permitidas para o frontend (separadas por vírgula) | `http://localhost:5173` |

### 4. Executar as migrations

```bash
alembic upgrade head
```

### 5. Rodar o servidor de desenvolvimento

```bash
uvicorn app.main:app --reload
```

A API ficará disponível em `http://localhost:8000`. Documentação interativa (Swagger) em `http://localhost:8000/docs`.

## Frontend

### 1. Instalar dependências

```bash
cd frontend
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

| Variável | Descrição | Padrão |
|---|---|---|
| `VITE_API_URL` | URL base da API do backend | `http://localhost:8000` |

### 3. Rodar o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação ficará disponível em `http://localhost:5173`.

### Outros comandos

```bash
npm run build     # build de produção (roda o type-check antes)
npm run preview   # serve o build de produção localmente
npm run lint       # lint com oxlint
```

## PWA — adicionar à tela de início do iPhone

O frontend é um PWA (`vite-plugin-pwa`): tem manifest, ícones e service worker para funcionar como app instalável. O service worker só é gerado no **build de produção** (`npm run build`), não no `npm run dev`.

Para instalar no iPhone, o Safari precisa acessar a build de produção pela rede (não `localhost`, que só existe no seu computador):

1. Gere a build e sirva-a expondo a rede local:
   ```bash
   cd frontend
   npm run build
   npm run preview -- --host
   ```
2. Anote o endereço "Network" que aparecer (algo como `http://192.168.0.x:4173`) e configure `VITE_API_URL` (no `.env` do frontend, antes do build) para apontar para o IP da máquina que roda o backend, ex: `http://192.168.0.x:8000` — sem isso o iPhone não vai conseguir falar com a API.
3. No iPhone, com o mesmo Wi-Fi, abra esse endereço no Safari.
4. Toque no botão de compartilhar → **Adicionar à Tela de Início**.

Para uso real (fora da rede local), publique o backend e o frontend em um host com HTTPS (ex: Render/Fly.io para a API e Vercel/Netlify para o frontend) e aponte `VITE_API_URL` para a URL pública da API.

## Fluxo de uso

1. Cadastre **categorias** (ex: Alimentação, Limpeza).
2. Cadastre **produtos**, associando cada um a uma categoria e unidade de medida.
3. Crie **receitas** e adicione ingredientes (sempre selecionados a partir dos produtos cadastrados). Toda receita é calculada para 5 pessoas.
4. No **calendário**, associe receitas a datas e tipos de refeição (café da manhã, almoço, jantar ou outro).
5. Na tela de **lista de compras**, gere uma nova lista escolhendo a semana atual ou um período personalizado. O sistema soma automaticamente os ingredientes de todas as receitas planejadas no período, agrupados por produto.
6. Marque itens como comprados, edite quantidades ou adicione itens manualmente (sempre a partir de produtos cadastrados) sem alterar a receita original.
7. Se o planejamento do calendário mudar depois da lista criada, use **"Regenerar lista"** para recalcular os itens a partir do calendário atual — a lista não é atualizada automaticamente.

## Regras de negócio importantes

- Uma receita sempre representa 5 pessoas (não há sistema de porções nesta versão).
- Um ingrediente de receita sempre referencia um produto cadastrado.
- A quantidade do ingrediente pertence à receita; a quantidade do item da lista pertence à lista — editar uma não afeta a outra.
- Ao gerar uma lista, produtos iguais (mesmo `product_id`) são somados e não duplicados.
- Uma categoria não pode ser excluída se possuir produtos associados; um produto não pode ser excluído se estiver em uso em receitas ou listas.
- Uma lista de compras é uma fotografia do planejamento no momento em que foi criada. Alterações posteriores no calendário só se refletem na lista através da ação explícita "Regenerar lista".
