import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';

import { MaterialConsumoComponent } from './material-consumo.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    MaterialConsumoComponent
  ],
  imports: [
    CommonModule,
    PoModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: MaterialConsumoComponent }
    ])
  ]
})
export class MaterialConsumoModule { }