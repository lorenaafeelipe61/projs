Frontend - API de Pagamentos
===========================

Este é o frontend do projeto API de Pagamentos, desenvolvido com React e TypeScript.

Estrutura do Projeto
------------------
/frontend/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── pages/         # Páginas da aplicação
│   ├── services/      # Serviços de API
│   ├── types/         # Definições de tipos TypeScript
│   └── utils/         # Funções utilitárias
├── public/            # Arquivos estáticos
└── package.json       # Dependências e scripts

Funcionalidades
-------------
1. Autenticação
   - Login com usuário master
   - Validação de credenciais

2. Gerenciamento de Usuários
   - Cadastro de usuários
   - Listagem de usuários
   - Edição de usuários
   - Exclusão de usuários

3. Gerenciamento de Cartões de Crédito
   - Cadastro de cartões
   - Listagem de cartões
   - Edição de cartões
   - Exclusão de cartões

4. Gerenciamento de Métodos de Pagamento
   - Cadastro de métodos
   - Listagem de métodos
   - Edição de métodos
   - Exclusão de métodos

Tecnologias Utilizadas
--------------------
- React
- TypeScript
- Vite
- Axios (para requisições HTTP)
- React Router (para navegação)
- Material-UI (para componentes de interface)

Como Executar
------------
1. Instalar dependências:
   npm install

2. Executar em modo de desenvolvimento:
   npm run dev

3. Construir para produção:
   npm run build

4. Visualizar build de produção:
   npm run preview 