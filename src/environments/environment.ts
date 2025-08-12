export const environment = {
  production: false,
  
  // 🎯 CONFIGURAÇÃO ESPECÍFICA DO SEU PROTHEUS
  apiUrl: 'http://192.168.0.251:8401/rest',
  
  // Configurações de API
  timeout: 30000,
  retryAttempts: 3,
  
  // 🔐 AUTENTICAÇÃO CONFIGURADA
  auth: {
    type: 'basic',
    username: 'admin',
    password: 'msmvk'
  },
  
  // 📋 ENDPOINTS ESPECÍFICOS
  endpoints: {
    grupos: 'VKPESTLISTAGRUPO',
    produtos: 'VKPESTLISTAPRODUTOS', // Para implementar depois
    pontosPedido: 'VKPESTPONTOSDEPEDIDO' // Para implementar depois
  },
  
  version: '1.0.0'
  };