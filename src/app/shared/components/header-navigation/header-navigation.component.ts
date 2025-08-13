import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header-navigation',
  template: `
    <div class="header-nav">
      <!-- Logo/Título -->
      <div class="nav-brand">
        <h3>📦 Sistema de Estoque</h3>
      </div>

      <!-- Menu de Navegação -->
      <nav class="nav-menu">
        <button 
          class="nav-item"
          [class.active]="currentRoute === '/materia-prima'"
          (click)="navigateTo('/materia-prima')"
          title="Matéria Prima">
          <span class="nav-icon">🏭</span>
          <span class="nav-label">Matéria Prima</span>
        </button>

        <button 
          class="nav-item"
          [class.active]="currentRoute === '/material-consumo'"
          (click)="navigateTo('/material-consumo')"
          title="Material de Consumo">
          <span class="nav-icon">📋</span>
          <span class="nav-label">Material Consumo</span>
        </button>

        <button 
          class="nav-item"
          [class.active]="currentRoute === '/ponto-pedido'"
          (click)="navigateTo('/ponto-pedido')"
          title="Ponto de Pedido">
          <span class="nav-icon">📊</span>
          <span class="nav-label">Ponto de Pedido</span>
        </button>

        <button 
          class="nav-item"
          [class.active]="currentRoute === '/relatorios'"
          (click)="navigateTo('/relatorios')"
          title="Relatórios">
          <span class="nav-icon">📈</span>
          <span class="nav-label">Relatórios</span>
        </button>
      </nav>

      <!-- Ações do usuário -->
      <div class="nav-actions">
        <button class="action-btn" title="Configurações">
          <span>⚙️</span>
        </button>
        
        <button class="action-btn" title="Ajuda">
          <span>❓</span>
        </button>

        <div class="user-info">
          <span class="user-name">Admin</span>
          <button class="user-menu" title="Menu do usuário">
            <span>👤</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .header-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      height: 56px;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }

    .nav-brand h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: white;
      min-width: 180px;
    }

    .nav-menu {
      display: flex;
      align-items: center;
      gap: 4px;
      flex: 1;
      justify-content: center;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: rgba(255,255,255,0.1);
      border: none;
      border-radius: 6px;
      color: white;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      backdrop-filter: blur(10px);
    }

    .nav-item:hover {
      background: rgba(255,255,255,0.2);
      transform: translateY(-1px);
    }

    .nav-item.active {
      background: rgba(255,255,255,0.25);
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      font-weight: 600;
    }

    .nav-icon {
      font-size: 16px;
    }

    .nav-label {
      font-size: 12px;
      white-space: nowrap;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 180px;
      justify-content: flex-end;
    }

    .action-btn {
      padding: 6px;
      background: rgba(255,255,255,0.1);
      border: none;
      border-radius: 4px;
      color: white;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      backdrop-filter: blur(10px);
    }

    .action-btn:hover {
      background: rgba(255,255,255,0.2);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 8px;
      background: rgba(255,255,255,0.1);
      border-radius: 6px;
      backdrop-filter: blur(10px);
    }

    .user-name {
      font-size: 12px;
      font-weight: 500;
    }

    .user-menu {
      background: none;
      border: none;
      color: white;
      font-size: 16px;
      cursor: pointer;
      padding: 2px;
      border-radius: 4px;
      transition: all 0.2s ease;
    }

    .user-menu:hover {
      background: rgba(255,255,255,0.2);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .header-nav {
        padding: 6px 12px;
        height: 52px;
      }

      .nav-brand h3 {
        font-size: 14px;
        min-width: auto;
      }

      .nav-menu {
        gap: 2px;
      }

      .nav-item {
        padding: 6px 12px;
        font-size: 12px;
      }

      .nav-label {
        display: none;
      }

      .nav-icon {
        font-size: 18px;
      }

      .user-name {
        display: none;
      }

      .nav-actions {
        min-width: auto;
        gap: 4px;
      }
    }

    @media (max-width: 480px) {
      .nav-item {
        padding: 4px 8px;
      }

      .nav-brand h3 {
        font-size: 12px;
      }

      .action-btn {
        padding: 4px;
        font-size: 12px;
      }
    }
  `]
})
export class HeaderNavigationComponent implements OnInit {
  currentRoute: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Detectar rota atual
    this.currentRoute = this.router.url;
    
    // Escutar mudanças de rota
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentRoute = (event as NavigationEnd).url;
      });
  }

  navigateTo(route: string): void {
    console.log(`🧭 Navegando para: ${route}`);
    this.router.navigate([route]);
  }
}