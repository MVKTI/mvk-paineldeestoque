import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PoModule } from '@po-ui/ng-components';

import { PontoPedidoComponent } from './ponto-pedido.component';

@NgModule({
  declarations: [
    PontoPedidoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PoModule,
    RouterModule.forChild([
      { path: '', component: PontoPedidoComponent }
    ])
  ]
})
export class PontoPedidoModule { }