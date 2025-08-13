import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { PoTableColumn, PoTableAction } from '@po-ui/ng-components';
import { EstoqueService } from '../../../core/services/estoque.service';
import { Produto } from '../../../core/models';

@Component({
  selector: 'app-produtos-list',
  template: `
    <div class="produtos-container">
      <!-- Loading state -->
      <div *ngIf="loading" class="loading-container">
        <po-loading p-text="Carregando produtos..."></po-loading>
      </div>

      <!-- Mensagem quando nenhum grupo selecionado -->
      <div *ngIf="!loading && !grupoSelecionado" class="no-group-selected">
        <div class="empty-state">
          <div class="empty-icon">📂</div>
          <h5>Selecione um grupo</h5>
          <small>Escolha um grupo no filtro acima para visualizar os produtos</small>
        </div>
      </div>

      <!-- Tabela de produtos V2 - com novos campos -->
      <div *ngIf="!loading && grupoSelecionado" class="table-container">
        <po-table
          [p-columns]="columns"
          [p-items]="produtosFiltrados"
          [p-actions]="tableActions"
          [p-loading]="loading"
          p-sort="true"
          p-striped="true"
          p-size="small"
          [p-hide-table-search]="true"
          [p-height]="tableHeight">
        </po-table>
      </div>

      <!-- Estado vazio quando não há produtos -->
      <div *ngIf="!loading && grupoSelecionado && produtosFiltrados.length === 0" class="no-products">
        <div class="empty-state">
          <div class="empty-icon">📦</div>
          <h5>Nenhum produto encontrado</h5>
          <small *ngIf="filtroExterno">Tente ajustar o filtro de busca</small>
          <small *ngIf="!filtroExterno">Este grupo não possui produtos cadastrados</small>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .produtos-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      font-size: 12px;
    }

    .table-container {
      flex: 1;
      background: white;
      border-radius: 6px;
      overflow: hidden;
      box-shadow: 0 1px 4px rgba(0,0,0,0.1);
      min-height: 400px;
    }

    .loading-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border-radius: 6px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.1);
      min-height: 200px;
    }

    .no-group-selected,
    .no-products {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border-radius: 6px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.1);
      min-height: 300px;
    }

    .empty-state {
      text-align: center;
      color: #6c757d;
      padding: 40px 20px;
    }

    .empty-icon {
      font-size: 3rem;
      margin-bottom: 12px;
      opacity: 0.5;
    }

    .empty-state h5 {
      margin: 0 0 8px 0;
      color: #495057;
      font-size: 16px;
      font-weight: 500;
    }

    .empty-state small {
      margin: 0;
      font-size: 12px;
      color: #6c757d;
    }

    /* Estilos para tabela ultra-compacta V2 */
    :host ::ng-deep .po-table {
      font-size: 11px;
    }

    :host ::ng-deep .po-table .po-table-header-ellipsis {
      font-size: 10px;
      font-weight: 600;
      padding: 3px 5px;
      background-color: #f8f9fa;
      color: #495057;
    }

    :host ::ng-deep .po-table .po-table-column {
      padding: 3px 5px;
      font-size: 11px;
      border-bottom: 1px solid #f1f3f4;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    :host ::ng-deep .po-table .po-table-row {
      min-height: 30px;
    }

    :host ::ng-deep .po-table .po-table-row:hover {
      background-color: #f8f9fa;
    }

    /* Destaque para estoque disponível negativo */
    :host ::ng-deep .po-table .po-table-column:nth-child(6) {
      font-weight: bold;
    }

    /* Destaque para produtos com disponível negativo */
    :host ::ng-deep .po-table .po-table-row.estoque-negativo {
      background-color: #fff3cd !important;
      border-left: 3px solid #ffc107 !important;
    }

    :host ::ng-deep .po-table .po-table-row.estoque-negativo:hover {
      background-color: #fff0b3 !important;
    }

    /* Labels menores */
    :host ::ng-deep .po-tag {
      font-size: 9px;
      padding: 1px 4px;
    }

    /* Ações mais compactas */
    :host ::ng-deep .po-table-actions {
      gap: 2px;
    }

    :host ::ng-deep .po-table-actions .po-button {
      font-size: 9px;
      padding: 1px 4px;
      min-height: 18px;
    }

    /* Colunas numéricas alinhadas à direita */
    :host ::ng-deep .po-table .po-table-column:nth-child(4),
    :host ::ng-deep .po-table .po-table-column:nth-child(5),
    :host ::ng-deep .po-table .po-table-column:nth-child(6),
    :host ::ng-deep .po-table .po-table-column:nth-child(7),
    :host ::ng-deep .po-table .po-table-column:nth-child(8) {
      text-align: right;
    }

    @media (max-width: 768px) {
      .produtos-container {
        font-size: 10px;
      }

      :host ::ng-deep .po-table .po-table-column {
        padding: 2px 3px;
        font-size: 10px;
      }

      :host ::ng-deep .po-table .po-table-header-ellipsis {
        font-size: 9px;
        padding: 2px 3px;
      }

      .empty-state {
        padding: 20px 10px;
      }

      .empty-icon {
        font-size: 2rem;
      }

      .empty-state h5 {
        font-size: 14px;
      }
    }
  `]
})
export class ProdutosListComponent implements OnInit, OnChanges {
  @Input() tipo: 'MATERIA_PRIMA' | 'MATERIAL_CONSUMO' = 'MATERIA_PRIMA';
  @Input() grupoSelecionado: string = '';
  @Input() forceReload: number = 0;
  @Input() filtroExterno: string = '';

