-- Implementação do pacote de validação de CPF
CREATE OR REPLACE PACKAGE BODY pkg_cpf_validation AS
    -- Função para remover caracteres não numéricos
    FUNCTION clean_cpf(p_cpf IN VARCHAR2) RETURN VARCHAR2 IS
        v_clean VARCHAR2(11);
    BEGIN
        v_clean := REGEXP_REPLACE(p_cpf, '[^0-9]', '');
        RETURN v_clean;
    END clean_cpf;
    
    -- Função para formatar CPF
    FUNCTION format_cpf(p_cpf IN VARCHAR2) RETURN VARCHAR2 IS
        v_clean VARCHAR2(11);
    BEGIN
        v_clean := clean_cpf(p_cpf);
        RETURN SUBSTR(v_clean, 1, 3) || '.' || 
               SUBSTR(v_clean, 4, 3) || '.' || 
               SUBSTR(v_clean, 7, 3) || '-' || 
               SUBSTR(v_clean, 10, 2);
    END format_cpf;
    
    -- Função para validar CPF
    FUNCTION validate_cpf(p_cpf IN VARCHAR2) RETURN BOOLEAN IS
        v_cpf VARCHAR2(11);
        v_digit1 NUMBER;
        v_digit2 NUMBER;
        v_sum NUMBER;
        v_rest NUMBER;
    BEGIN
        -- Limpa o CPF
        v_cpf := clean_cpf(p_cpf);
        
        -- Verifica se tem 11 dígitos
        IF LENGTH(v_cpf) != 11 THEN
            RETURN FALSE;
        END IF;
        
        -- Verifica se todos os dígitos são iguais
        IF REGEXP_LIKE(v_cpf, '^(\d)\1+$') THEN
            RETURN FALSE;
        END IF;
        
        -- Calcula primeiro dígito verificador
        v_sum := 0;
        FOR i IN 1..9 LOOP
            v_sum := v_sum + TO_NUMBER(SUBSTR(v_cpf, i, 1)) * (11 - i);
        END LOOP;
        v_rest := MOD(v_sum * 10, 11);
        IF v_rest = 10 OR v_rest = 11 THEN
            v_rest := 0;
        END IF;
        v_digit1 := v_rest;
        
        -- Calcula segundo dígito verificador
        v_sum := 0;
        FOR i IN 1..10 LOOP
            v_sum := v_sum + TO_NUMBER(SUBSTR(v_cpf, i, 1)) * (12 - i);
        END LOOP;
        v_rest := MOD(v_sum * 10, 11);
        IF v_rest = 10 OR v_rest = 11 THEN
            v_rest := 0;
        END IF;
        v_digit2 := v_rest;
        
        -- Verifica se os dígitos calculados correspondem aos dígitos informados
        RETURN v_digit1 = TO_NUMBER(SUBSTR(v_cpf, 10, 1)) AND 
               v_digit2 = TO_NUMBER(SUBSTR(v_cpf, 11, 1));
    END validate_cpf;
END pkg_cpf_validation;
/

-- Implementação do pacote de validação de CEP
CREATE OR REPLACE PACKAGE BODY pkg_cep_validation AS
    -- Função para formatar CEP
    FUNCTION format_cep(p_cep IN VARCHAR2) RETURN VARCHAR2 IS
        v_clean VARCHAR2(8);
    BEGIN
        v_clean := REGEXP_REPLACE(p_cep, '[^0-9]', '');
        RETURN SUBSTR(v_clean, 1, 5) || '-' || SUBSTR(v_clean, 6, 3);
    END format_cep;
    
    -- Função para validar CEP
    FUNCTION validate_cep(p_cep IN VARCHAR2) RETURN BOOLEAN IS
        v_clean VARCHAR2(8);
    BEGIN
        v_clean := REGEXP_REPLACE(p_cep, '[^0-9]', '');
        RETURN LENGTH(v_clean) = 8;
    END validate_cep;
    
    -- Função para buscar endereço pelo CEP
    FUNCTION get_address(p_cep IN VARCHAR2) RETURN t_address IS
        v_address t_address;
        v_clean VARCHAR2(8);
    BEGIN
        v_clean := REGEXP_REPLACE(p_cep, '[^0-9]', '');
        
        -- Aqui você implementaria a lógica para buscar o endereço
        -- Por exemplo, usando uma tabela de CEPs ou uma API externa
        -- Este é apenas um exemplo
        SELECT cep, logradouro, bairro, cidade, estado
        INTO v_address.cep, v_address.logradouro, v_address.bairro, 
             v_address.cidade, v_address.estado
        FROM enderecos
        WHERE cep = v_clean;
        
        RETURN v_address;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN NULL;
    END get_address;
END pkg_cep_validation;
/

-- Implementação do pacote de endpoints ORDS
CREATE OR REPLACE PACKAGE BODY pkg_ords_endpoints AS
    -- Procedimento para endpoint de validação de CPF
    PROCEDURE validate_cpf_endpoint(
        p_cpf IN VARCHAR2,
        p_result OUT JSON_OBJECT_T
    ) IS
        v_is_valid BOOLEAN;
        v_formatted_cpf VARCHAR2(14);
    BEGIN
        v_is_valid := pkg_cpf_validation.validate_cpf(p_cpf);
        v_formatted_cpf := pkg_cpf_validation.format_cpf(p_cpf);
        
        p_result := JSON_OBJECT_T();
        p_result.put('cpf', v_formatted_cpf);
        p_result.put('isValid', v_is_valid);
        p_result.put('message', CASE 
            WHEN v_is_valid THEN 'CPF válido'
            ELSE 'CPF inválido'
        END);
    END validate_cpf_endpoint;
    
    -- Procedimento para endpoint de validação de CEP
    PROCEDURE validate_cep_endpoint(
        p_cep IN VARCHAR2,
        p_result OUT JSON_OBJECT_T
    ) IS
        v_is_valid BOOLEAN;
        v_formatted_cep VARCHAR2(9);
        v_address pkg_cep_validation.t_address;
    BEGIN
        v_is_valid := pkg_cep_validation.validate_cep(p_cep);
        v_formatted_cep := pkg_cep_validation.format_cep(p_cep);
        v_address := pkg_cep_validation.get_address(p_cep);
        
        p_result := JSON_OBJECT_T();
        p_result.put('cep', v_formatted_cep);
        p_result.put('isValid', v_is_valid);
        
        IF v_is_valid AND v_address IS NOT NULL THEN
            p_result.put('address', JSON_OBJECT_T()
                .put('logradouro', v_address.logradouro)
                .put('bairro', v_address.bairro)
                .put('cidade', v_address.cidade)
                .put('estado', v_address.estado)
            );
        END IF;
        
        p_result.put('message', CASE 
            WHEN NOT v_is_valid THEN 'CEP inválido'
            WHEN v_address IS NULL THEN 'CEP não encontrado'
            ELSE 'CEP válido'
        END);
    END validate_cep_endpoint;
END pkg_ords_endpoints;
/ 