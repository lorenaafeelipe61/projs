API de Pagamentos
================

Descrição
---------
Esta é uma API REST desenvolvida em .NET para gerenciamento de pagamentos. A API utiliza PostgreSQL como banco de dados e oferece endpoints para gerenciar transações de pagamento.

Especificações Técnicas
----------------------
- Framework: .NET
- Banco de Dados: PostgreSQL
- Documentação: Swagger/OpenAPI
- Porta: 50100
- URL Base: http://localhost:50100

Funcionalidades
--------------
- Gerenciamento de pagamentos
- Documentação automática via Swagger
- CORS habilitado para todas as origens
- Logs detalhados de operações
- Inicialização automática do banco de dados

Configuração do Banco de Dados
----------------------------
- Nome do banco de dados: paymentapi
- Logs detalhados habilitados
- Tratamento de erros detalhado

Segurança
--------
- CORS configurado para permitir requisições de qualquer origem
- Autorização implementada
- Logs detalhados para monitoramento

Documentação
-----------
A documentação da API está disponível através do Swagger UI na URL base do projeto.
Para acessar, basta abrir http://localhost:50100 no navegador.

Requisitos
----------
- .NET SDK
- PostgreSQL
- Navegador web para acessar a documentação Swagger

Inicialização
------------
1. Certifique-se de que o PostgreSQL está instalado e rodando
2. Execute o script CreateDatabase.sql para criar o banco de dados
3. Configure a string de conexão no arquivo de configuração
4. Execute a aplicação
5. Acesse http://localhost:50100 para ver a documentação Swagger

Observações
----------
- A API está configurada para rodar na porta 50100
- Logs detalhados estão habilitados para facilitar o debug
- O banco de dados é inicializado automaticamente com dados de exemplo 