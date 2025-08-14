// Criar arquivo src/app/core/services/pedidos.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap, retry, timeout } from 'rxjs/operators';
import { PedidoAtrasado, PedidoAtrasadoResponse, PedidoAtrasadoProcessado, PedidoItem, PedidoItemResponse, PedidoResumo } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private readonly pedidosAtrasadosUrl = 'http://192.168.0.251:8401/rest/VKLISTAPEDATRASADOS';
  private readonly pedidoItensUrl = 'http://192.168.0.251:8401/rest/VKPESTLISTAPRDPC';

  constructor(private http: HttpClient) {
    console.log('🚚 PedidosService inicializado');
  }

  // HEADERS COM BASIC AUTH PARA API DE PEDIDOS
  private getPedidosHeaders(): HttpHeaders {
    const credentials = btoa('admin:msmvk');
    
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Basic ${credentials}`,
      'Cache-Control': 'no-cache'
    });
  }

  // BUSCAR PEDIDOS ATRASADOS
  getPedidosAtrasados(): Observable<PedidoAtrasadoProcessado[]> {
    console.log('🔍 Buscando pedidos atrasados...');
    console.log('📡 URL:', this.pedidosAtrasadosUrl);
    console.log('🔐 Headers:', this.getPedidosHeaders());
    
    return this.http.get<PedidoAtrasadoResponse>(this.pedidosAtrasadosUrl, {
      headers: this.getPedidosHeaders()
    }).pipe(
      timeout(15000),
      retry(2),
      tap(response => {
        console.log('📦 Resposta bruta da API:', response);
        console.log('📊 Tipo da resposta:', typeof response);
        console.log('📋 Propriedades da resposta:', Object.keys(response || {}));
      }),
      map(response => {
        console.log('🔄 Processando resposta da API de pedidos atrasados...');
        
        if (!response) {
          console.warn('⚠️ Resposta vazia da API');
          return [];
        }
        
        if (!response.items) {
          console.warn('⚠️ Resposta da API não contém propriedade "items":', response);
          return [];
        }
        
        if (!Array.isArray(response.items)) {
          console.warn('⚠️ Propriedade "items" não é um array:', response.items);
          return [];
        }
        
        console.log(`✅ API retornou ${response.items.length} pedidos atrasados`);
        
        // Processar pedidos para adicionar informações calculadas
        const pedidosProcessados: PedidoAtrasadoProcessado[] = response.items.map((pedido, index) => {
          console.log(`🔄 Processando pedido ${index + 1}:`, pedido);
          
          const dataPreviewFormatada = this.parseDataPrevista(pedido.dataprevista);
          const diasAtraso = this.calcularDiasAtraso(dataPreviewFormatada);
          const prioridade = this.determinarPrioridade(diasAtraso);
          
          const pedidoProcessado: PedidoAtrasadoProcessado = {
            ...pedido,
            dataPreviewFormatada,
            diasAtraso,
            prioridade
          };
          
          console.log(`✅ Pedido ${index + 1} processado:`, {
            codigo: pedidoProcessado.codigo,
            fornecedor: pedidoProcessado.descricao,
            diasAtraso: pedidoProcessado.diasAtraso,
            prioridade: pedidoProcessado.prioridade
          });
          
          return pedidoProcessado;
        });
        
        // Ordenar por dias de atraso (maior primeiro)
        pedidosProcessados.sort((a, b) => b.diasAtraso - a.diasAtraso);
        
        console.log(`✅ ${pedidosProcessados.length} pedidos atrasados processados com sucesso`);
        console.log('📊 Pedidos finais:', pedidosProcessados);
        
        return pedidosProcessados;
      }),
      tap(pedidos => {
        // Log de estatísticas
        const criticos = pedidos.filter(p => p.prioridade === 'CRITICA').length;
        const altos = pedidos.filter(p => p.prioridade === 'ALTA').length;
        const medios = pedidos.filter(p => p.prioridade === 'MEDIA').length;
        
        console.log('📊 Estatísticas dos pedidos atrasados da API REAL:', {
          total: pedidos.length,
          criticos,
          altos,
          medios,
          maiorAtraso: pedidos.length > 0 ? pedidos[0].diasAtraso : 0
        });
      }),
      catchError(error => {
        console.error('❌ Erro ao buscar pedidos atrasados da API REAL:', error);
        console.error('🔍 Detalhes do erro:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url,
          error: error.error
        });
        
        // Verificações específicas de erro
        if (error.status === 0) {
          console.error('🚫 Erro de CORS ou rede - servidor pode estar offline');
        } else if (error.status === 401) {
          console.error('🔐 Erro de autenticação - verificar credenciais');
        } else if (error.status === 404) {
          console.error('🔍 Endpoint não encontrado - verificar URL');
        } else if (error.status === 500) {
          console.error('⚠️ Erro interno do servidor');
        }
        
        return this.handleApiError(error);
      })
    );
  }

  // CONVERTER DATA STRING PARA DATE
  private parseDataPrevista(dataString: string): Date {
    try {
      // Formato esperado: dd/MM/yyyy ou MM/dd/yyyy
      const partes = dataString.split('/');
      
      if (partes.length === 3) {
        // Assumindo formato dd/MM/yyyy
        const dia = parseInt(partes[0], 10);
        const mes = parseInt(partes[1], 10) - 1; // Mês em JavaScript é 0-indexado
        const ano = parseInt(partes[2], 10);
        
        return new Date(ano, mes, dia);
      }
      
      // Fallback para parsing automático
      return new Date(dataString);
    } catch (error) {
      console.warn('⚠️ Erro ao converter data:', dataString, error);
      return new Date(); // Retorna data atual em caso de erro
    }
  }

  // CALCULAR DIAS DE ATRASO
  private calcularDiasAtraso(dataPrevista: Date): number {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Zerar horas para comparação apenas de datas
    
    dataPrevista.setHours(0, 0, 0, 0);
    
    const diffTime = hoje.getTime() - dataPrevista.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays); // Não retornar valores negativos
  }

  // DETERMINAR PRIORIDADE BASEADA NOS DIAS DE ATRASO
  private determinarPrioridade(diasAtraso: number): 'CRITICA' | 'ALTA' | 'MEDIA' {
    if (diasAtraso >= 30) {
      return 'CRITICA';
    } else if (diasAtraso >= 15) {
      return 'ALTA';
    } else {
      return 'MEDIA';
    }
  }

  // TRATAMENTO DE ERROS
  private handleApiError(error: HttpErrorResponse): Observable<PedidoAtrasadoProcessado[]> {
    console.error('❌ Erro na API de pedidos:', {
      status: error.status,
      statusText: error.statusText,
      message: error.message,
      url: error.url
    });
    
    if (error.status === 0) {
      console.error('🚫 Erro de rede - verifique se o servidor está online');
    } else if (error.status === 401) {
      console.error('🔐 Erro de autenticação - verifique usuário e senha');
    } else if (error.status === 404) {
      console.error('🔍 Endpoint não encontrado - verifique a URL');
    }
    
    // Retornar dados mock em caso de erro para desenvolvimento
    console.log('🔄 Usando dados mock para pedidos atrasados');
    return this.getPedidosAtrasadosMock();
  }

  // DADOS MOCK PARA DESENVOLVIMENTO
  private getPedidosAtrasadosMock(): Observable<PedidoAtrasadoProcessado[]> {
    const mockData: PedidoAtrasado[] = [
      {
        codigo: "032413",
        fornecedor: "000752",
        descricao: "ELETRICA FAZIS INDUSTRIA E COMERCIO LTDA",
        codigocomprador: "000152",
        comprador: "ANDRESA MARQUES",
        dataprevista: "01/08/2025"
      },
      {
        codigo: "032407",
        fornecedor: "001595",
        descricao: "ONDUPRESS EMBALAGENS INDUSTRIA E COMERCI",
        codigocomprador: "000004",
        comprador: "MARCOS LALLA",
        dataprevista: "15/07/2025"
      },
      {
        codigo: "032401",
        fornecedor: "001234",
        descricao: "FORNECEDOR TESTE LTDA",
        codigocomprador: "000001",
        comprador: "JOÃO SILVA",
        dataprevista: "10/06/2025"
      }
    ];
    
    const pedidosProcessados = mockData.map(pedido => {
      const dataPreviewFormatada = this.parseDataPrevista(pedido.dataprevista);
      const diasAtraso = this.calcularDiasAtraso(dataPreviewFormatada);
      const prioridade = this.determinarPrioridade(diasAtraso);
      
      return {
        ...pedido,
        dataPreviewFormatada,
        diasAtraso,
        prioridade
      } as PedidoAtrasadoProcessado;
    });
    
    return of(pedidosProcessados);
  }

  // BUSCAR ITENS DO PEDIDO
  getPedidoItens(numeroPedido: string): Observable<{itens: PedidoItem[], resumo: PedidoResumo}> {
    console.log('🔍 Buscando itens do pedido:', numeroPedido);
    console.log('📡 URL:', this.pedidoItensUrl);
    
    const requestBody = {
      pedido: numeroPedido
    };
    
    console.log('📤 Body da requisição:', JSON.stringify(requestBody));
    
    return this.http.post<PedidoItemResponse>(this.pedidoItensUrl, requestBody, {
      headers: this.getPedidosHeaders()
    }).pipe(
      timeout(15000),
      retry(2),
      tap(response => {
        console.log('📦 Resposta bruta da API de itens:', response);
        console.log('📊 Quantidade de itens:', response.items?.length || 0);
      }),
      map(response => {
        console.log('🔄 Processando itens do pedido...');
        
        if (!response || !response.items || !Array.isArray(response.items)) {
          console.warn('⚠️ Resposta da API não contém itens válidos:', response);
          return { itens: [], resumo: this.calcularResumoVazio() };
        }
        
        const itens = response.items;
        const resumo = this.calcularResumoPedido(itens);
        
        console.log(`✅ ${itens.length} itens processados com sucesso`);
        console.log('📊 Resumo calculado:', resumo);
        
        return { itens, resumo };
      }),
      catchError(error => {
        console.error('❌ Erro ao buscar itens do pedido:', error);
        console.error('🔍 Detalhes do erro:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url
        });
        
        // Retornar dados mock em caso de erro
        console.log('🔄 Usando dados mock para itens do pedido');
        return this.getPedidoItensMock(numeroPedido);
      })
    );
  }

  // CALCULAR RESUMO FINANCEIRO DO PEDIDO
  private calcularResumoPedido(itens: PedidoItem[]): PedidoResumo {
    const resumo: PedidoResumo = {
      totalQuantidade: 0,
      totalValor: 0,
      totalIPI: 0,
      totalICM: 0,
      totalDespesa: 0,
      totalFrete: 0,
      valorTotal: 0,
      itensCount: itens.length
    };
    
    itens.forEach(item => {
      resumo.totalQuantidade += item.quantidade;
      resumo.totalValor += item.total;
      resumo.totalIPI += item.valoripi;
      resumo.totalICM += item.valoricm;
      resumo.totalDespesa += item.despesa;
      resumo.totalFrete += item.frete;
    });
    
    resumo.valorTotal = resumo.totalValor + resumo.totalIPI + resumo.totalDespesa + resumo.totalFrete;
    
    return resumo;
  }

  private calcularResumoVazio(): PedidoResumo {
    return {
      totalQuantidade: 0,
      totalValor: 0,
      totalIPI: 0,
      totalICM: 0,
      totalDespesa: 0,
      totalFrete: 0,
      valorTotal: 0,
      itensCount: 0
    };
  }

  // DADOS MOCK PARA ITENS DO PEDIDO
  private getPedidoItensMock(numeroPedido: string): Observable<{itens: PedidoItem[], resumo: PedidoResumo}> {
    const mockItens: PedidoItem[] = [
      {
        pedido: numeroPedido,
        item: "0001",
        produto: "600600360",
        descricao: "CESTO ORGANIZADOR EM FIBRA SINTETICA - ARGILA G - E - 370 (C) X 260 (P) X 30 (A) MM",
        unimedida: "UN",
        quantidade: 12,
        preco: 82.4,
        total: 988.8,
        observacao: "OXXOS GERANDO 53607, 608",
        emissao: "07/08/2025",
        previsao: "19/08/2025",
        condpagamento: "010",
        valoripi: 0,
        valoricm: 118.66,
        baseicm: 988.8,
        baseipi: 988.8,
        despesa: 0,
        frete: 0
      },
      {
        pedido: numeroPedido,
        item: "0002",
        produto: "600600361",
        descricao: "CESTO ORGANIZADOR EM FIBRA SINTETICA - ARGILA G - E - 370 (C) X 305 (P) X 30 (A) MM",
        unimedida: "UN",
        quantidade: 6,
        preco: 84.71,
        total: 508.26,
        observacao: "OXXOS GERANDO 53607, 608",
        emissao: "07/08/2025",
        previsao: "19/08/2025",
        condpagamento: "010",
        valoripi: 0,
        valoricm: 60.99,
        baseicm: 508.26,
        baseipi: 508.26,
        despesa: 0,
        frete: 0
      },
      {
        pedido: numeroPedido,
        item: "0003",
        produto: "600600390",
        descricao: "CESTO ORGANIZADOR EM FIBRA SINTETICA - ARGILA G - 295 (C) X 400 (P) X 100 (A) MM",
        unimedida: "UN",
        quantidade: 36,
        preco: 122.31,
        total: 4403.16,
        observacao: "OXXOS GERANDO 53607, 608",
        emissao: "07/08/2025",
        previsao: "19/08/2025",
        condpagamento: "010",
        valoripi: 0,
        valoricm: 528.38,
        baseicm: 4403.16,
        baseipi: 4403.16,
        despesa: 0,
        frete: 0
      }
    ];
    
    const resumo = this.calcularResumoPedido(mockItens);
    
    return of({ itens: mockItens, resumo });
  }
}