import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <!-- Header fixo com navegação -->
    <app-header-navigation></app-header-navigation>
    
    <!-- Conteúdo principal -->
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .main-content {
      margin-top: 56px; /* Altura do header */
      min-height: calc(100vh - 56px);
      background-color: #f5f5f5;
      padding: 0;
    }

    @media (max-width: 768px) {
      .main-content {
        margin-top: 52px;
        min-height: calc(100vh - 52px);
      }
    }
  `]
})
export class AppComponent {
  title = 'sistema-estoque';
}