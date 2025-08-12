import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PoModule } from '@po-ui/ng-components';

import { GruposSidebarComponent } from './components/grupos-sidebar/grupos-sidebar.component';
import { ProdutosListComponent } from './components/produtos-list/produtos-list.component';

@NgModule({
  declarations: [
    GruposSidebarComponent,
    ProdutosListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PoModule
  ],
  exports: [
    GruposSidebarComponent,
    ProdutosListComponent
  ]
})
export class SharedModule { }