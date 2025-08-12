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

@Injectable({
  providedIn: 'root'
})
export class EstoqueService {
  private apiUrl = environment.apiUrl;
  private endpoints = environment.endpoints;
  private grupoSelecionadoSubject = new BehaviorSubject<string>('');
  grupoSelecionado$ = this.grupoSelecionadoSubject.asObservable();

  constructor(private http: HttpClient) {
    console.log('🔗 EstoqueService inicializado');
    console.log('📍 API URL:', this.apiUrl);
    console.log('🎯 Endpoints:', this.endpoints);
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

  // BUSCAR GRUPOS (SEU ENDPOINT ESPECÍFICO)
  getGrupos(tipo: 'MATERIA_PRIMA' | 'MATERIAL_CONSUMO'): Observable<Grupo[]> {
    const url = `${this.apiUrl}/${this.endpoints.grupos}`;
    console.log(`🔍 Buscando grupos: ${tipo}`);
    console.log(`📡 URL completa: ${url}`);
    
    // Configurar parâmetros se necessário
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
        
        // Adaptar diferentes formatos de resposta
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
        
        // Mapear para o formato esperado pelo frontend
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

  // BUSCAR PRODUTOS (PREPARADO PARA PRÓXIMO ENDPOINT)
  getProdutos(tipo: 'MATERIA_PRIMA' | 'MATERIAL_CONSUMO', grupo?: string): Observable<Produto[]> {
    console.log(`🔍 Produtos solicitados: ${tipo}, grupo: ${grupo}`);
    console.log('ℹ️ Endpoint de produtos ainda não implementado, usando mock');
    
    // Por enquanto usa mock até implementarmos o endpoint de produtos
    return this.getProdutosMock(tipo, grupo);
  }

  // PONTO DE PEDIDO (PREPARADO)
  getPontosPedido(): Observable<PontoPedido[]> {
    console.log('🔍 Pontos de pedido solicitados');
    console.log('ℹ️ Endpoint de pontos de pedido ainda não implementado, usando mock');
    
    // Por enquanto usa mock
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
    
    // Analisar tipo de erro
    if (error.status === 0) {
      console.error('🚫 Erro de rede - verifique se o servidor está online');
    } else if (error.status === 401) {
      console.error('🔐 Erro de autenticação - verifique usuário e senha');
    } else if (error.status === 404) {
      console.error('🔍 Endpoint não encontrado - verifique a URL');
    } else if (error.status >= 500) {
      console.error('⚠️ Erro interno do servidor');
    }
    
    // Decidir se usa fallback
    if (this.deveUsarFallback(error)) {
      console.log('🔄 Usando dados mock como fallback');
      return this.getFallbackData(endpoint, tipo);
    } else {
      const errorMessage = `Erro na API: ${error.status} - ${error.message}`;
      return throwError(() => new Error(errorMessage));
    }
  }

  private deveUsarFallback(error: HttpErrorResponse): boolean {
    // Usar fallback para problemas de conectividade
    return error.status === 0 || 
           error.status === 404 || 
           error.status === 500 || 
           error.status === 503;
  }

  private getFallbackData(endpoint: string, tipo?: string): Observable<any> {
    switch (endpoint) {
      case 'grupos':
        return this.getGruposMock(tipo as any);
      case 'produtos':
        return this.getProdutosMock(tipo as any);
      case 'pontos-pedido':
        return this.getPontosPedidoMock();
      default:
        return of([]);
    }
  }

  // DADOS MOCK COMO FALLBACK
  private getGruposMock(tipo: 'MATERIA_PRIMA' | 'MATERIAL_CONSUMO'): Observable<Grupo[]> {
    console.log('🎭 Usando dados mock para grupos:', tipo);
    
    const mockGrupos: Grupo[] = [
      { codigo: '001', descricao: 'Químicos [MOCK]', tipo: 'MATERIA_PRIMA', ativo: true, totalProdutos: 25 },
      { codigo: '002', descricao: 'Metais [MOCK]', tipo: 'MATERIA_PRIMA', ativo: true, totalProdutos: 18 },
      { codigo: '003', descricao: 'Plásticos [MOCK]', tipo: 'MATERIA_PRIMA', ativo: true, totalProdutos: 12 },
      { codigo: '101', descricao: 'Escritório [MOCK]', tipo: 'MATERIAL_CONSUMO', ativo: true, totalProdutos: 45 },
      { codigo: '102', descricao: 'Limpeza [MOCK]', tipo: 'MATERIAL_CONSUMO', ativo: true, totalProdutos: 32 }
    ].filter(g => g.tipo === tipo);

    return of(mockGrupos);
  }

  private getProdutosMock(tipo: 'MATERIA_PRIMA' | 'MATERIAL_CONSUMO', grupo?: string): Observable<Produto[]> {
    const mockProdutos: Produto[] = [
      {
        codigo: 'MP001',
        descricao: 'Ácido Sulfúrico 98% [MOCK]',
        grupo: '001',
        grupoDescricao: 'Químicos',
        unidade: 'KG',
        estoqueAtual: 500,
        estoqueMinimo: 100,
        estoqueMaximo: 1000,
        custoUnitario: 15.50,
        fornecedor: 'Química Ltda',
        localizacao: 'A001-001',
        status: 'ATIVO' as const,
        tipo: 'MATERIA_PRIMA' as const
      },
      {
        codigo: 'MC001',
        descricao: 'Papel A4 [MOCK]',
        grupo: '101',
        grupoDescricao: 'Escritório',
        unidade: 'PC',
        estoqueAtual: 25,
        estoqueMinimo: 10,
        estoqueMaximo: 100,
        custoUnitario: 12.00,
        fornecedor: 'Papelaria Ltda',
        localizacao: 'C001-001',
        status: 'ATIVO' as const,
        tipo: 'MATERIAL_CONSUMO' as const
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