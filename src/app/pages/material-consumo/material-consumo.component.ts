import { Component, OnInit } from '@angular/core';
import { EstoqueService } from '../../core/services/estoque.service';

@Component({
  selector: 'app-material-consumo',
  template: `
    <po-page-default p-title="Material de Consumo">
      <div class="row">
        <div class="col-md-3">
          <app-grupos-sidebar
            tipo="MATERIAL_CONSUMO"
            [grupoSelecionado]="grupoSelecionado"
            (grupoChange)="onGrupoChange($event)">
          </app-grupos-sidebar>
        </div>
        
        <div class="col-md-9">
          <app-produtos-list
            tipo="MATERIAL_CONSUMO"
            [grupoSelecionado]="grupoSelecionado">
          </app-produtos-list>
        </div>
      </div>
    </po-page-default>
  `
})
export class MaterialConsumoComponent implements OnInit {
  grupoSelecionado: string = '';

  constructor(private estoqueService: EstoqueService) {}

  ngOnInit(): void {
    this.grupoSelecionado = this.estoqueService.getGrupoSelecionado();
  }

  onGrupoChange(codigo: string): void {
    this.grupoSelecionado = codigo;
    this.estoqueService.selecionarGrupo(codigo);
  }
}