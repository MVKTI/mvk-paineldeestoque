import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/materia-prima', pathMatch: 'full' },
  {
    path: 'materia-prima',
    loadChildren: () => import('./pages/materia-prima/materia-prima.module').then(m => m.MateriaPrimaModule)
  },
  {
    path: 'material-consumo',
    loadChildren: () => import('./pages/material-consumo/material-consumo.module').then(m => m.MaterialConsumoModule)
  },
  {
    path: 'ponto-pedido',
    loadChildren: () => import('./pages/ponto-pedido/ponto-pedido.module').then(m => m.PontoPedidoModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }