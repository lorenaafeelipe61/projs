# Documentação da API ORDS - Validação de CPF e CEP

Esta documentação descreve os endpoints disponíveis na API de validação de CPF e CEP.

## Base URL

```
http://seu-servidor:8080/ords/api/v1/
```

## Endpoints

### Validação de CPF

#### POST /cpf/validate

Valida um CPF e retorna informações sobre sua validade.

**Request Body:**
```json
{
    "cpf": "529.982.247-25"
}
```

**Response:**
```json
{
    "cpf": "529.982.247-25",
    "isValid": true,
    "message": "CPF válido"
}
```

**Códigos de Resposta:**
- 200: CPF válido
- 400: CPF inválido

### Validação de CEP

#### POST /cep/validate

Valida um CEP e retorna informações sobre o endereço associado, utilizando a API ViaCEP.

**Request Body:**
```json
{
    "cep": "01001-000"
}
```

**Response:**
```json
{
    "cep": "01001-000",
    "isValid": true,
    "address": {
        "logradouro": "Praça da Sé",
        "bairro": "Sé",
        "cidade": "São Paulo",
        "estado": "SP"
    },
    "message": "CEP válido"
}
```

**Códigos de Resposta:**
- 200: CEP válido e encontrado
- 400: CEP inválido
- 404: CEP não encontrado
- 503: Erro ao consultar ViaCEP

## Exemplos de Uso

### cURL

#### Validação de CPF
```bash
curl -X POST \
  http://seu-servidor:8080/ords/api/v1/cpf/validate \
  -H 'Content-Type: application/json' \
  -d '{
    "cpf": "529.982.247-25"
}'
```

#### Validação de CEP
```bash
curl -X POST \
  http://seu-servidor:8080/ords/api/v1/cep/validate \
  -H 'Content-Type: application/json' \
  -d '{
    "cep": "01001-000"
}'
```

### Python

#### Validação de CPF
```python
import requests

url = "http://seu-servidor:8080/ords/api/v1/cpf/validate"
data = {
    "cpf": "529.982.247-25"
}

response = requests.post(url, json=data)
print(response.json())
```

#### Validação de CEP
```python
import requests

url = "http://seu-servidor:8080/ords/api/v1/cep/validate"
data = {
    "cep": "01001-000"
}

response = requests.post(url, json=data)
print(response.json())
```

## Notas

1. A API aceita CPFs e CEPs com ou sem formatação
2. A resposta sempre inclui o valor formatado
3. A validação de CEP utiliza a API pública ViaCEP
4. A API retorna mensagens em português
5. Para CEPs, é necessário ter o APEX Web Service habilitado no Oracle Database
6. A API ViaCEP tem limites de requisição, consulte a documentação oficial

## Integração com ViaCEP

A API utiliza a ViaCEP para consulta de endereços. Algumas considerações importantes:

1. A ViaCEP é uma API pública e gratuita
2. Não é necessário cadastro ou chave de API
3. A API tem limites de requisição por minuto
4. Em caso de falha na consulta, a API retornará erro 503
5. Os dados retornados são atualizados periodicamente pela ViaCEP

Para mais informações sobre a ViaCEP, consulte: https://viacep.com.br/ 