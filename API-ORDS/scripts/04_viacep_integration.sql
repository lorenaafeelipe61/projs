-- Criação do pacote para integração com ViaCEP
CREATE OR REPLACE PACKAGE pkg_viacep_integration AS
    -- Função para buscar endereço na ViaCEP
    FUNCTION get_address_viacep(p_cep IN VARCHAR2) RETURN JSON_OBJECT_T;
    
    -- Função para validar resposta da ViaCEP
    FUNCTION validate_viacep_response(p_response IN JSON_OBJECT_T) RETURN BOOLEAN;
END pkg_viacep_integration;
/

-- Implementação do pacote ViaCEP
CREATE OR REPLACE PACKAGE BODY pkg_viacep_integration AS
    -- Função para validar resposta da ViaCEP
    FUNCTION validate_viacep_response(p_response IN JSON_OBJECT_T) RETURN BOOLEAN IS
        v_erro VARCHAR2(1);
    BEGIN
        -- Verifica se há erro na resposta
        BEGIN
            v_erro := p_response.get_string('erro');
            RETURN FALSE;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                RETURN TRUE;
        END;
    END validate_viacep_response;
    
    -- Função para buscar endereço na ViaCEP
    FUNCTION get_address_viacep(p_cep IN VARCHAR2) RETURN JSON_OBJECT_T IS
        v_cep VARCHAR2(8);
        v_response JSON_OBJECT_T;
        v_address pkg_cep_validation.t_address;
    BEGIN
        -- Limpa o CEP
        v_cep := REGEXP_REPLACE(p_cep, '[^0-9]', '');
        
        -- Faz a chamada para a API ViaCEP
        v_response := APEX_WEB_SERVICE.MAKE_REST_REQUEST(
            p_url => 'https://viacep.com.br/ws/' || v_cep || '/json/',
            p_http_method => 'GET'
        );
        
        -- Verifica se a resposta é válida
        IF validate_viacep_response(v_response) THEN
            -- Mapeia a resposta para o tipo t_address
            v_address.cep := v_response.get_string('cep');
            v_address.logradouro := v_response.get_string('logradouro');
            v_address.bairro := v_response.get_string('bairro');
            v_address.cidade := v_response.get_string('localidade');
            v_address.estado := v_response.get_string('uf');
            
            -- Retorna o endereço como JSON
            RETURN JSON_OBJECT_T()
                .put('cep', v_address.cep)
                .put('logradouro', v_address.logradouro)
                .put('bairro', v_address.bairro)
                .put('cidade', v_address.cidade)
                .put('estado', v_address.estado);
        ELSE
            RETURN NULL;
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            RETURN NULL;
    END get_address_viacep;
END pkg_viacep_integration;
/

-- Atualização do pacote de validação de CEP para usar a ViaCEP
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
        v_viacep_response JSON_OBJECT_T;
    BEGIN
        -- Busca o endereço na ViaCEP
        v_viacep_response := pkg_viacep_integration.get_address_viacep(p_cep);
        
        IF v_viacep_response IS NOT NULL THEN
            -- Mapeia a resposta para o tipo t_address
            v_address.cep := v_viacep_response.get_string('cep');
            v_address.logradouro := v_viacep_response.get_string('logradouro');
            v_address.bairro := v_viacep_response.get_string('bairro');
            v_address.cidade := v_viacep_response.get_string('cidade');
            v_address.estado := v_viacep_response.get_string('estado');
            
            RETURN v_address;
        ELSE
            RETURN NULL;
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            RETURN NULL;
    END get_address;
END pkg_cep_validation;
/ 