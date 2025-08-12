import { Component } from '@angular/core';
import { PoMenuItem } from '@po-ui/ng-components';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <po-toolbar 
        p-title="📦 Painel de Estoque"
        p-logo="/assets/logo.png">
        <div class="toolbar-actions">
          <po-button
            p-label="Atualizar"
            p-icon="po-icon-refresh"
            p-kind="tertiary"
            p-size="small"
            (p-click)="atualizarDados()">
          </po-button>
        </div>
      </po-toolbar>
      
      <div class="main-layout">
        <div class="menu-container" [class.hidden]="menuCollapsed">
          <po-menu 
            [p-menus]="menuItems"
            [p-collapsed]="false"
            [p-filter]="true">
          </po-menu>
        </div>
        
        <div class="content-area" [class.menu-hidden]="menuCollapsed">
          <div class="breadcrumb-area">
            <po-breadcrumb [p-items]="breadcrumbItems"></po-breadcrumb>
            
            <div class="breadcrumb-actions">
              <po-button
                [p-label]="menuCollapsed ? '📋 Mostrar Menu' : '📋 Esconder Menu'"
                [p-icon]="menuCollapsed ? 'po-icon-menu' : 'po-icon-close'"
                p-kind="tertiary"
                p-size="small"
                (p-click)="toggleMenu()">
              </po-button>
            </div>
          </div>
          
          <div class="page-content">
            <router-outlet></router-outlet>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      overflow-x: hidden;
    }
    
    .main-layout {
      display: flex;
      min-height: calc(100vh - 56px);
      position: relative;
      overflow: hidden;
    }
    
    /* Menu container com show/hide completo */
    .menu-container {
      width: 250px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      flex-shrink: 0;
      overflow: hidden;
      position: relative;
      z-index: 1000;
      transform: translateX(0);
    }
    
    .menu-container.hidden {
      transform: translateX(-250px);
      width: 0;
    }
    
    .content-area {
      flex: 1;
      background-color: #f8f9fa;
      display: flex;
      flex-direction: column;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      min-width: 0;
      overflow: hidden;
    }
    
    .content-area.menu-hidden {
      margin-left: 0;
    }
    
    .breadcrumb-area {
      background: white;
      padding: 12px 24px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      border-bottom: 1px solid #e9ecef;
      flex-shrink: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .breadcrumb-actions {
      display: flex;
      gap: 8px;
    }
    
    .page-content {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
      overflow-x: hidden;
    }
    
    .toolbar-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    /* Responsividade para mobile */
    @media (max-width: 768px) {
      .menu-container {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        z-index: 1001;
      }
      
      .menu-container.hidden {
        transform: translateX(-100%);
      }
      
      .content-area {
        width: 100%;
        margin-left: 0;
      }
      
      .page-content {
        padding: 16px;
      }
      
      .breadcrumb-area {
        padding: 8px 16px;
        flex-direction: column;
        gap: 8px;
        align-items: stretch;
      }
      
      .breadcrumb-actions {
        justify-content: center;
      }
    }
    
    /* Garantir que o menu sempre tenha background branco */
    ::ng-deep .po-menu {
      background: white !important;
      box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    }
  `]
})
export class AppComponent {
  title = 'mvk-paineldeestoque';
  menuCollapsed = false;
  
  menuItems: Array<PoMenuItem> = [
    {
      label: 'Dashboard',
      icon: 'po-icon-home',
      shortLabel: 'Home',
      badge: { value: 1, color: 'color-11' }
    },
    {
      label: 'Estoque',
      icon: 'po-icon-stock',
      shortLabel: 'EST',
      subItems: [
        {
          label: 'Matéria Prima',
          link: '/materia-prima',
          icon: 'po-icon-factory',
          shortLabel: 'MP'
        },
        {
          label: 'Material de Consumo',
          link: '/material-consumo',
          icon: 'po-icon-box',
          shortLabel: 'MC'
        }
      ]
    },
    {
      label: 'Compras',
      icon: 'po-icon-cart',
      shortLabel: 'COM',
      subItems: [
        {
          label: 'Ponto de Pedido',
          link: '/ponto-pedido',
          icon: 'po-icon-chart-line',
          shortLabel: 'PP',
          badge: { value: 4, color: 'color-08' }
        }
      ]
    },
    {
      label: 'Relatórios',
      icon: 'po-icon-chart-donut',
      shortLabel: 'REL'
    }
  ];

  breadcrumbItems = [
    { label: 'Início', link: '/' },
    { label: 'Estoque', link: '/estoque' }
  ];

  toggleMenu(): void {
    this.menuCollapsed = !this.menuCollapsed;
    console.log('Menu toggled:', this.menuCollapsed);
  }

  atualizarDados(): void {
    console.log('Atualizando dados do sistema...');
  }
}