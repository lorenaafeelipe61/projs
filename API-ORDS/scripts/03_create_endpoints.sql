-- Configuração do endpoint de validação de CPF
BEGIN
    ORDS.ENABLE_SCHEMA(
        p_enabled => TRUE,
        p_schema => USER,
        p_url_mapping_type => 'BASE_PATH',
        p_url_mapping_pattern => 'api',
        p_auto_rest_auth => FALSE
    );
END;
/

-- Endpoint de validação de CPF
BEGIN
    ORDS.DEFINE_TEMPLATE(
        p_module_name => 'v1',
        p_pattern => 'cpf/validate',
        p_priority => 0
    );
    
    ORDS.DEFINE_HANDLER(
        p_module_name => 'v1',
        p_pattern => 'cpf/validate',
        p_method => 'POST',
        p_source_type => ORDS.source_type_plsql,
        p_source => 'BEGIN pkg_ords_endpoints.validate_cpf_endpoint(:cpf, :result); END;',
        p_items_per_page => 0,
        p_mimes_allowed => 'application/json',
        p_comments => 'Endpoint para validação de CPF'
    );
    
    ORDS.DEFINE_PARAMETER(
        p_module_name => 'v1',
        p_pattern => 'cpf/validate',
        p_method => 'POST',
        p_name => 'cpf',
        p_bind_variable_name => 'cpf',
        p_source_type => ORDS.param_type_body,
        p_param_type => 'STRING',
        p_access_method => 'IN',
        p_comments => 'CPF a ser validado'
    );
    
    ORDS.DEFINE_PARAMETER(
        p_module_name => 'v1',
        p_pattern => 'cpf/validate',
        p_method => 'POST',
        p_name => 'result',
        p_bind_variable_name => 'result',
        p_source_type => ORDS.param_type_response,
        p_param_type => 'JSON',
        p_access_method => 'OUT',
        p_comments => 'Resultado da validação'
    );
END;
/

-- Endpoint de validação de CEP
BEGIN
    ORDS.DEFINE_TEMPLATE(
        p_module_name => 'v1',
        p_pattern => 'cep/validate',
        p_priority => 0
    );
    
    ORDS.DEFINE_HANDLER(
        p_module_name => 'v1',
        p_pattern => 'cep/validate',
        p_method => 'POST',
        p_source_type => ORDS.source_type_plsql,
        p_source => 'BEGIN pkg_ords_endpoints.validate_cep_endpoint(:cep, :result); END;',
        p_items_per_page => 0,
        p_mimes_allowed => 'application/json',
        p_comments => 'Endpoint para validação de CEP'
    );
    
    ORDS.DEFINE_PARAMETER(
        p_module_name => 'v1',
        p_pattern => 'cep/validate',
        p_method => 'POST',
        p_name => 'cep',
        p_bind_variable_name => 'cep',
        p_source_type => ORDS.param_type_body,
        p_param_type => 'STRING',
        p_access_method => 'IN',
        p_comments => 'CEP a ser validado'
    );
    
    ORDS.DEFINE_PARAMETER(
        p_module_name => 'v1',
        p_pattern => 'cep/validate',
        p_method => 'POST',
        p_name => 'result',
        p_bind_variable_name => 'result',
        p_source_type => ORDS.param_type_response,
        p_param_type => 'JSON',
        p_access_method => 'OUT',
        p_comments => 'Resultado da validação'
    );
END;
/ 