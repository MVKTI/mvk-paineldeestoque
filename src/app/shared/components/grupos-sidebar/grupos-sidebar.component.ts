import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { EstoqueService } from '../../../core/services/estoque.service';
import { Grupo } from '../../../core/models';

@Component({
  selector: 'app-grupos-sidebar',
  template: `
    <po-widget 
      p-title="🏷️ Grupos de Produtos" 
      [p-height]="600"
      p-primary-label="Grupos Disponíveis">
      
      <div class="grupos-container">
        <div class="filtro-grupos">
          <po-input 
            p-placeholder="🔍 Buscar grupo..."
            [(ngModel)]="filtroTexto"
            (ngModelChange)="filtrarGrupos()"
            p-clean="true">
          </po-input>
        </div>
        
        <div class="grupos-stats">
          <div class="stat-item">
            <span class="stat-numero">{{ grupos.length }}</span>
            <span class="stat-label">Grupos</span>
          </div>
          <div class="stat-item">
            <span class="stat-numero">{{ totalProdutos }}</span>
            <span class="stat-label">Produtos</span>
          </div>
        </div>
        
        <div class="grupos-lista">
          <div 
            *ngFor="let grupo of gruposFiltrados; trackBy: trackByGrupo"
            class="grupo-card"
            [class.selected]="grupo.codigo === grupoSelecionado"
            [class.has-products]="grupo.totalProdutos > 0"
            (click)="onSelectGrupo(grupo)">
            
            <div class="card-header">
              <div class="grupo-icon">📦</div>
              <div class="grupo-info">
                <div class="grupo-nome">{{ grupo.descricao }}</div>
                <div class="grupo-codigo">{{ grupo.codigo }}</div>
              </div>
            </div>
            
            <div class="card-footer">
              <div class="produto-count">
                <span class="count-numero">{{ grupo.totalProdutos }}</span>
                <span class="count-label">produtos</span>
              </div>
              <div class="status-indicator" 
                   [class.active]="grupo.ativo">
              </div>
            </div>
          </div>
        </div>
        
        <div class="grupos-actions">
          <po-button
            p-label="📋 Todos os Grupos"
            p-kind="primary"
            p-size="small"
            [p-disabled]="!grupoSelecionado"
            (p-click)="selecionarTodos()">
          </po-button>
        </div>
      </div>
    </po-widget>
  `,
  styles: [`
    .grupos-container {
      padding: 16px;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .filtro-grupos {
      margin-bottom: 8px;
    }
    
    .grupos-stats {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }
    
    .stat-item {
      flex: 1;
      text-align: center;
      padding: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 8px;
      color: white;
    }
    
    .stat-numero {
      display: block;
      font-size: 1.5rem;
      font-weight: bold;
    }
    
    .stat-label {
      font-size: 0.8rem;
      opacity: 0.9;
    }
    
    .grupos-lista {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .grupo-card {
      background: white;
      border-radius: 12px;
      padding: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      position: relative;
      overflow: hidden;
    }
    
    .grupo-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .grupo-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }
    
    .grupo-card:hover::before {
      opacity: 1;
    }
    
    .grupo-card.selected {
      border-color: #667eea;
      background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%);
      transform: translateY(-2px);
    }
    
    .grupo-card.selected::before {
      opacity: 1;
    }
    
    .card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }
    
    .grupo-icon {
      font-size: 1.5rem;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8f9fa;
      border-radius: 8px;
    }
    
    .grupo-info {
      flex: 1;
    }
    
    .grupo-nome {
      font-weight: 600;
      color: #2c3e50;
      font-size: 1rem;
      margin-bottom: 2px;
    }
    
    .grupo-codigo {
      font-size: 0.85rem;
      color: #6c757d;
      font-family: 'Courier New', monospace;
    }
    
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .produto-count {
      display: flex;
      align-items: baseline;
      gap: 4px;
    }
    
    .count-numero {
      font-weight: bold;
      color: #667eea;
      font-size: 1.1rem;
    }
    
    .count-label {
      font-size: 0.8rem;
      color: #6c757d;
    }
    
    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #dc3545;
      transition: background-color 0.3s ease;
    }
    
    .status-indicator.active {
      background-color: #28a745;
    }
    
    .grupos-actions {
      text-align: center;
      padding-top: 16px;
      border-top: 1px solid #e9ecef;
    }
    
    /* Scrollbar customizada */
    .grupos-lista::-webkit-scrollbar {
      width: 6px;
    }
    
    .grupos-lista::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }
    
    .grupos-lista::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;
    }
    
    .grupos-lista::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }
  `]
})
export class GruposSidebarComponent implements OnInit {
  @Input() tipo: 'MATERIA_PRIMA' | 'MATERIAL_CONSUMO' = 'MATERIA_PRIMA';
  @Input() grupoSelecionado: string = '';
  @Output() grupoChange = new EventEmitter<string>();

  grupos: Grupo[] = [];
  gruposFiltrados: Grupo[] = [];
  filtroTexto: string = '';

  get totalProdutos(): number {
    return this.grupos.reduce((total, grupo) => total + grupo.totalProdutos, 0);
  }

  constructor(private estoqueService: EstoqueService) {}

 ngOnInit(): void {
  // Teste automático da API
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
    this.grupoChange.emit(grupo.codigo);
  }

  selecionarTodos(): void {
    this.grupoChange.emit('');
    this.filtroTexto = '';
    this.filtrarGrupos();
  }

  trackByGrupo(index: number, grupo: Grupo): string {
    return grupo.codigo;
  }
}