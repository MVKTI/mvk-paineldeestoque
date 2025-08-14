// Atualizar src/app/app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MateriaPrimaComponent } from './pages/materia-prima/materia-prima.component';
import { MaterialConsumoComponent } from './pages/material-consumo/material-consumo.component';
import { PontoPedidoComponent } from './pages/ponto-pedido/ponto-pedido.component';
import { RelatoriosComponent } from './pages/relatorios/relatorios.component';
import { PedidosAtrasadosComponent } from './pages/pedidos-atrasados/pedidos-atrasados.component';
import { PedidosProximosComponent } from './pages/pedidos-proximos/pedidos-proximos.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/materia-prima',
    pathMatch: 'full'
  },
  {
    path: 'materia-prima',
    component: MateriaPrimaComponent,
    data: { title: 'Matéria Prima' }
  },
  {
    path: 'material-consumo',
    component: MaterialConsumoComponent,
    data: { title: 'Material de Consumo' }
  },
  {
    path: 'ponto-pedido',
    component: PontoPedidoComponent,
    data: { title: 'Ponto de Pedido' }
  },
  {
    path: 'follow-up/pedidos-atrasados',
    component: PedidosAtrasadosComponent,
    data: { title: 'Pedidos Atrasados' }
  },
  {
    path: 'follow-up/pedidos-proximos',
    component: PedidosProximosComponent,
    data: { title: 'Pedidos Próximos da Entrega' }
  },
  {
    path: 'relatorios',
    component: RelatoriosComponent,
    data: { title: 'Relatórios' }
  },
  {
    path: '**',
    redirectTo: '/materia-prima'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: false, // Set to true for debugging
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }