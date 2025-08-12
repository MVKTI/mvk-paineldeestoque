import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';

import { MateriaPrimaComponent } from './materia-prima.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    MateriaPrimaComponent
  ],
  imports: [
    CommonModule,
    PoModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: MateriaPrimaComponent }
    ])
  ]
})
export class MateriaPrimaModule { }