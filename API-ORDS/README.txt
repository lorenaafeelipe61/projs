# API ORDS - Validação de CPF e CEP

Este projeto implementa uma API REST utilizando Oracle REST Data Services (ORDS) para validação de CPF e CEP.

## Requisitos

- Oracle Database 19c ou superior
- Oracle REST Data Services (ORDS) 22.1 ou superior
- SQL Developer ou outra ferramenta para execução de scripts PL/SQL

## Estrutura do Projeto

```
API-ORDS/
├── scripts/
│   ├── 01_create_packages.sql    # Criação dos pacotes PL/SQL
│   ├── 02_create_procedures.sql  # Procedimentos de validação
│   └── 03_create_endpoints.sql   # Configuração dos endpoints ORDS
├── docs/
│   └── api_documentation.md      # Documentação detalhada da API
└── README.txt                    # Este arquivo
```

## Funcionalidades

### Validação de CPF
- Endpoint: `/ords/api/v1/cpf/validate`
- Método: POST
- Validação completa do CPF incluindo:
  - Formato
  - Dígitos verificadores
  - CPFs inválidos conhecidos

### Validação de CEP
- Endpoint: `/ords/api/v1/cep/validate`
- Método: POST
- Validação e consulta de CEP incluindo:
  - Formato
  - Existência do CEP
  - Dados do endereço

## Como Usar

1. Configure o ambiente Oracle Database
2. Execute os scripts SQL na ordem:
   ```sql
   @scripts/01_create_packages.sql
   @scripts/02_create_procedures.sql
   @scripts/03_create_endpoints.sql
   ```
3. Configure o ORDS para o schema
4. Acesse a documentação da API em: `http://seu-servidor:8080/ords/api/v1/`

## Exemplos de Uso

### Validação de CPF
```http
POST /ords/api/v1/cpf/validate
Content-Type: application/json

{
    "cpf": "529.982.247-25"
}
```

### Validação de CEP
```http
POST /ords/api/v1/cep/validate
Content-Type: application/json

{
    "cep": "01001-000"
}
```

## Documentação

Para documentação detalhada da API, consulte o arquivo `docs/api_documentation.md`. 