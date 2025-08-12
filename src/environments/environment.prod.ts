export const environment = {
  production: true,
  
  // 🎯 PRODUÇÃO (ajuste o IP para produção)
  apiUrl: 'http://192.168.0.251:8401/rest',
  
  timeout: 30000,
  retryAttempts: 3,
  
  auth: {
    type: 'basic',
    username: 'admin',
    password: 'msmvk'
  },
  
  endpoints: {
    grupos: 'VKPESTLISTAGRUPO',
    produtos: 'VKPESTLISTAPRODUTOS',
    pontosPedido: 'VKPESTPONTOSDEPEDIDO'
  },
  
  version: '1.0.0'
};