  produtos: Produto[] = [];
  produtosFiltrados: Produto[] = [];
  loading = false;
  tableHeight = 500;

  columns: PoTableColumn[] = [
    { 
      property: 'codigo', 
      label: 'Código', 
      width: '9%',
      type: 'string'
    },
    { 
      property: 'descricao', 
      label: 'Descrição', 
      width: '28%'
    },
    { 
      property: 'unidade', 
      label: 'UN', 
      width: '4%'
    },
    { 
      property: 'estoqueAtual', 
      label: 'Estoque', 
      width: '7%',
      type: 'number'
    },
    { 
      property: 'entrada', 
      label: 'Entrada', 
      width: '7%',
      type: 'number'
    },
    { 
      property: 'empenho', 
      label: 'Empenho', 
      width: '7%',
      type: 'number'
    },
    { 
      property: 'disponivel', 
      label: 'Disponível', 
      width: '8%',
      type: 'number'
    },
    { 
      property: 'custoUnitario', 
      label: 'Preço', 
      width: '8%',
      type: 'currency',
      format: 'BRL'
    },
    { 
      property: 'localizacao', 
      label: 'Local', 
      width: '5%'
    },
    { 
      property: 'bloqueado', 
      label: 'Bloq', 
      width: '5%',
      type: 'boolean',
      boolean: {
        trueLabel: 'Sim',
        falseLabel: 'Não'
      }
    },
    { 
      property: 'status', 
      label: 'Status', 
      width: '7%',
      type: 'label',
      labels: [
        { value: 'ATIVO', color: 'success', label: 'Ativo' },
        { value: 'INATIVO', color: 'warning', label: 'Inativo' },
        { value: 'BLOQUEADO', color: 'danger', label: 'Bloqueado' }
      ]
    }
  ];

  tableActions: PoTableAction[] = [
    {
      action: (item: Produto) => this.visualizarProduto(item),
      label: 'Ver',
      icon: 'po-icon-eye'
    }
  ];

  constructor(private estoqueService: EstoqueService) {}

  ngOnInit(): void {
    this.carregarProdutos();
    this.calcularAlturaTabela();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['grupoSelecionado'] || changes['forceReload']) {
      this.carregarProdutos();
    }
    
    if (changes['filtroExterno']) {
      this.aplicarFiltroExterno();
    }
  }

  private calcularAlturaTabela(): void {
    this.tableHeight = Math.max(400, window.innerHeight - 200);
  }

  carregarProdutos(): void {
    if (!this.grupoSelecionado) {
      this.produtos = [];
      this.produtosFiltrados = [];
      return;
    }

    this.loading = true;
    console.log(`🔄 Carregando produtos V2 para grupo: ${this.grupoSelecionado}`);
    
    this.estoqueService.getProdutos(this.tipo, this.grupoSelecionado).subscribe({
      next: (produtos) => {
        console.log(`✅ ${produtos.length} produtos V2 carregados:`, produtos);
        this.produtos = produtos;
        this.aplicarFiltroExterno();
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar produtos V2:', error);
        this.produtos = [];
        this.produtosFiltrados = [];
        this.loading = false;
      }
    });
  }

  private aplicarFiltroExterno(): void {
    if (!this.filtroExterno) {
      this.produtosFiltrados = this.produtos;
    } else {
      const filtro = this.filtroExterno.toLowerCase();
      this.produtosFiltrados = this.produtos.filter(produto =>
        produto.descricao.toLowerCase().includes(filtro) ||
        produto.codigo.toLowerCase().includes(filtro) ||
        produto.localizacao.toLowerCase().includes(filtro)
      );
    }
  }

  visualizarProduto(item: Produto): void {
    console.log('👁️ Visualizando produto V2:', item.descricao);
    console.log('📊 Detalhes completos V2:', {
      codigo: item.codigo,
      descricao: item.descricao,
      estoque: item.estoqueAtual,
      entrada: item.entrada,          // 🆕
      empenho: item.empenho,          // 🆕  
      disponivel: item.disponivel,    // 🆕
      preco: item.custoUnitario,
      local: item.localizacao,
      bloqueado: item.bloqueado,
      status: item.status
    });
    // TODO: Implementar modal de visualização com todos os campos V2
  }
}