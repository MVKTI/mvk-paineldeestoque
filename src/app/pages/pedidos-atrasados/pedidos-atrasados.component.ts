// Arquivo src/app/pages/pedidos-atrasados/pedidos-atrasados.component.ts - VERSÃO LIMPA

import { Component, OnInit } from '@angular/core';
import { PedidosService } from '../../core/services/pedidos.service';
import { PedidoAtrasadoProcessado } from '../../core/models';

@Component({
  selector: 'app-pedidos-atrasados',
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-content">
          <h2>⚠️ Pedidos Atrasados</h2>
          <p class="header-subtitle">Acompanhe os pedidos que ultrapassaram a data prevista de entrega</p>
        </div>
        <div class="header-actions">
          <po-button
            p-label="Atualizar"
            p-icon="po-icon-refresh"
            p-size="small"
            [p-loading]="loading"
            (p-click)="carregarPedidos()">
          </po-button>
        </div>
      </div>

      <div class="stats-container" *ngIf="!loading">
        <div class="stat-card critical">
          <div class="stat-icon">🚨</div>
          <div class="stat-content">
            <span class="stat-number">{{ estatisticas.criticos }}</span>
            <span class="stat-label">Críticos (30+ dias)</span>
          </div>
        </div>
        <div class="stat-card high">
          <div class="stat-icon">⚠️</div>
          <div class="stat-content">
            <span class="stat-number">{{ estatisticas.altos }}</span>
            <span class="stat-label">Alta (15-29 dias)</span>
          </div>
        </div>
        <div class="stat-card medium">
          <div class="stat-icon">🔶</div>
          <div class="stat-content">
            <span class="stat-number">{{ estatisticas.medios }}</span>
            <span class="stat-label">Média (1-14 dias)</span>
          </div>
        </div>
        <div class="stat-card total">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <span class="stat-number">{{ pedidos.length }}</span>
            <span class="stat-label">Total Atrasados</span>
          </div>
        </div>
      </div>

      <div *ngIf="loading" class="loading-container">
        <po-loading p-text="Carregando pedidos atrasados..."></po-loading>
      </div>

      <div *ngIf="!loading" class="pedidos-container">
        <div class="filters-section">
          <po-input
            p-label="Buscar pedidos"
            p-icon="po-icon-search"
            p-size="small"
            [ngModel]="filtroTexto"
            (ngModelChange)="onFiltroTextoChange($event)"
            p-placeholder="Código, fornecedor ou comprador...">
          </po-input>
          <po-select
            p-label="Prioridade"
            p-size="small"
            [p-options]="prioridadeOptions"
            [ngModel]="filtroPrioridade"
            (ngModelChange)="onFiltroPrioridadeChange($event)">
          </po-select>
        </div>

        <div class="cards-grid" *ngIf="pedidosFiltrados.length > 0">
          <div *ngFor="let pedido of pedidosFiltrados" 
               class="pedido-card"
               [class.critical]="pedido.prioridade === 'CRITICA'"
               [class.high]="pedido.prioridade === 'ALTA'"
               [class.medium]="pedido.prioridade === 'MEDIA'">
            
            <div class="card-header">
              <div class="pedido-info">
                <h3 class="pedido-codigo">{{ pedido.codigo }}</h3>
                <div class="atraso-badge" 
                     [class.critical]="pedido.prioridade === 'CRITICA'"
                     [class.high]="pedido.prioridade === 'ALTA'"
                     [class.medium]="pedido.prioridade === 'MEDIA'">
                  {{ pedido.diasAtraso }} dias de atraso
                </div>
              </div>
              <div class="prioridade-icon">
                <span *ngIf="pedido.prioridade === 'CRITICA'">🚨</span>
                <span *ngIf="pedido.prioridade === 'ALTA'">⚠️</span>
                <span *ngIf="pedido.prioridade === 'MEDIA'">🔶</span>
              </div>
            </div>

            <div class="card-content">
              <div class="fornecedor-section">
                <label>Fornecedor:</label>
                <p class="fornecedor-nome">{{ pedido.descricao }}</p>
                <small class="fornecedor-codigo">Código: {{ pedido.fornecedor }}</small>
              </div>
              <div class="comprador-section">
                <label>Comprador:</label>
                <p class="comprador-nome">{{ pedido.comprador }}</p>
                <small class="comprador-codigo">Código: {{ pedido.codigocomprador }}</small>
              </div>
              <div class="data-section">
                <label>Data Prevista:</label>
                <p class="data-prevista">{{ formatarData(pedido.dataPreviewFormatada) }}</p>
              </div>
            </div>

            <div class="card-footer">
              <po-button
                p-label="Detalhes"
                p-icon="po-icon-eye"
                p-size="small"
                p-kind="secondary"
                (p-click)="verDetalhes(pedido)">
              </po-button>
              <po-button
                p-label="Contatar Fornecedor"
                p-icon="po-icon-telephone"
                p-size="small"
                (p-click)="contatarFornecedor(pedido)">
              </po-button>
            </div>
          </div>
        </div>

        <div *ngIf="pedidosFiltrados.length === 0 && !loading" class="empty-state">
          <div class="empty-icon">🎉</div>
          <h3>Nenhum pedido atrasado encontrado</h3>
          <p *ngIf="filtroTexto || filtroPrioridade">Tente ajustar os filtros de busca</p>
          <p *ngIf="!filtroTexto && !filtroPrioridade">Todos os pedidos estão dentro do prazo!</p>
        </div>
      </div>

      <app-pedido-detalhes-modal
        [visible]="modalDetalhesVisivel"
        [pedido]="pedidoSelecionado"
        (fechar)="fecharModal()">
      </app-pedido-detalhes-modal>
    </div>
  `,
  styles: [`
    .page-container {
      display: flex;
      flex-direction: column;
      height: calc(100vh - 56px);
      background: #f8f9fa;
      padding: 20px;
      gap: 20px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .header-content h2 {
      margin: 0 0 4px 0;
      color: #2c3e50;
      font-size: 24px;
      font-weight: 600;
    }

    .header-subtitle {
      margin: 0;
      color: #6c757d;
      font-size: 14px;
    }

    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 20px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      background: white;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      border-left: 4px solid #ddd;
    }

    .stat-card.critical { border-left-color: #dc3545; }
    .stat-card.high { border-left-color: #fd7e14; }
    .stat-card.medium { border-left-color: #ffc107; }
    .stat-card.total { border-left-color: #0d6efd; }

    .stat-icon {
      font-size: 24px;
      margin-right: 12px;
    }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-number {
      font-size: 20px;
      font-weight: 600;
      color: #2c3e50;
    }

    .stat-label {
      font-size: 12px;
      color: #6c757d;
    }

    .loading-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .pedidos-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 20px;
    }

    .filters-section {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
      align-items: end;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 16px;
      overflow-y: auto;
    }

    .pedido-card {
      background: white;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 16px;
      transition: all 0.2s ease;
      border-left: 4px solid #ddd;
    }

    .pedido-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .pedido-card.critical {
      border-left-color: #dc3545;
      background: #fff5f5;
    }

    .pedido-card.high {
      border-left-color: #fd7e14;
      background: #fff8f0;
    }

    .pedido-card.medium {
      border-left-color: #ffc107;
      background: #fffbf0;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    .pedido-codigo {
      margin: 0 0 4px 0;
      font-size: 18px;
      font-weight: 600;
      color: #2c3e50;
    }

    .atraso-badge {
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 500;
      color: white;
    }

    .atraso-badge.critical { background: #dc3545; }
    .atraso-badge.high { background: #fd7e14; }
    .atraso-badge.medium { background: #ffc107; color: #000; }

    .prioridade-icon {
      font-size: 20px;
    }

    .card-content {
      margin-bottom: 16px;
    }

    .fornecedor-section,
    .comprador-section,
    .data-section {
      margin-bottom: 12px;
    }

    .card-content label {
      font-size: 11px;
      font-weight: 600;
      color: #6c757d;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
      display: block;
    }

    .fornecedor-nome,
    .comprador-nome,
    .data-prevista {
      margin: 0 0 2px 0;
      font-size: 14px;
      font-weight: 500;
      color: #2c3e50;
    }

    .fornecedor-codigo,
    .comprador-codigo {
      font-size: 12px;
      color: #6c757d;
    }

    .card-footer {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      border-top: 1px solid #e9ecef;
      padding-top: 12px;
    }

    .empty-state {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: #6c757d;
      padding: 40px;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .empty-state h3 {
      margin: 0 0 8px 0;
      color: #495057;
      font-size: 18px;
      font-weight: 500;
    }

    .empty-state p {
      margin: 0;
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .page-container {
        padding: 12px;
        gap: 12px;
      }

      .page-header {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
        padding: 16px;
      }

      .stats-container {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }

      .filters-section {
        flex-direction: column;
        gap: 12px;
        align-items: stretch;
      }

      .cards-grid {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .card-footer {
        flex-direction: column;
        gap: 8px;
      }
    }
  `]
})
export class PedidosAtrasadosComponent implements OnInit {
  pedidos: PedidoAtrasadoProcessado[] = [];
  pedidosFiltrados: PedidoAtrasadoProcessado[] = [];
  loading = false;
  
  filtroTexto = '';
  filtroPrioridade = '';

  modalDetalhesVisivel = false;
  pedidoSelecionado: PedidoAtrasadoProcessado | null = null;

  prioridadeOptions = [
    { label: 'Todas as prioridades', value: '' },
    { label: 'Crítica (30+ dias)', value: 'CRITICA' },
    { label: 'Alta (15-29 dias)', value: 'ALTA' },
    { label: 'Média (1-14 dias)', value: 'MEDIA' }
  ];

  estatisticas = {
    criticos: 0,
    altos: 0,
    medios: 0
  };

  constructor(private pedidosService: PedidosService) {}

  ngOnInit(): void {
    this.carregarPedidos();
  }

  onFiltroTextoChange(valor: string): void {
    this.filtroTexto = valor;
    this.aplicarFiltro();
  }

  onFiltroPrioridadeChange(valor: string): void {
    this.filtroPrioridade = valor;
    this.aplicarFiltro();
  }

  carregarPedidos(): void {
    this.loading = true;
    console.log('🔄 Carregando pedidos atrasados...');

    this.pedidosService.getPedidosAtrasados().subscribe({
      next: (pedidos) => {
        console.log(`✅ ${pedidos.length} pedidos atrasados carregados`);
        this.pedidos = pedidos;
        this.aplicarFiltro();
        this.calcularEstatisticas();
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar pedidos atrasados:', error);
        this.pedidos = [];
        this.pedidosFiltrados = [];
        this.loading = false;
      }
    });
  }

  aplicarFiltro(): void {
    let pedidosFiltrados = [...this.pedidos];

    if (this.filtroTexto) {
      const filtro = this.filtroTexto.toLowerCase();
      pedidosFiltrados = pedidosFiltrados.filter(pedido =>
        pedido.codigo.toLowerCase().includes(filtro) ||
        pedido.descricao.toLowerCase().includes(filtro) ||
        pedido.comprador.toLowerCase().includes(filtro) ||
        pedido.fornecedor.toLowerCase().includes(filtro)
      );
    }

    if (this.filtroPrioridade) {
      pedidosFiltrados = pedidosFiltrados.filter(pedido =>
        pedido.prioridade === this.filtroPrioridade
      );
    }

    this.pedidosFiltrados = pedidosFiltrados;
    console.log(`🔍 Filtro aplicado: ${this.pedidosFiltrados.length} de ${this.pedidos.length} pedidos`);
  }

  calcularEstatisticas(): void {
    this.estatisticas = {
      criticos: this.pedidos.filter(p => p.prioridade === 'CRITICA').length,
      altos: this.pedidos.filter(p => p.prioridade === 'ALTA').length,
      medios: this.pedidos.filter(p => p.prioridade === 'MEDIA').length
    };

    console.log('📊 Estatísticas calculadas:', this.estatisticas);
  }

  formatarData(data: Date): string {
    if (!data) return '';
    
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  verDetalhes(pedido: PedidoAtrasadoProcessado): void {
    console.log('👁️ Abrindo detalhes do pedido:', pedido.codigo);
    this.pedidoSelecionado = pedido;
    this.modalDetalhesVisivel = true;
  }

  contatarFornecedor(pedido: PedidoAtrasadoProcessado): void {
    console.log('📞 Contatar fornecedor:', pedido.descricao);
    alert(`Contatar fornecedor: ${pedido.descricao}\n\nEsta funcionalidade será implementada em breve.`);
  }

  fecharModal(): void {
    this.modalDetalhesVisivel = false;
    this.pedidoSelecionado = null;
  }
}