import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { catchError, map, tap, retry, timeout } from 'rxjs/operators';
import { Produto, Grupo, PontoPedido } from '../models';
import { environment } from '../../../environments/environment';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  items?: T;
  message?: string;
  total?: number;
}

// Interface para o novo retorno da API V2 de produtos
interface ProdutoApiResponse {
  items: {
    codigo: string;
    descricao: string;
    local: string;
    estoqueatual: number;
    entrada: number;
    empenho: number;
    disponivel: number;
    bloq: string;
    unimedida: string;
    ultpreco: number;
    ativo: boolean;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class EstoqueService {
  private apiUrl = environment.apiUrl;
  private endpoints = environment.endpoints;
  private grupoSelecionadoSubject = new BehaviorSubject<string>('');
  grupoSelecionado$ = this.grupoSelecionadoSubject.asObservable();

  // URL específica para a API de produtos
  private readonly produtosApiUrl = 'http://192.168.0.251:8401/rest/VKPESTLISTAPRDMP';

  constructor(private http: HttpClient) {
    console.log('🔗 EstoqueService V2 inicializado');
    console.log('📍 API URL:', this.apiUrl);
    console.log('🎯 Endpoints:', this.endpoints);
    console.log('📦 Produtos API URL:', this.produtosApiUrl);
  }

  // HEADERS COM BASIC AUTH CONFIGURADO
  private getHeaders(): HttpHeaders {
    const credentials = btoa(`${environment.auth.username}:${environment.auth.password}`);
    
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Basic ${credentials}`,
      'Cache-Control': 'no-cache'
    });
  }

  // HEADERS ESPECÍFICOS PARA API DE PRODUTOS
  private getProdutosHeaders(): HttpHeaders {
    const credentials = btoa('admin:msmvk');
    
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Basic ${credentials}`,
      'Cache-Control': 'no-cache'
    });
  }

  // TESTE DE CONECTIVIDADE
  testarConexao(): Observable<any> {
    const testUrl = `${this.apiUrl}/${this.endpoints.grupos}`;
    console.log('🔍 Testando conexão:', testUrl);
    
    return this.http.get(testUrl, { 
      headers: this.getHeaders() 
    }).pipe(
      timeout(10000),
      tap(response => {
        console.log('✅ API conectada com sucesso:', response);
      }),
      catchError(error => {
        console.error('❌ Erro de conexão:', error);
        return of({ 
          connected: false, 
          error: error.message,
          status: error.status,
          url: testUrl
        });
      })
    );
  }

  // BUSCAR GRUPOS
  getGrupos(tipo: 'MATERIA_PRIMA' | 'MATERIAL_CONSUMO'): Observable<Grupo[]> {
    const url = `${this.apiUrl}/${this.endpoints.grupos}`;
    console.log(`🔍 Buscando grupos: ${tipo}`);
    console.log(`📡 URL completa: ${url}`);
    
    let params = new HttpParams();
    params = params.set('tipo', tipo);
    
    return this.http.get<ApiResponse<Grupo[]>>(url, {
      headers: this.getHeaders(),
      params: params
    }).pipe(
      timeout(environment.timeout),
      retry(environment.retryAttempts),
      map(response => {
        console.log('📦 Resposta completa da API:', response);
        
        let grupos: any[] = [];
        
        if (response.items) {
          grupos = response.items;
        } else if (response.data) {
          grupos = Array.isArray(response.data) ? response.data : [response.data];
        } else if (Array.isArray(response)) {
          grupos = response;
        } else {
          console.warn('⚠️ Formato de resposta não reconhecido:', response);
          grupos = [];
        }
        
        console.log('📊 Dados dos grupos extraídos:', grupos);
        
        const gruposMapeados = grupos.map(item => {
          const grupo: Grupo = {
            codigo: item.codigo || item.BM_GRUPO || item.grupo_codigo || item.id || '',
            descricao: item.descricao || item.BM_DESC || item.grupo_nome || item.nome || 'Sem descrição',
            tipo: tipo,
            ativo: item.ativo !== false && item.ativo !== 'N',
            totalProdutos: item.totalProdutos || item.total_produtos || item.total || 0
          };
          
          console.log('🔄 Grupo mapeado:', grupo);
          return grupo;
        });
        
        return gruposMapeados;
      }),
      tap(grupos => {
        console.log(`✅ ${grupos.length} grupos carregados com sucesso:`, grupos);
      }),
      catchError(error => {
        console.error('❌ Erro ao buscar grupos:', error);
        return this.handleApiError(error, 'grupos', tipo);
      })
    );
  }

