// Criar arquivo src/app/pages/pedidos-proximos/pedidos-proximos.component.ts

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pedidos-proximos',
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>⏰ Pedidos Próximos da Entrega</h2>
        <p class="subtitle">Acompanhe os pedidos com entrega prevista nos próximos dias</p>
      </div>

      <div class="content-area">
        <div class="placeholder-content">
          <div class="placeholder-icon">🚚</div>
          <h3>Funcionalidade em Desenvolvimento</h3>
          <p>Esta funcionalidade será implementada em breve.</p>
          
          <div class="future-features">
            <h4>Recursos Planejados:</h4>
            <ul>
              <li>⏰ Pedidos com entrega em até 7 dias</li>
              <li>📅 Calendário de entregas</li>
              <li>🔔 Notificações de entregas próximas</li>
              <li>📞 Contato rápido com fornecedores</li>
              <li>📊 Status de preparação dos pedidos</li>
              <li>📱 Acompanhamento em tempo real</li>
            </ul>
          </div>

          <div class="api-info">
            <h4>API Necessária:</h4>
            <p><strong>Endpoint:</strong> Similar ao de pedidos atrasados</p>
            <p><strong>Filtro:</strong> Data prevista entre hoje e +7 dias</p>
            <p><strong>Ordenação:</strong> Por data prevista (mais próximo primeiro)</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      display: flex;
      flex-direction: column;
      height: calc(100vh - 56px);
      background: #f8f9fa;
      padding: 20px;
    }

    .page-header {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }

    .page-header h2 {
      margin: 0 0 8px 0;
      color: #2c3e50;
      font-size: 24px;
      font-weight: 600;
    }

    .subtitle {
      margin: 0;
      color: #6c757d;
      font-size: 14px;
    }

    .content-area {
      flex: 1;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
    }

    .placeholder-content {
      text-align: center;
      max-width: 600px;
    }

    .placeholder-icon {
      font-size: 4rem;
      margin-bottom: 20px;
      opacity: 0.5;
    }

    .placeholder-content h3 {
      margin: 0 0 12px 0;
      color: #495057;
      font-size: 20px;
      font-weight: 500;
    }

    .placeholder-content > p {
      margin: 0 0 30px 0;
      color: #6c757d;
      font-size: 16px;
    }

    .future-features,
    .api-info {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      text-align: left;
    }

    .future-features {
      border-left: 4px solid #28a745;
    }

    .api-info {
      border-left: 4px solid #ffc107;
    }

    .future-features h4,
    .api-info h4 {
      margin: 0 0 12px 0;
      color: #2c3e50;
      font-size: 16px;
      font-weight: 600;
    }

    .future-features ul {
      margin: 0;
      padding-left: 20px;
    }

    .future-features li {
      margin-bottom: 8px;
      color: #495057;
      font-size: 14px;
    }

    .api-info p {
      margin: 0 0 8px 0;
      color: #495057;
      font-size: 14px;
    }

    .api-info p:last-child {
      margin-bottom: 0;
    }

    @media (max-width: 768px) {
      .page-container {
        padding: 12px;
      }

      .content-area {
        padding: 20px;
      }

      .placeholder-icon {
        font-size: 3rem;
      }
    }
  `]
})
export class PedidosProximosComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log('⏰ Componente Pedidos Próximos carregado');
  }

}