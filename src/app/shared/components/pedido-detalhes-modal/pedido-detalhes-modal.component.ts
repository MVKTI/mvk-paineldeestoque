// Versão simplificada do modal para teste - src/app/shared/components/pedido-detalhes-modal/pedido-detalhes-modal.component.ts

import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { PedidosService } from '../../../core/services/pedidos.service';
import { PedidoAtrasadoProcessado, PedidoItem } from '../../../core/models';

@Component({
  selector: 'app-pedido-detalhes-modal',
  template: `
    <div class="modal-overlay" *ngIf="visible" (click)="fecharModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <!-- Header simples -->
        <div class="modal-header">
          <h3 *ngIf="pedido">📋 Detalhes do Pedido {{ pedido.codigo }}</h3>
          <button class="close-btn" (click)="fecharModal()">✕</button>
        </div>

        <!-- Informações básicas -->
        <div class="modal-body" *ngIf="pedido">
          <div class="pedido-info">
            <p><strong>Fornecedor:</strong> {{ pedido.descricao }}</p>
            <p><strong>Comprador:</strong> {{ pedido.comprador }}</p>
            <p><strong>Dias de Atraso:</strong> {{ pedido.diasAtraso }} dias</p>
            <p><strong>Prioridade:</strong> {{ pedido.prioridade }}</p>
          </div>

          <!-- Loading -->
          <div *ngIf="loading" class="loading">
            <p>🔄 Carregando itens do pedido...</p>
          </div>

          <!-- Lista de itens simples -->
          <div *ngIf="!loading && itens.length > 0" class="itens-lista">
            <h4>📦 Itens do Pedido ({{ itens.length }})</h4>
            <div class="item" *ngFor="let item of itens; let i = index">
              <div class="item-header">
                <strong>{{ item.item }} - {{ item.produto }}</strong>
                <span class="item-total">{{ formatarMoeda(item.total) }}</span>
              </div>
              <div class="item-desc">{{ item.descricao }}</div>
              <div class="item-details">
                Qtd: {{ item.quantidade }} {{ item.unimedida }} × {{ formatarMoeda(item.preco) }}
              </div>
            </div>
          </div>

          <!-- Estado vazio -->
          <div *ngIf="!loading && itens.length === 0" class="empty">
            <p>📋 Nenhum item encontrado para este pedido.</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button class="btn-secondary" (click)="imprimirPedido()">🖨️ Imprimir</button>
          <button class="btn-primary" (click)="fecharModal()">Fechar</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }

    .modal-content {
      background: white;
      border-radius: 8px;
      max-width: 800px;
      max-height: 90vh;
      width: 100%;
      display: flex;
      flex-direction: column;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #e9ecef;
    }

    .modal-header h3 {
      margin: 0;
      color: #2c3e50;
      font-size: 18px;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #6c757d;
      padding: 5px 10px;
      border-radius: 4px;
    }

    .close-btn:hover {
      background: #f8f9fa;
      color: #2c3e50;
    }

    .modal-body {
      padding: 20px;
      overflow-y: auto;
      flex: 1;
    }

    .pedido-info {
      background: #f8f9fa;
      padding: 16px;
      border-radius: 6px;
      margin-bottom: 20px;
      border-left: 4px solid #007bff;
    }

    .pedido-info p {
      margin: 0 0 8px 0;
      font-size: 14px;
    }

    .pedido-info p:last-child {
      margin-bottom: 0;
    }

    .loading {
      text-align: center;
      padding: 40px;
      color: #6c757d;
    }

    .itens-lista h4 {
      margin: 0 0 16px 0;
      color: #2c3e50;
      font-size: 16px;
    }

    .item {
      border: 1px solid #e9ecef;
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 12px;
      background: #fff;
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .item-header strong {
      color: #2c3e50;
      font-size: 14px;
    }

    .item-total {
      color: #007bff;
      font-weight: 600;
      font-size: 14px;
    }

    .item-desc {
      color: #6c757d;
      font-size: 13px;
      margin-bottom: 4px;
      line-height: 1.4;
    }

    .item-details {
      color: #495057;
      font-size: 12px;
      font-weight: 500;
    }

    .empty {
      text-align: center;
      padding: 40px;
      color: #6c757d;
    }

    .modal-footer {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding: 20px;
      border-top: 1px solid #e9ecef;
    }

    .btn-primary,
    .btn-secondary {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background: #0056b3;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #545b62;
    }

    @media (max-width: 768px) {
      .modal-overlay {
        padding: 10px;
      }

      .modal-content {
        max-height: 95vh;
      }

      .modal-header,
      .modal-body,
      .modal-footer {
        padding: 16px;
      }

      .item-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }
    }
  `]
})
export class PedidoDetalhesModalComponent implements OnChanges {
  @Input() visible = false;
  @Input() pedido: PedidoAtrasadoProcessado | null = null;
  @Output() fechar = new EventEmitter<void>();

  itens: PedidoItem[] = [];
  loading = false;

  constructor(private pedidosService: PedidosService) {}

  ngOnChanges(): void {
    console.log('🔄 Modal ngOnChanges:', {
      visible: this.visible,
      pedido: this.pedido?.codigo
    });

    if (this.visible && this.pedido) {
      this.carregarItensPedido();
    } else if (!this.visible) {
      this.limparDados();
    }
  }

  carregarItensPedido(): void {
    if (!this.pedido) return;

    this.loading = true;
    this.itens = [];

    console.log('🔄 Carregando itens do pedido:', this.pedido.codigo);

    this.pedidosService.getPedidoItens(this.pedido.codigo).subscribe({
      next: (dados) => {
        console.log(`✅ ${dados.itens.length} itens carregados`);
        this.itens = dados.itens;
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar itens:', error);
        this.itens = [];
        this.loading = false;
      }
    });
  }

  fecharModal(): void {
    console.log('🚪 Fechando modal');
    this.fechar.emit();
  }

  imprimirPedido(): void {
    console.log('🖨️ Imprimir pedido:', this.pedido?.codigo);
    alert('Funcionalidade de impressão será implementada em breve.');
  }

  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  private limparDados(): void {
    this.itens = [];
    this.loading = false;
  }
}