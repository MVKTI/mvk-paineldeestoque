import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EstoqueService } from '../../../core/services/estoque.service';
import { Grupo } from '../../../core/models';

@Component({
  selector: 'app-grupos-sidebar',
  template: `
    <div class="grupos-sidebar">
      <!-- Cabeçalho compacto -->
      <div class="sidebar-header">
        <h4>📂 Grupos</h4>
        <small class="total-produtos">{{ totalProdutos }} produtos</small>
      </div>

      <!-- Filtro compacto -->
      <div class="filtro-container">
        <po-input
          p-clean
          p-icon="po-icon-search"
          p-placeholder="Buscar..."
          p-size="small"
          [(ngModel)]="filtroTexto"
          (p-change)="filtrarGrupos()">
        </po-input>
      </div>

      <!-- Botão "Todos" compacto -->
      <div class="grupo-item todos-grupos"
           [class.selected]="grupoSelecionado === ''"
           (click)="selecionarTodos()">
        <div class="grupo-info">
          <strong>📋 Todos</strong>
          <small class="grupo-count">{{ totalProdutos }}</small>
        </div>
      </div>

      <!-- Lista compacta -->
      <div class="grupos-lista">
        <div 
          *ngFor="let grupo of gruposFiltrados; trackBy: trackByGrupo"
          class="grupo-item"
          [class.selected]="grupoSelecionado === grupo.codigo"
          [class.inativo]="!grupo.ativo"
          (click)="onSelectGrupo(grupo)"
          (dblclick)="onDoubleClickGrupo(grupo)"
          [title]="'Duplo clique: ' + grupo.descricao">
          
          <div class="grupo-info">
            <strong>{{ grupo.descricao }}</strong>
            <div class="grupo-detalhes">
              <small class="grupo-codigo">{{ grupo.codigo }}</small>
              <small class="grupo-count">{{ grupo.totalProdutos }}</small>
            </div>
          </div>
          
          <div class="grupo-status">
            <span *ngIf="!grupo.ativo" class="status-inativo">⏸️</span>
            <span *ngIf="grupoSelecionado === grupo.codigo" class="selected-indicator">✓</span>
          </div>
        </div>
      </div>

      <!-- Instruções compactas -->
      <div class="instrucoes">
        <small>💡 Duplo clique para carregar</small>
      </div>
    </div>
  `,
  styles: [`
    .grupos-sidebar {
      background: white;
      border-radius: 6px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.1);
      height: calc(100vh - 100px);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      font-size: 13px;
    }

    .sidebar-header {
      padding: 12px;
      border-bottom: 1px solid #e9ecef;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
    }

    .sidebar-header h4 {
      margin: 0 0 2px 0;
      font-size: 14px;
      font-weight: 600;
    }

    .total-produtos {
      font-size: 11px;
      opacity: 0.9;
    }

    .filtro-container {
      padding: 8px;
      border-bottom: 1px solid #e9ecef;
      background: #f8f9fa;
    }

    .grupos-lista {
      flex: 1;
      overflow-y: auto;
      padding: 4px 0;
    }

    .grupo-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      cursor: pointer;
      border-left: 2px solid transparent;
      transition: all 0.15s ease;
      user-select: none;
      min-height: 44px;
    }

    .grupo-item:hover {
      background: #f8f9fa;
      border-left-color: #667eea;
    }

    .grupo-item.selected {
      background: #e3f2fd;
      border-left-color: #2196f3;
    }

    .grupo-item.todos-grupos {
      background: #f1f3f4;
      border-bottom: 1px solid #e9ecef;
      margin-bottom: 2px;
    }

    .grupo-item.todos-grupos.selected {
      background: #e8f5e8;
      border-left-color: #4caf50;
    }

    .grupo-item.inativo {
      opacity: 0.6;
    }

    .grupo-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .grupo-info strong {
      font-size: 12px;
      color: #2c3e50;
      line-height: 1.2;
      font-weight: 500;
    }

    .grupo-detalhes {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .grupo-codigo {
      font-size: 10px;
      color: #6c757d;
      font-family: 'Courier New', monospace;
    }

    .grupo-count {
      font-size: 10px;
      color: #28a745;
      font-weight: 500;
    }

    .grupo-status {
      display: flex;
      align-items: center;
      gap: 2px;
    }

    .status-inativo {
      font-size: 10px;
    }

    .selected-indicator {
      color: #2196f3;
      font-weight: bold;
      font-size: 12px;
    }

    .instrucoes {
      padding: 8px;
      background: #f8f9fa;
      border-top: 1px solid #e9ecef;
      text-align: center;
    }

    .instrucoes small {
      font-size: 10px;
      color: #6c757d;
    }

    /* Scrollbar fina */
    .grupos-lista::-webkit-scrollbar {
      width: 4px;
    }

    .grupos-lista::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    .grupos-lista::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 2px;
    }

    .grupos-lista::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }

    /* Efeito visual compacto */
    @keyframes pulseSmall {
      0% { transform: scale(1); }
      50% { transform: scale(1.01); }
      100% { transform: scale(1); }
    }

    .grupo-item:active {
      animation: pulseSmall 0.1s ease;
    }

    @media (max-width: 768px) {
      .grupos-sidebar {
        font-size: 12px;
      }
      
      .sidebar-header h4 {
        font-size: 13px;
      }
      
      .grupo-info strong {
        font-size: 11px;
      }
    }
  `]
})
export class GruposSidebarComponent implements OnInit {
  @Input() tipo: 'MATERIA_PRIMA' | 'MATERIAL_CONSUMO' = 'MATERIA_PRIMA';
  @Input() grupoSelecionado: string = '';
  @Output() grupoChange = new EventEmitter<string>();
  @Output() produtosRequested = new EventEmitter<string>();

