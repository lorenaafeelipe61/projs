# Frontend - API de Pagamentos

Este é o frontend da aplicação API de Pagamentos, desenvolvido com React, TypeScript e Material-UI.

## Tecnologias Utilizadas

- React 18
- TypeScript
- Material-UI (MUI)
- React Router
- Axios
- Vite

## Estrutura do Projeto

```
src/
  ├── components/     # Componentes reutilizáveis
  ├── pages/         # Páginas da aplicação
  ├── services/      # Serviços de API
  ├── contexts/      # Contextos React
  ├── types/         # Definições de tipos TypeScript
  └── utils/         # Funções utilitárias
```

## Funcionalidades

- Login de usuário
- Cadastro de usuários
- Gerenciamento de cartões de crédito
- Gerenciamento de métodos de pagamento
- Dashboard com resumo de informações

## Como Executar

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

3. Acesse a aplicação em `http://localhost:3000`

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Cria a build de produção
- `npm run preview`: Visualiza a build de produção localmente
- `npm run lint`: Executa a verificação de linting

## Variáveis de Ambiente

- `VITE_API_URL`: URL da API backend
- `VITE_APP_NAME`: Nome da aplicação

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request 