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
  
  // Campos da API V2
  entrada: number;         // entrada - entradas previstas
  empenho: number;         // empenho - quantidade empenhada  
  disponivel: number;      // disponivel - estoque disponível real
  bloqueado: boolean;      // bloq convertido para boolean
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

export interface PedidoAtrasado {
  codigo: string;
  fornecedor: string;
  descricao: string;
  codigocomprador: string;
  comprador: string;
  dataprevista: string; // Formato da API: dd/MM/yyyy
}

export interface PedidoAtrasadoResponse {
  items: PedidoAtrasado[];
}

// Interface processada para uso no componente
export interface PedidoAtrasadoProcessado extends PedidoAtrasado {
  dataPreviewFormatada: Date;
  diasAtraso: number;
  prioridade: 'CRITICA' | 'ALTA' | 'MEDIA';
}

export interface PedidoItem {
  pedido: string;
  item: string;
  produto: string;
  descricao: string;
  unimedida: string;
  quantidade: number;
  preco: number;
  total: number;
  observacao: string;
  emissao: string;
  previsao: string;
  condpagamento: string;
  valoripi: number;
  valoricm: number;
  baseicm: number;
  baseipi: number;
  despesa: number;
  frete: number;
}

export interface PedidoItemResponse {
  items: PedidoItem[];
}

// Interface para resumo financeiro do pedido
export interface PedidoResumo {
  totalQuantidade: number;
  totalValor: number;
  totalIPI: number;
  totalICM: number;
  totalDespesa: number;
  totalFrete: number;
  valorTotal: number;
  itensCount: number;
}