-- Criação do pacote para validação de CPF
CREATE OR REPLACE PACKAGE pkg_cpf_validation AS
    -- Função para validar CPF
    FUNCTION validate_cpf(p_cpf IN VARCHAR2) RETURN BOOLEAN;
    
    -- Função para formatar CPF
    FUNCTION format_cpf(p_cpf IN VARCHAR2) RETURN VARCHAR2;
    
    -- Função para remover caracteres não numéricos
    FUNCTION clean_cpf(p_cpf IN VARCHAR2) RETURN VARCHAR2;
END pkg_cpf_validation;
/

-- Criação do pacote para validação de CEP
CREATE OR REPLACE PACKAGE pkg_cep_validation AS
    -- Tipo para retornar dados do endereço
    TYPE t_address IS RECORD (
        cep VARCHAR2(8),
        logradouro VARCHAR2(100),
        bairro VARCHAR2(100),
        cidade VARCHAR2(100),
        estado CHAR(2)
    );
    
    -- Função para validar CEP
    FUNCTION validate_cep(p_cep IN VARCHAR2) RETURN BOOLEAN;
    
    -- Função para buscar endereço pelo CEP
    FUNCTION get_address(p_cep IN VARCHAR2) RETURN t_address;
    
    -- Função para formatar CEP
    FUNCTION format_cep(p_cep IN VARCHAR2) RETURN VARCHAR2;
END pkg_cep_validation;
/

-- Criação do pacote para endpoints ORDS
CREATE OR REPLACE PACKAGE pkg_ords_endpoints AS
    -- Procedimento para endpoint de validação de CPF
    PROCEDURE validate_cpf_endpoint(
        p_cpf IN VARCHAR2,
        p_result OUT JSON_OBJECT_T
    );
    
    -- Procedimento para endpoint de validação de CEP
    PROCEDURE validate_cep_endpoint(
        p_cep IN VARCHAR2,
        p_result OUT JSON_OBJECT_T
    );
END pkg_ords_endpoints;
/ 