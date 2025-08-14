// Criar arquivo src/app/pages/relatorios/relatorios.component.ts

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-relatorios',
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>📈 Relatórios</h2>
        <p class="subtitle">Relatórios e análises do sistema de estoque</p>
      </div>

      <div class="content-area">
        <div class="placeholder-content">
          <div class="placeholder-icon">📊</div>
          <h3>Relatórios em Desenvolvimento</h3>
          <p>Esta funcionalidade será implementada em breve.</p>
          
          <div class="future-features">
            <h4>Relatórios Planejados:</h4>
            <ul>
              <li>📋 Relatório de Estoque por Grupo</li>
              <li>⚠️ Produtos com Estoque Negativo</li>
              <li>📈 Movimentação de Estoque</li>
              <li>💰 Valor Total do Estoque</li>
              <li>📊 Consumo Médio por Produto</li>
              <li>📑 Exportação para Excel/PDF</li>
            </ul>
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
      max-width: 500px;
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

    .future-features {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #007bff;
    }

    .future-features h4 {
      margin: 0 0 12px 0;
      color: #2c3e50;
      font-size: 16px;
      font-weight: 600;
    }

    .future-features ul {
      margin: 0;
      padding-left: 20px;
      text-align: left;
    }

    .future-features li {
      margin-bottom: 8px;
      color: #495057;
      font-size: 14px;
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
export class RelatoriosComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log('📈 Componente Relatórios carregado');
  }

}