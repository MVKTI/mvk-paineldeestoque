
import { Component, OnInit } from '@angular/core';
import { PoTableColumn, PoTableAction, PoPageAction } from '@po-ui/ng-components';
import { EstoqueService } from '../../core/services/estoque.service';
import { PontoPedido } from '../../core/models';

@Component({
  selector: 'app-ponto-pedido',
  template: `
    <po-page-default 
      p-title="🚨 Ponto de Pedido - Itens Críticos" 
      [p-actions]="pageActions">
      
      <!-- Dashboard de Estatísticas -->
      <div class="dashboard-container">
        <div class="alert-banner" *ngIf="temItensUrgentes">
          <div class="alert-content">
            <div class="alert-icon">🚨</div>
            <div class="alert-text">
              <strong>ATENÇÃO!</strong> {{ contarPrioridade('ALTA') }} itens precisam de compra urgente
            </div>
            <po-button
              p-label="Ver Todos"
              p-kind="danger"
              p-size="small"
              (p-click)="focarItensUrgentes()">
            </po-button>
          </div>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card total-itens">
            <div class="stat-header">
              <div class="stat-icon">📊</div>
              <div class="stat-title">Total de Itens</div>
            </div>
            <div class="stat-number">{{ pontosPedido.length }}</div>
            <div class="stat-subtitle">em ponto de pedido</div>
          </div>
          
          <div class="stat-card prioridade-alta">
            <div class="stat-header">
              <div class="stat-icon">🔴</div>
              <div class="stat-title">Prioridade Alta</div>
            </div>
            <div class="stat-number">{{ contarPrioridade('ALTA') }}</div>
            <div class="stat-subtitle">urgente</div>
            <div class="stat-progress">
              <div class="progress-bar alta" 
                   [style.width.%]="pontosPedido.length > 0 ? (contarPrioridade('ALTA') / pontosPedido.length) * 100 : 0">
              </div>
            </div>
          </div>
          
          <div class="stat-card prioridade-media">
            <div class="stat-header">
              <div class="stat-icon">🟡</div>
              <div class="stat-title">Prioridade Média</div>
            </div>
            <div class="stat-number">{{ contarPrioridade('MEDIA') }}</div>
            <div class="stat-subtitle">importante</div>
            <div class="stat-progress">
              <div class="progress-bar media" 
                   [style.width.%]="pontosPedido.length > 0 ? (contarPrioridade('MEDIA') / pontosPedido.length) * 100 : 0">
              </div>
            </div>
          </div>
          
          <div class="stat-card prioridade-baixa">
            <div class="stat-header">
              <div class="stat-icon">🟢</div>
              <div class="stat-title">Prioridade Baixa</div>
            </div>
            <div class="stat-number">{{ contarPrioridade('BAIXA') }}</div>
            <div class="stat-subtitle">normal</div>
            <div class="stat-progress">
              <div class="progress-bar baixa" 
                   [style.width.%]="pontosPedido.length > 0 ? (contarPrioridade('BAIXA') / pontosPedido.length) * 100 : 0">
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Filtros e Ações -->
      <div class="filters-container">
        <div class="filters-row">
          <div class="filter-item">
            <po-input 
              p-placeholder="🔍 Buscar produto..."
              [(ngModel)]="filtroTexto"
              (ngModelChange)="filtrarItens()"
              p-clean="true">
            </po-input>
          </div>
          
          <div class="filter-item">
            <label class="filter-label">Filtrar por Prioridade:</label>
            <select 
              class="filter-select"
              [(ngModel)]="filtroPrioridade"
              (ngModelChange)="filtrarItens()">
              <option value="">Todas as Prioridades</option>
              <option value="ALTA">🔴 Alta</option>
              <option value="MEDIA">🟡 Média</option>
              <option value="BAIXA">🟢 Baixa</option>
            </select>
          </div>
          
          <div class="filter-item">
            <po-button
              p-label="🔄 Atualizar"
              p-icon="po-icon-refresh"
              p-kind="tertiary"
              (p-click)="carregarPontosPedido()">
            </po-button>
          </div>
        </div>
      </div>
      
      <!-- Tabela de Itens -->
      <po-widget p-title="📋 Lista de Itens para Reposição">
        <po-table
          [p-columns]="columns"
          [p-items]="pontosPedidoFiltrados"
          [p-actions]="tableActions"
          [p-loading]="loading"
          p-sort="true"
          p-striped="true"
          [p-height]="500"
          p-hide-columns-manager="false">
        </po-table>
      </po-widget>
    </po-page-default>
  `,
  styles: [`
    .dashboard-container {
      margin-bottom: 24px;
    }
    
    .alert-banner {
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
      border-radius: 12px;
      padding: 16px 24px;
      margin-bottom: 24px;
      box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
    }
    
    .alert-content {
      display: flex;
      align-items: center;
      gap: 16px;
      color: white;
    }
    
    .alert-icon {
      font-size: 1.5rem;
    }
    
    .alert-text {
      flex: 1;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }
    
    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      border-left: 4px solid;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.15);
    }
    
    .total-itens {
      border-left-color: #667eea;
    }
    
    .prioridade-alta {
      border-left-color: #ff6b6b;
    }
    
    .prioridade-media {
      border-left-color: #ffa726;
    }
    
    .prioridade-baixa {
      border-left-color: #66bb6a;
    }
    
    .stat-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }
    
    .stat-icon {
      font-size: 1.2rem;
    }
    
    .stat-title {
      font-weight: 600;
      color: #2c3e50;
      font-size: 0.9rem;
    }
    
    .stat-number {
      font-size: 2.5rem;
      font-weight: bold;
      color: #2c3e50;
      line-height: 1;
      margin-bottom: 4px;
    }
    
    .stat-subtitle {
      color: #6c757d;
      font-size: 0.85rem;
      margin-bottom: 12px;
    }
    
    .stat-progress {
      height: 4px;
      background: #e9ecef;
      border-radius: 2px;
      overflow: hidden;
    }
    
    .progress-bar {
      height: 100%;
      border-radius: 2px;
      transition: width 0.3s ease;
    }
    
    .progress-bar.alta {
      background: linear-gradient(90deg, #ff6b6b 0%, #ee5a52 100%);
    }
    
    .progress-bar.media {
      background: linear-gradient(90deg, #ffa726 0%, #ff9800 100%);
    }
    
    .progress-bar.baixa {
      background: linear-gradient(90deg, #66bb6a 0%, #4caf50 100%);
    }
    
    .filters-container {
      background: white;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .filters-row {
      display: flex;
      gap: 16px;
      align-items: end;
      flex-wrap: wrap;
    }
    
    .filter-item {
      min-width: 200px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .filter-label {
      font-size: 0.9rem;
      font-weight: 500;
      color: #495057;
    }
    
    .filter-select {
      padding: 8px 12px;
      border: 1px solid #ced4da;
      border-radius: 6px;
      font-size: 0.9rem;
      background: white;
      color: #495057;
      cursor: pointer;
    }
    
    .filter-select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.25);
    }
    
    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .filters-row {
        flex-direction: column;
        align-items: stretch;
      }
      
      .filter-item {
        min-width: auto;
      }
    }
  `]
})
export class PontoPedidoComponent implements OnInit {
  pontosPedido: PontoPedido[] = [];
  pontosPedidoFiltrados: PontoPedido[] = [];
  filtroTexto: string = '';
  filtroPrioridade: string = '';
  loading = false;