  grupos: Grupo[] = [];
  gruposFiltrados: Grupo[] = [];
  filtroTexto: string = '';

  get totalProdutos(): number {
    return this.grupos.reduce((total, grupo) => total + grupo.totalProdutos, 0);
  }

  constructor(private estoqueService: EstoqueService) {}

  ngOnInit(): void {
    this.estoqueService.testarConexao().subscribe({
      next: (response) => {
        if (response.connected === false) {
          console.warn('⚠️ API não conectada, usando dados mock');
        }
      },
      error: (error) => {
        console.warn('⚠️ Teste de API falhou, usando dados mock');
      }
    });
    
    this.carregarGrupos();
  }

  carregarGrupos(): void {
    this.estoqueService.getGrupos(this.tipo).subscribe({
      next: (grupos) => {
        this.grupos = grupos;
        this.gruposFiltrados = grupos;
      },
      error: (error) => {
        console.error('Erro ao carregar grupos:', error);
      }
    });
  }

  filtrarGrupos(): void {
    if (!this.filtroTexto) {
      this.gruposFiltrados = this.grupos;
    } else {
      const filtro = this.filtroTexto.toLowerCase();
      this.gruposFiltrados = this.grupos.filter(grupo =>
        grupo.descricao.toLowerCase().includes(filtro) ||
        grupo.codigo.toLowerCase().includes(filtro)
      );
    }
  }

  onSelectGrupo(grupo: Grupo): void {
    console.log('🖱️ Grupo selecionado:', grupo.codigo);
    this.grupoChange.emit(grupo.codigo);
  }

  onDoubleClickGrupo(grupo: Grupo): void {
    console.log('🖱️🖱️ Duplo clique no grupo:', grupo.codigo, grupo.descricao);
    this.grupoChange.emit(grupo.codigo);
    this.produtosRequested.emit(grupo.codigo);
    console.log(`📦 Carregando produtos do grupo: ${grupo.descricao}...`);
  }

  selecionarTodos(): void {
    console.log('🖱️ Selecionando todos os grupos');
    this.grupoChange.emit('');
    this.filtroTexto = '';
    this.filtrarGrupos();
  }

  trackByGrupo(index: number, grupo: Grupo): string {
    return grupo.codigo;
  }
}