  // BUSCAR PRODUTOS DA API V2 - MÉTODO POST
  getProdutos(tipo: 'MATERIA_PRIMA' | 'MATERIAL_CONSUMO', grupo?: string): Observable<Produto[]> {
    console.log(`🔍 Buscando produtos V2: ${tipo}, grupo: ${grupo}`);
    
    if (!grupo) {
      console.log('ℹ️ Nenhum grupo selecionado, retornando lista vazia');
      return of([]);
    }

    console.log(`📡 Chamando API V2 de produtos (POST) para grupo: ${grupo}`);
    console.log(`🌐 URL: ${this.produtosApiUrl}`);
    
    const requestBody = {
      grupo: grupo
    };
    
    console.log('📤 Body JSON enviado:', JSON.stringify(requestBody, null, 2));
    
    return this.http.post<ProdutoApiResponse>(this.produtosApiUrl, requestBody, {
      headers: this.getProdutosHeaders()
    }).pipe(
      timeout(15000),
      retry(2),
      map(response => {
        console.log('📦 Resposta da API V2 de produtos:', response);
        
        if (!response.items || !Array.isArray(response.items)) {
          console.warn('⚠️ Resposta da API V2 não contém items válidos:', response);
          return [];
        }
        
        // Mapear produtos da API V2 para o modelo do frontend
        const produtosMapeados: Produto[] = response.items.map(item => {
          // Determinar status baseado nos campos 'ativo' e 'bloq'
          let status: 'ATIVO' | 'INATIVO' | 'BLOQUEADO' = 'ATIVO';
          if (!item.ativo) {
            status = 'INATIVO';
          } else if (item.bloq === '1' || item.bloq === 'S') {
            status = 'BLOQUEADO';
          }
          
          const produto: Produto = {
            codigo: item.codigo,
            descricao: item.descricao,
            grupo: grupo,
            grupoDescricao: '',
            unidade: item.unimedida,
            estoqueAtual: item.estoqueatual,  // 🔄 Campo atualizado
            estoqueMinimo: 0,
            estoqueMaximo: 0,
            custoUnitario: item.ultpreco,
            ultimaCompra: undefined,
            fornecedor: '',
            localizacao: item.local,
            status: status,
            tipo: tipo,
            // Novos campos da API V2
            entrada: item.entrada,           // 🆕 Entradas previstas
            empenho: item.empenho,          // 🆕 Quantidade empenhada
            disponivel: item.disponivel,    // 🆕 Estoque disponível real
            bloqueado: item.bloq === '1' || item.bloq === 'S'
          };
          
          console.log('🔄 Produto V2 mapeado:', {
            codigo: produto.codigo,
            estoque: produto.estoqueAtual,
            entrada: produto.entrada,
            empenho: produto.empenho,
            disponivel: produto.disponivel,
            bloqueado: produto.bloqueado
          });
          
          return produto;
        });
        
        console.log(`✅ ${produtosMapeados.length} produtos V2 mapeados com sucesso`);
        return produtosMapeados;
      }),
      tap(produtos => {
        console.log(`✅ ${produtos.length} produtos carregados da API V2 via POST`);
        
        // Log de resumo dos estoques
        const totalEstoque = produtos.reduce((sum, p) => sum + p.estoqueAtual, 0);
        const totalDisponivel = produtos.reduce((sum, p) => sum + p.disponivel, 0);
        const produtosComEstoqueNegativo = produtos.filter(p => p.disponivel < 0);
        
        console.log('📊 Resumo do estoque:', {
          totalProdutos: produtos.length,
          estoqueTotal: totalEstoque,
          disponivelTotal: totalDisponivel,
          produtosComEstoqueNegativo: produtosComEstoqueNegativo.length
        });
      }),
      catchError(error => {
        console.error('❌ Erro ao buscar produtos da API V2 (POST):', error);
        
        // Em caso de erro, usar dados mock como fallback
        console.log('🔄 Usando dados mock como fallback para produtos V2');
        return this.getProdutosMock(tipo, grupo);
      })
    );
  }

  // PONTO DE PEDIDO (PREPARADO)
  getPontosPedido(): Observable<PontoPedido[]> {
    console.log('🔍 Pontos de pedido solicitados');
    console.log('ℹ️ Endpoint de pontos de pedido ainda não implementado, usando mock');
    
    return this.getPontosPedidoMock();
  }

  // TRATAMENTO DE ERROS
  private handleApiError(error: HttpErrorResponse, endpoint: string, tipo?: string): Observable<any> {
    console.error(`❌ Erro na API ${endpoint}:`, {
      status: error.status,
      statusText: error.statusText,
      message: error.message,
      url: error.url,
      error: error.error
    });
    
    if (error.status === 0) {
      console.error('🚫 Erro de rede - verifique se o servidor está online');
    } else if (error.status === 401) {
      console.error('🔐 Erro de autenticação - verifique usuário e senha');
    } else if (error.status === 404) {
      console.error('🔍 Endpoint não encontrado - verifique a URL');
    } else if (error.status >= 500) {
      console.error('⚠️ Erro interno do servidor');
    }
    
    if (this.deveUsarFallback(error)) {
      console.log('🔄 Usando dados mock como fallback');
      return this.getFallbackData(endpoint, tipo);
    } else {
      const errorMessage = `Erro na API: ${error.status} - ${error.message}`;
      return throwError(() => new Error(errorMessage));
    }
  }

