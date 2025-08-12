import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { PoTableColumn, PoTableAction } from '@po-ui/ng-components';
import { EstoqueService } from '../../../core/services/estoque.service';
import { Produto } from '../../../core/models';

@Component({
  selector: 'app-produtos-list',
  template: `
    <po-widget 
      [p-title]="widgetTitle" 
      [p-height]="600"
      [p-primary-label]="'Produtos Cadastrados'">
      
      <div class="produtos-container">
        <div class="produtos-header">
          <div class="header-stats">
            <div class="stat-card produtos-total">
              <div class="stat-icon">📦</div>
              <div class="stat-content">
                <span class="stat-number">{{ produtos.length }}</span>
                <span class="stat-label">Total</span>
              </div>
            </div>
            
            <div class="stat-card produtos-ativos">
              <div class="stat-icon">✅</div>
              <div class="stat-content">
                <span class="stat-number">{{ produtosAtivos }}</span>
                <span class="stat-label">Ativos</span>
              </div>
            </div>
            
            <div class="stat-card produtos-criticos">
              <div class="stat-icon">⚠️</div>
              <div class="stat-content">
                <span class="stat-number">{{ produtosCriticos }}</span>
                <span class="stat-label">Críticos</span>
              </div>
            </div>
          </div>
          
          <div class="header-actions">
            <po-input 
              p-placeholder="🔍 Buscar produto..."
              [(ngModel)]="filtroTexto"
              (ngModelChange)="filtrarProdutos()"
              p-clean="true">
            </po-input>
            
            <po-button
              p-label="🔄 Atualizar"
              p-icon="po-icon-refresh"
              p-kind="tertiary"
              (p-click)="atualizarLista()">
            </po-button>
          </div>
        </div>
        
        <div class="table-container">
          <po-table
            [p-columns]="columns"
            [p-items]="produtosFiltrados"
            [p-actions]="tableActions"
            [p-loading]="loading"
            p-sort="true"
            p-striped="true"
            [p-height]="400"
            p-auto-router="false">
          </po-table>
        </div>
      </div>
    </po-widget>
  `,
  styles: [`
    .produtos-container {
      padding: 20px;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .produtos-header {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .header-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 16px;
    }
    
    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border-left: 4px solid;
    }
    
    .produtos-total {
      border-left-color: #667eea;
    }
    
    .produtos-ativos {
      border-left-color: #28a745;
    }
    
    .produtos-criticos {
      border-left-color: #dc3545;
    }
    
    .stat-icon {
      font-size: 1.5rem;
    }
    
    .stat-content {
      display: flex;
      flex-direction: column;
    }
    
    .stat-number {
      font-size: 1.5rem;
      font-weight: bold;
      color: #2c3e50;
    }
    
    .stat-label {
      font-size: 0.8rem;
      color: #6c757d;
    }
    
    .header-actions {
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
    }
    
    .table-container {
      flex: 1;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    @media (max-width: 768px) {
      .produtos-container {
        padding: 12px;
      }
      
      .header-stats {
        grid-template-columns: 1fr;
      }
      
      .header-actions {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `]
})
export class ProdutosListComponent implements OnInit, OnChanges {
  @Input() tipo: 'MATERIA_PRIMA' | 'MATERIAL_CONSUMO' = 'MATERIA_PRIMA';
  @Input() grupoSelecionado: string = '';

  produtos: Produto[] = [];
  produtosFiltrados: Produto[] = [];
  filtroTexto: string = '';
  loading = false;

  get widgetTitle(): string {
    const icon = this.tipo === 'MATERIA_PRIMA' ? '🏭' : '📋';
    const label = this.tipo === 'MATERIA_PRIMA' ? 'Matéria Prima' : 'Material de Consumo';
    return `${icon} ${label}`;
  }

  get produtosAtivos(): number {
    return this.produtos.filter(p => p.status === 'ATIVO').length;
  }

  get produtosCriticos(): number {
    return this.produtos.filter(p => p.estoqueAtual <= p.estoqueMinimo).length;
  }

  columns: PoTableColumn[] = [
    { 
      property: 'codigo', 
      label: '🏷️ Código', 
      width: '10%',
      type: 'string'
    },
    { 
      property: 'descricao', 
      label: '📝 Descrição', 
      width: '25%'
    },
    { 
      property: 'grupoDescricao', 
      label: '📂 Grupo', 
      width: '15%'
    },
    { 
      property: 'estoqueAtual', 
      label: '📊 Estoque', 
      width: '10%',
      type: 'number'
    },
    { 
      property: 'estoqueMinimo', 
      label: '⚠️ Mínimo', 
      width: '10%',
      type: 'number'
    },
    { 
      property: 'unidade', 
      label: 'UN', 
      width: '8%'
    },
    { 
      property: 'custoUnitario', 
      label: '💰 Custo', 
      width: '12%',
      type: 'currency',
      format: 'BRL'
    },
    { 
      property: 'status', 
      label: '🔄 Status', 
      width: '10%',
      type: 'label',
      labels: [
        { value: 'ATIVO', color: 'success', label: '✅ Ativo' },
        { value: 'INATIVO', color: 'warning', label: '⏸️ Inativo' },
        { value: 'BLOQUEADO', color: 'danger', label: '🚫 Bloqueado' }
      ]
    }
  ];

  tableActions: PoTableAction[] = [
    {
      action: (item: Produto) => this.visualizarProduto(item),
      label: 'Visualizar',
      icon: 'po-icon-eye'
    },
    {
      action: (item: Produto) => this.editarProduto(item),
      label: 'Editar',
      icon: 'po-icon-edit'
    }
  ];

  constructor(private estoqueService: EstoqueService) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['grupoSelecionado']) {
      this.carregarProdutos();
    }
  }

  carregarProdutos(): void {
    this.loading = true;
    
    this.estoqueService.getProdutos(this.tipo, this.grupoSelecionado).subscribe({
      next: (produtos) => {
        this.produtos = produtos;
        this.produtosFiltrados = produtos;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
        this.loading = false;
      }
    });
  }

  filtrarProdutos(): void {
    if (!this.filtroTexto) {
      this.produtosFiltrados = this.produtos;
    } else {
      const filtro = this.filtroTexto.toLowerCase();
      this.produtosFiltrados = this.produtos.filter(produto =>
        produto.descricao.toLowerCase().includes(filtro) ||
        produto.codigo.toLowerCase().includes(filtro) ||
        produto.grupoDescricao.toLowerCase().includes(filtro)
      );
    }
  }

  atualizarLista(): void {
    this.filtroTexto = '';
    this.carregarProdutos();
  }

  visualizarProduto(item: Produto): void {
    console.log('Visualizando produto:', item.descricao);
  }

  editarProduto(item: Produto): void {
    console.log('Editando produto:', item.descricao);
  }
}