  get temItensUrgentes(): boolean {
    return this.contarPrioridade('ALTA') > 0;
  }

  columns: PoTableColumn[] = [
    { 
      property: 'produtoCodigo', 
      label: '🏷️ Código', 
      width: '10%'
    },
    { 
      property: 'produtoDescricao', 
      label: '📦 Produto', 
      width: '25%'
    },
    { 
      property: 'grupo', 
      label: '📂 Grupo', 
      width: '12%'
    },
    { 
      property: 'estoqueAtual', 
      label: '📊 Atual', 
      width: '8%',
      type: 'number'
    },
    { 
      property: 'pontoReposicao', 
      label: '⚠️ Ponto', 
      width: '8%',
      type: 'number'
    },
    { 
      property: 'quantidadeSugerida', 
      label: '🛒 Sugerida', 
      width: '10%',
      type: 'number'
    },
    { 
      property: 'diasSemEstoque', 
      label: '📅 Dias', 
      width: '7%',
      type: 'number'
    },
    { 
      property: 'prioridade', 
      label: '🚨 Prioridade', 
      width: '10%',
      type: 'label',
      labels: [
        { value: 'ALTA', color: 'danger', label: '🔴 Alta' },
        { value: 'MEDIA', color: 'warning', label: '🟡 Média' },
        { value: 'BAIXA', color: 'success', label: '🟢 Baixa' }
      ]
    },
    { 
      property: 'fornecedor', 
      label: '🏪 Fornecedor', 
      width: '15%'
    }
  ];

  tableActions: PoTableAction[] = [
    {
      action: (item: PontoPedido) => this.gerarPedido(item),
      label: 'Gerar Pedido',
      icon: 'po-icon-plus',
      type: 'danger'
    },
    {
      action: (item: PontoPedido) => this.verHistorico(item),
      label: 'Histórico',
      icon: 'po-icon-clock'
    }
  ];

  pageActions: PoPageAction[] = [
    {
      label: '🔄 Atualizar Dados',
      icon: 'po-icon-refresh',
      action: () => this.carregarPontosPedido()
    },
    {
      label: '📊 Exportar Relatório',
      icon: 'po-icon-export',
      action: () => this.exportarRelatorio()
    }
  ];

  constructor(private estoqueService: EstoqueService) {}

  ngOnInit(): void {
    this.carregarPontosPedido();
  }

  carregarPontosPedido(): void {
    this.loading = true;
    
    this.estoqueService.getPontosPedido().subscribe({
      next: (pontos) => {
        this.pontosPedido = pontos;
        this.pontosPedidoFiltrados = pontos;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar pontos de pedido:', error);
        this.loading = false;
      }
    });
  }

  filtrarItens(): void {
    let itens = this.pontosPedido;

    if (this.filtroTexto) {
      const filtro = this.filtroTexto.toLowerCase();
      itens = itens.filter(item =>
        item.produtoDescricao.toLowerCase().includes(filtro) ||
        item.produtoCodigo.toLowerCase().includes(filtro) ||
        item.grupo.toLowerCase().includes(filtro) ||
        item.fornecedor.toLowerCase().includes(filtro)
      );
    }

    if (this.filtroPrioridade) {
      itens = itens.filter(item => item.prioridade === this.filtroPrioridade);
    }

    this.pontosPedidoFiltrados = itens;
  }

  contarPrioridade(prioridade: 'ALTA' | 'MEDIA' | 'BAIXA'): number {
    return this.pontosPedido.filter(p => p.prioridade === prioridade).length;
  }

  focarItensUrgentes(): void {
    this.filtroPrioridade = 'ALTA';
    this.filtrarItens();
  }

  gerarPedido(item: PontoPedido): void {
    console.log('🛒 Gerando pedido para:', item.produtoDescricao);
  }

  verHistorico(item: PontoPedido): void {
    console.log('📊 Visualizando histórico de:', item.produtoDescricao);
  }

  exportarRelatorio(): void {
    console.log('📊 Exportando relatório de ponto de pedido...');
  }
}