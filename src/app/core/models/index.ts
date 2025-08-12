export interface Produto {
  codigo: string;
  descricao: string;
  grupo: string;
  grupoDescricao: string;
  unidade: string;
  estoqueAtual: number;
  estoqueMinimo: number;
  estoqueMaximo: number;
  custoUnitario: number;
  ultimaCompra?: Date;
  fornecedor: string;
  localizacao: string;
  status: 'ATIVO' | 'INATIVO' | 'BLOQUEADO';
  tipo: 'MATERIA_PRIMA' | 'MATERIAL_CONSUMO';
}

export interface Grupo {
  codigo: string;
  descricao: string;
  tipo: 'MATERIA_PRIMA' | 'MATERIAL_CONSUMO';
  ativo: boolean;
  totalProdutos: number;
}

export interface PontoPedido {
  produtoCodigo: string;
  produtoDescricao: string;
  grupo: string;
  estoqueAtual: number;
  pontoReposicao: number;
  quantidadeSugerida: number;
  diasSemEstoque: number;
  consumoMedio: number;
  prioridade: 'ALTA' | 'MEDIA' | 'BAIXA';
  ultimoPedido?: Date;
  fornecedor: string;
}