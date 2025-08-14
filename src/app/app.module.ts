// Versão alternativa do src/app/app.module.ts (se houver problemas com imports específicos)

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// PO UI - Importação geral
import { PoModule } from '@po-ui/ng-components';

// Routing
import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';
import { HeaderNavigationComponent } from './shared/components/header-navigation/header-navigation.component';
import { ProdutosListComponent } from './shared/components/produtos-list/produtos-list.component';
import { PedidoDetalhesModalComponent } from './shared/components/pedido-detalhes-modal/pedido-detalhes-modal.component';

// Pages
import { MateriaPrimaComponent } from './pages/materia-prima/materia-prima.component';
import { MaterialConsumoComponent } from './pages/material-consumo/material-consumo.component';
import { PontoPedidoComponent } from './pages/ponto-pedido/ponto-pedido.component';
import { RelatoriosComponent } from './pages/relatorios/relatorios.component';
import { PedidosAtrasadosComponent } from './pages/pedidos-atrasados/pedidos-atrasados.component';
import { PedidosProximosComponent } from './pages/pedidos-proximos/pedidos-proximos.component';

// Services
import { EstoqueService } from './core/services/estoque.service';
import { PedidosService } from './core/services/pedidos.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderNavigationComponent,
    ProdutosListComponent,
    PedidoDetalhesModalComponent,
    MateriaPrimaComponent,
    MaterialConsumoComponent,
    PontoPedidoComponent,
    RelatoriosComponent,
    PedidosAtrasadosComponent,
    PedidosProximosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    PoModule // Importação geral do PO-UI
  ],
  providers: [
    EstoqueService,
    PedidosService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Permite elementos customizados
  bootstrap: [AppComponent]
})
export class AppModule { }