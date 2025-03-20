# API ORDS - Validação de CPF e CEP

Este projeto implementa uma API REST utilizando Oracle REST Data Services (ORDS) para validação de CPF e CEP.

## Requisitos

- Oracle Database 19c ou superior
- Oracle REST Data Services (ORDS) 22.1 ou superior
- SQL Developer ou outra ferramenta para execução de scripts PL/SQL
- APEX Web Service habilitado no Oracle Database

## Estrutura do Projeto

```
API-ORDS/
├── scripts/
│   ├── 01_create_packages.sql    # Criação dos pacotes PL/SQL
│   ├── 02_create_procedures.sql  # Procedimentos de validação
│   ├── 03_create_endpoints.sql   # Configuração dos endpoints ORDS
│   └── 04_viacep_integration.sql # Integração com API ViaCEP
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
  - Dados do endereço (integração com ViaCEP)

## Como Usar

1. Configure o ambiente Oracle Database
2. Habilite o APEX Web Service no Oracle Database
3. Execute os scripts SQL na ordem:
   ```sql
   @scripts/01_create_packages.sql
   @scripts/02_create_procedures.sql
   @scripts/03_create_endpoints.sql
   @scripts/04_viacep_integration.sql
   ```
4. Configure o ORDS para o schema
5. Acesse a documentação da API em: `http://seu-servidor:8080/ords/api/v1/`

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

## Integração com ViaCEP

O projeto utiliza a API pública ViaCEP para consulta de endereços. A integração é feita através do pacote `pkg_viacep_integration`, que:

1. Faz requisições HTTP para a API ViaCEP
2. Valida as respostas recebidas
3. Mapeia os dados para o formato interno da aplicação
4. Trata erros e casos especiais

Para usar a integração com ViaCEP, é necessário:
1. Ter o APEX Web Service habilitado no Oracle Database
2. Ter acesso à internet para consultar a API ViaCEP
3. Executar o script `04_viacep_integration.sql` 