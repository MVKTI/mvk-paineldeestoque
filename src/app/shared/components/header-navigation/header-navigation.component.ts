// Atualizar src/app/shared/components/header-navigation/header-navigation.component.ts

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

        <!-- NOVO: Follow-up Pedidos com Dropdown -->
        <div class="nav-dropdown" 
             [class.open]="dropdownOpen" 
             (clickOutside)="closeDropdown()">
          <button 
            class="nav-item dropdown-trigger"
            [class.active]="currentRoute.includes('/follow-up')"
            (click)="toggleDropdown()"
            title="Follow-up de Pedidos">
            <span class="nav-icon">🚚</span>
            <span class="nav-label">Follow-up Pedidos</span>
            <span class="dropdown-arrow" [class.rotated]="dropdownOpen">▼</span>
          </button>

          <div class="dropdown-menu" *ngIf="dropdownOpen">
            <button 
              class="dropdown-item"
              (click)="navigateTo('/follow-up/pedidos-atrasados')"
              title="Pedidos Atrasados">
              <span class="dropdown-icon">⚠️</span>
              <span class="dropdown-label">Pedidos Atrasados</span>
            </button>
            
            <button 
              class="dropdown-item"
              (click)="navigateTo('/follow-up/pedidos-proximos')"
              title="Pedidos Próximos da Entrega">
              <span class="dropdown-icon">⏰</span>
              <span class="dropdown-label">Pedidos Próximos</span>
            </button>
          </div>
        </div>

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
          <span class="user-role">Gestor</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .header-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
      color: white;
      padding: 0 20px;
      height: 56px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }

    .nav-brand h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: white;
    }

    .nav-menu {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.9);
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 13px;
      white-space: nowrap;
    }

    .nav-item:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      transform: translateY(-1px);
    }

    .nav-item.active {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      font-weight: 500;
    }

    .nav-icon {
      font-size: 16px;
    }

    .nav-label {
      font-size: 13px;
    }

    /* ESTILOS PARA DROPDOWN */
    .nav-dropdown {
      position: relative;
      display: inline-block;
    }

    .dropdown-trigger {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .dropdown-arrow {
      font-size: 10px;
      margin-left: 4px;
      transition: transform 0.2s ease;
    }

    .dropdown-arrow.rotated {
      transform: rotate(180deg);
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      background: white;
      border-radius: 8px;
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
      padding: 8px 0;
      min-width: 200px;
      z-index: 1001;
      margin-top: 8px;
      border: 1px solid rgba(0,0,0,0.1);
    }

    .dropdown-menu::before {
      content: '';
      position: absolute;
      top: -6px;
      left: 20px;
      width: 12px;
      height: 12px;
      background: white;
      border: 1px solid rgba(0,0,0,0.1);
      border-bottom: none;
      border-right: none;
      transform: rotate(45deg);
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 10px 16px;
      background: transparent;
      border: none;
      color: #2c3e50;
      cursor: pointer;
      transition: background-color 0.2s ease;
      font-size: 13px;
      text-align: left;
    }

    .dropdown-item:hover {
      background-color: #f8f9fa;
    }

    .dropdown-icon {
      font-size: 14px;
      width: 16px;
      text-align: center;
    }

    .dropdown-label {
      font-size: 13px;
    }

    /* Ações do usuário */
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .action-btn {
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.8);
      cursor: pointer;
      padding: 6px;
      border-radius: 4px;
      transition: all 0.2s ease;
      font-size: 16px;
    }

    .action-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      font-size: 12px;
      line-height: 1.2;
    }

    .user-name {
      font-weight: 500;
      color: white;
    }

    .user-role {
      color: rgba(255, 255, 255, 0.7);
    }

    /* Responsividade */
    @media (max-width: 768px) {
      .header-nav {
        height: 52px;
        padding: 0 12px;
      }

      .nav-brand h3 {
        font-size: 16px;
      }

      .nav-menu {
        gap: 4px;
      }

      .nav-item {
        padding: 6px 8px;
        font-size: 12px;
      }

      .nav-label {
        display: none;
      }

      .nav-icon {
        font-size: 18px;
      }

      .dropdown-menu {
        min-width: 180px;
        right: 0;
        left: auto;
      }

      .dropdown-menu::before {
        left: auto;
        right: 20px;
      }

      .user-info {
        display: none;
      }
    }

    @media (max-width: 480px) {
      .nav-actions {
        gap: 8px;
      }

      .action-btn {
        padding: 4px;
      }
    }
  `]
})
export class HeaderNavigationComponent implements OnInit {
  currentRoute = '';
  dropdownOpen = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Escutar mudanças de rota
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        // Cast para NavigationEnd após o filter
        const navEvent = event as NavigationEnd;
        this.currentRoute = navEvent.url;
        this.closeDropdown(); // Fechar dropdown ao navegar
      });

    // Definir rota inicial
    this.currentRoute = this.router.url;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.closeDropdown();
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  // Fechar dropdown ao clicar fora (implementar directive se necessário)
  onClickOutside(): void {
    this.closeDropdown();
  }
}