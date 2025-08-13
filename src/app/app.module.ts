import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// PO UI
import { PoModule } from '@po-ui/ng-components';

// Componentes da aplicação
import { AppComponent } from './app.component';
import { HeaderNavigationComponent } from './shared/components/header-navigation/header-navigation.component';
import { MateriaPrimaComponent } from './pages/materia-prima/materia-prima.component';
import { MaterialConsumoComponent } from './pages/material-consumo/material-consumo.component';
import { ProdutosListComponent } from './shared/components/produtos-list/produtos-list.component';

// Rotas
const routes: Routes = [
  { path: '', redirectTo: '/materia-prima', pathMatch: 'full' },
  { path: 'materia-prima', component: MateriaPrimaComponent },
  { path: 'material-consumo', component: MaterialConsumoComponent },
  { path: 'ponto-pedido', component: MateriaPrimaComponent }, // Temporário
  { path: 'relatorios', component: MateriaPrimaComponent }, // Temporário
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderNavigationComponent,
    MateriaPrimaComponent,
    MaterialConsumoComponent,
    ProdutosListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    PoModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }