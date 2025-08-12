import { Component, OnInit } from '@angular/core';
import { EstoqueService } from '../../core/services/estoque.service';

@Component({
  selector: 'app-materia-prima',
  template: `
    <po-page-default p-title="Matéria Prima">
      <div class="row">
        <div class="col-md-3">
          <app-grupos-sidebar
            tipo="MATERIA_PRIMA"
            [grupoSelecionado]="grupoSelecionado"
            (grupoChange)="onGrupoChange($event)">
          </app-grupos-sidebar>
        </div>
        
        <div class="col-md-9">
          <app-produtos-list
            tipo="MATERIA_PRIMA"
            [grupoSelecionado]="grupoSelecionado">
          </app-produtos-list>
        </div>
      </div>
    </po-page-default>
  `
})
export class MateriaPrimaComponent implements OnInit {
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