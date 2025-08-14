import { Component, OnInit, OnChanges, SimpleChanges, Input, AfterViewInit, OnDestroy } from '@angular/core';
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

      <!-- Tabela de produtos V2 - com novos campos e cores por status -->
      <div *ngIf="!loading && grupoSelecionado" class="table-container" id="produtos-table-final">
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
    :host ::ng-deep .po-table .po-table-column:nth-child(7) {
      font-weight: bold;
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
export class ProdutosListComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() tipo: 'MATERIA_PRIMA' | 'MATERIAL_CONSUMO' = 'MATERIA_PRIMA';
  @Input() grupoSelecionado: string = '';
  @Input() forceReload: number = 0;
  @Input() filtroExterno: string = '';

  produtos: Produto[] = [];
  produtosFiltrados: Produto[] = [];
  loading = false;
  tableHeight = 500;
  
  private colorInterval: number | null = null;

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

  ngAfterViewInit(): void {
    // Aguardar a tabela renderizar e então aplicar cores
    setTimeout(() => {
      this.applyCorrectColors();
      this.startPeriodicColorCheck();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.cleanupAll();
    if (this.colorInterval !== null) {
      clearInterval(this.colorInterval);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['grupoSelecionado'] || changes['forceReload']) {
      this.carregarProdutos();
    }
    
    if (changes['filtroExterno']) {
      this.aplicarFiltroExterno();
    }
  }

  private cleanupAll(): void {
    // Remover estilos CSS específicos
    const styleElement = document.getElementById('produtos-colors-final');
    if (styleElement) {
      styleElement.remove();
    }
  }

  private startPeriodicColorCheck(): void {
    // Verificar e corrigir cores a cada 3 segundos
    this.colorInterval = window.setInterval(() => {
      this.applyCorrectColors();
    }, 3000);

    // Parar após 2 minutos
    setTimeout(() => {
      if (this.colorInterval !== null) {
        clearInterval(this.colorInterval);
        this.colorInterval = null;
        console.log('🎯 Monitoramento de cores finalizado');
      }
    }, 120000);
  }

  private applyCorrectColors(): void {
    if (!this.produtosFiltrados || this.produtosFiltrados.length === 0) {
      return;
    }

    console.log('🎨 Aplicando cores corretas...');
    
    // Primeiro, remover estilos anteriores
    this.cleanupAll();
    
    // Encontrar linhas da tabela
    const rows = document.querySelectorAll('#produtos-table-final tbody tr');
    
    if (rows.length === 0) {
      console.log('❌ Nenhuma linha encontrada ainda');
      return;
    }

    let redCount = 0;
    let blueCount = 0;
    let normalCount = 0;

    // Aplicar cores linha por linha
    rows.forEach((row: Element, index: number) => {
      if (index < this.produtosFiltrados.length) {
        const produto = this.produtosFiltrados[index];
        const htmlRow = row as HTMLElement;

        // LIMPAR TODOS os estilos anteriores
        htmlRow.style.removeProperty('background-color');
        htmlRow.style.removeProperty('border-left');
        htmlRow.style.removeProperty('box-shadow');
        htmlRow.style.removeProperty('background-image');

        // Limpar células também
        const cells = htmlRow.querySelectorAll('td');
        cells.forEach(cell => {
          (cell as HTMLElement).style.removeProperty('background-color');
        });

        // Aplicar cor APENAS se atender às condições
        if (produto.disponivel < 0) {
          // VERMELHO para disponível negativo
          htmlRow.style.setProperty('background-color', '#ffebee', 'important');
          htmlRow.style.setProperty('border-left', '4px solid #f44336', 'important');
          htmlRow.style.setProperty('background-image', 'linear-gradient(rgba(255, 235, 238, 0.8), rgba(255, 235, 238, 0.8))', 'important');
          
          redCount++;
          console.log(`🔴 Linha ${index + 1}: ${produto.codigo} (Disponível: ${produto.disponivel})`);
          
        } else if (produto.status === 'BLOQUEADO') {
          // AZUL para status bloqueado
          htmlRow.style.setProperty('background-color', '#e3f2fd', 'important');
          htmlRow.style.setProperty('border-left', '4px solid #2196f3', 'important');
          htmlRow.style.setProperty('background-image', 'linear-gradient(rgba(227, 242, 253, 0.8), rgba(227, 242, 253, 0.8))', 'important');
          
          blueCount++;
          console.log(`🔵 Linha ${index + 1}: ${produto.codigo} (Status: ${produto.status})`);
          
        } else {
          // NORMAL - sem cor
          normalCount++;
          console.log(`⚪ Linha ${index + 1}: ${produto.codigo} (Normal - Disponível: ${produto.disponivel}, Status: ${produto.status})`);
        }
      }
    });

    console.log(`✅ Cores aplicadas: 🔴${redCount} 🔵${blueCount} ⚪${normalCount} de ${rows.length} linhas`);

    // Parar o monitoramento se aplicou corretamente
    if (redCount === this.getExpectedRedCount() && blueCount === this.getExpectedBlueCount()) {
      if (this.colorInterval !== null) {
        clearInterval(this.colorInterval);
        this.colorInterval = null;
        console.log('🎉 Cores aplicadas corretamente! Monitoramento parado.');
      }
    }
  }

  private getExpectedRedCount(): number {
    return this.produtosFiltrados.filter(p => p.disponivel < 0).length;
  }

  private getExpectedBlueCount(): number {
    return this.produtosFiltrados.filter(p => p.status === 'BLOQUEADO').length;
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
        
        // Debug das condições de cor
        let negativeCount = 0;
        let blockedCount = 0;
        
        produtos.forEach((produto, index) => {
          if (produto.disponivel < 0) {
            negativeCount++;
            console.log(`🔴 Produto ${index + 1} com disponível negativo: ${produto.codigo} - ${produto.descricao} (${produto.disponivel})`);
          }
          if (produto.status === 'BLOQUEADO') {
            blockedCount++;
            console.log(`🔵 Produto ${index + 1} bloqueado: ${produto.codigo} - ${produto.descricao}`);
          }
        });
        
        console.log(`📊 Resumo esperado: ${negativeCount} vermelhas, ${blockedCount} azuis, ${produtos.length - negativeCount - blockedCount} normais`);
        
        this.produtos = produtos;
        this.aplicarFiltroExterno();
        this.loading = false;
        
        // Aplicar cores após carregar
        setTimeout(() => {
          this.applyCorrectColors();
          if (this.colorInterval === null) {
            this.startPeriodicColorCheck();
          }
        }, 1000);
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
    
    // Aplicar cores após filtrar
    setTimeout(() => {
      this.applyCorrectColors();
    }, 500);
  }

  visualizarProduto(item: Produto): void {
    console.log('👁️ Visualizando produto V2:', item.descricao);
    console.log('📊 Detalhes completos V2:', {
      codigo: item.codigo,
      descricao: item.descricao,
      estoque: item.estoqueAtual,
      entrada: item.entrada,
      empenho: item.empenho,
      disponivel: item.disponivel,
      preco: item.custoUnitario,
      local: item.localizacao,
      bloqueado: item.bloqueado,
      status: item.status
    });
    // TODO: Implementar modal de visualização com todos os campos V2
  }
}