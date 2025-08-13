import { Component, OnInit } from '@angular/core';
import { EstoqueService } from '../../core/services/estoque.service';

@Component({
  selector: 'app-material-consumo',
  template: `
    <div class="page-container">
      <!-- Barra de filtros horizontal -->
      <div class="filters-bar">
        <div class="filters-section">
          <h4>📋 Material de Consumo</h4>
          
          <div class="filter-controls">
            <po-select
              p-label="Grupo"
              p-size="small"
              [p-options]="gruposOptions"
              (p-change)="onGrupoChange($event)"
              p-placeholder="Selecione um grupo...">
            </po-select>
            
            <po-input
              p-label="Buscar produtos"
              p-icon="po-icon-search"
              p-size="small"
              (p-blur)="onFiltroBlur($event)"
              (p-enter)="onFiltroEnter()"
              p-placeholder="Código ou descrição...">
            </po-input>
            
            <po-button
              p-label="Carregar"
              p-icon="po-icon-refresh"
              p-size="small"
              [p-disabled]="!grupoSelecionado"
              (p-click)="carregarProdutos()">
            </po-button>
          </div>
        </div>

        <!-- Estatísticas rápidas -->
        <div class="quick-stats">
          <div class="stat-item">
            <span class="stat-number">{{ grupos.length }}</span>
            <small>Grupos</small>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ produtos.length }}</span>
            <small>Produtos</small>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ produtosAtivos }}</span>
            <small>Ativos</small>
          </div>
        </div>
      </div>

      <!-- Lista de produtos -->
      <div class="content-area">
        <app-produtos-list
          tipo="MATERIAL_CONSUMO"
          [grupoSelecionado]="grupoSelecionado"
          [forceReload]="forceReload"
          [filtroExterno]="filtroTexto">
        </app-produtos-list>
      </div>

      <!-- Loading overlay -->
      <po-loading-overlay 
        *ngIf="loading"
        p-text="Carregando dados...">
      </po-loading-overlay>
    </div>
  `,
  styles: [`
    .page-container {
      display: flex;
      flex-direction: column;
      height: calc(100vh - 56px);
      background: #f5f5f5;
    }

    .filters-bar {
      background: white;
      padding: 12px 16px;
      border-bottom: 1px solid #e9ecef;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }

    .filters-section h4 {
      margin: 0 0 8px 0;
      font-size: 16px;
      color: #2c3e50;
      font-weight: 500;
    }

    .filter-controls {
      display: flex;
      align-items: end;
      gap: 12px;
      flex-wrap: wrap;
    }

    .quick-stats {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 12px;
      background: #f8f9fa;
      border-radius: 6px;
      border-left: 3px solid #28a745;
      min-width: 60px;
    }

    .stat-number {
      font-size: 16px;
      font-weight: bold;
      color: #2c3e50;
      line-height: 1;
    }

    .stat-item small {
      font-size: 10px;
      color: #6c757d;
      margin-top: 2px;
    }

    .content-area {
      flex: 1;
      padding: 12px 16px;
      overflow: hidden;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .page-container {
        height: calc(100vh - 52px);
      }

      .filters-bar {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
        padding: 8px 12px;
      }

      .filter-controls {
        gap: 8px;
      }

      .quick-stats {
        justify-content: space-around;
        gap: 8px;
      }

      .stat-item {
        padding: 6px 8px;
        min-width: 50px;
      }

      .stat-number {
        font-size: 14px;
      }

      .content-area {
        padding: 8px 12px;
      }
    }

    @media (max-width: 480px) {
      .filter-controls {
        flex-direction: column;
        align-items: stretch;
      }
      
      .quick-stats {
        gap: 4px;
      }
    }
  `]
})
export class MaterialConsumoComponent implements OnInit {
  grupoSelecionado: string = '';
  filtroTexto: string = '';
  loading: boolean = false;
  forceReload: number = 0;
  
  grupos: any[] = [];
  produtos: any[] = [];
  gruposOptions: any[] = [];

  get produtosAtivos(): number {
    return this.produtos.filter(p => p.status === 'ATIVO').length;
  }

  constructor(private estoqueService: EstoqueService) {}

  ngOnInit(): void {
    this.carregarGrupos();
  }

  carregarGrupos(): void {
    this.loading = true;
    this.estoqueService.getGrupos('MATERIAL_CONSUMO').subscribe({
      next: (grupos) => {
        this.grupos = grupos;
        this.gruposOptions = grupos.map(g => ({
          label: `${g.descricao} (${g.totalProdutos})`,
          value: g.codigo
        }));
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar grupos:', error);
        this.loading = false;
      }
    });
  }

  onGrupoChange(grupoCodigo: string): void {
    console.log('📂 Grupo selecionado:', grupoCodigo);
    this.grupoSelecionado = grupoCodigo;
    this.estoqueService.selecionarGrupo(grupoCodigo);
    
    if (grupoCodigo) {
      this.carregarProdutos();
    }
  }

  onFiltroBlur(event: any): void {
    this.filtroTexto = event.target.value;
    this.filtrarProdutos();
  }

  onFiltroEnter(): void {
    this.filtrarProdutos();
  }

  carregarProdutos(): void {
    if (!this.grupoSelecionado) return;
    
    this.loading = true;
    this.forceReload++;
    
    this.estoqueService.getProdutos('MATERIAL_CONSUMO', this.grupoSelecionado).subscribe({
      next: (produtos) => {
        this.produtos = produtos;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
        this.loading = false;
      }
    });
  }

  filtrarProdutos(): void {
    // O filtro será aplicado pelo componente produtos-list
    console.log('🔍 Filtro aplicado:', this.filtroTexto);
  }
}