  private deveUsarFallback(error: HttpErrorResponse): boolean {
    return error.status === 0 || 
           error.status === 404 || 
           error.status === 500 || 
           error.status === 503;
  }

  private getFallbackData(endpoint: string, tipo?: string): Observable<any> {
    switch (endpoint) {
      case 'grupos':
        return this.getGruposMock(tipo as 'MATERIA_PRIMA' | 'MATERIAL_CONSUMO');
      case 'produtos':
        return this.getProdutosMock(tipo as 'MATERIA_PRIMA' | 'MATERIAL_CONSUMO');
      case 'pontos-pedido':
        return this.getPontosPedidoMock();
      default:
        return of([]);
    }
  }

  // DADOS MOCK COMO FALLBACK V2
  private getGruposMock(tipo: 'MATERIA_PRIMA' | 'MATERIAL_CONSUMO'): Observable<Grupo[]> {
    console.log('🎭 Usando dados mock para grupos:', tipo);
    
    const mockGrupos: Grupo[] = [
      { 
        codigo: '001', 
        descricao: 'Químicos [MOCK]', 
        tipo: 'MATERIA_PRIMA' as const,
        ativo: true, 
        totalProdutos: 25 
      },
      { 
        codigo: '002', 
        descricao: 'Metais [MOCK]', 
        tipo: 'MATERIA_PRIMA' as const,
        ativo: true, 
        totalProdutos: 18 
      },
      { 
        codigo: '003', 
        descricao: 'Plásticos [MOCK]', 
        tipo: 'MATERIA_PRIMA' as const,
        ativo: true, 
        totalProdutos: 12 
      },
      { 
        codigo: '101', 
        descricao: 'Escritório [MOCK]', 
        tipo: 'MATERIAL_CONSUMO' as const,
        ativo: true, 
        totalProdutos: 45 
      },
      { 
        codigo: '102', 
        descricao: 'Limpeza [MOCK]', 
        tipo: 'MATERIAL_CONSUMO' as const,
        ativo: true, 
        totalProdutos: 32 
      }
    ].filter(g => g.tipo === tipo);

    return of(mockGrupos);
  }

  private getProdutosMock(tipo: 'MATERIA_PRIMA' | 'MATERIAL_CONSUMO', grupo?: string): Observable<Produto[]> {
    console.log('🎭 Usando dados mock V2 para produtos:', tipo, grupo);
    
    const mockProdutos: Produto[] = [
      {
        codigo: 'MP001',
        descricao: 'Ácido Sulfúrico 98% [MOCK V2]',
        grupo: '001',
        grupoDescricao: 'Químicos',
        unidade: 'KG',
        estoqueAtual: 500,
        estoqueMinimo: 100,
        estoqueMaximo: 1000,
        custoUnitario: 15.50,
        fornecedor: 'Química Ltda',
        localizacao: 'A001',
        status: 'ATIVO' as const,
        tipo: 'MATERIA_PRIMA' as const,
        entrada: 200,      // 🆕 V2
        empenho: 150,      // 🆕 V2
        disponivel: 550,   // 🆕 V2
        bloqueado: false
      },
      {
        codigo: 'MC001',
        descricao: 'Papel A4 [MOCK V2]',
        grupo: '101',
        grupoDescricao: 'Escritório',
        unidade: 'PC',
        estoqueAtual: 25,
        estoqueMinimo: 10,
        estoqueMaximo: 100,
        custoUnitario: 12.00,
        fornecedor: 'Papelaria Ltda',
        localizacao: 'C001',
        status: 'ATIVO' as const,
        tipo: 'MATERIAL_CONSUMO' as const,
        entrada: 50,       // 🆕 V2
        empenho: 30,       // 🆕 V2
        disponivel: 45,    // 🆕 V2
        bloqueado: false
      }
    ].filter(p => p.tipo === tipo && (!grupo || p.grupo === grupo));

    return of(mockProdutos);
  }

  private getPontosPedidoMock(): Observable<PontoPedido[]> {
    return of([
      {
        produtoCodigo: 'MP001',
        produtoDescricao: 'Ácido Sulfúrico 98% [MOCK]',
        grupo: 'Químicos',
        estoqueAtual: 80,
        pontoReposicao: 100,
        quantidadeSugerida: 500,
        diasSemEstoque: 3,
        consumoMedio: 25,
        prioridade: 'ALTA' as const,
        fornecedor: 'Química Ltda'
      }
    ]);
  }

  // MÉTODOS AUXILIARES
  selecionarGrupo(codigo: string): void {
    this.grupoSelecionadoSubject.next(codigo);
  }

  getGrupoSelecionado(): string {
    return this.grupoSelecionadoSubject.value;
  }
}