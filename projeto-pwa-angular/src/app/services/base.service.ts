import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import Dexie from 'dexie';
import { Observable } from 'rxjs/internal/Observable';
import { OnlineOfflineService } from './online-offline.service';


export abstract class BaseService<T extends {id: string}> {


  private db!: Dexie;
  private table!: Dexie.Table<T, any>;

  protected http!: HttpClient;
  protected OnlineOfflineService!: OnlineOfflineService;

  constructor(
    protected injector: Injector,
    protected nomeTabela: string,
    protected urlApi: string
  ){
    this.http = this.injector.get(HttpClient);
    this.OnlineOfflineService = this.injector.get(OnlineOfflineService);


    this.ouvirStatusConexao();
    this.iniciarIndexedDb();

  }
  private iniciarIndexedDb() {
    this.db = new Dexie('db-seguros');
    this.db.version(2).stores({
     [this.nomeTabela]: 'id'
    });
    this.table = this.db.table(this.nomeTabela);
  }

  private async salvarIndexedDb(tabela: T){
    try {
      await this.table.add(tabela);
      const todostabelas: T[] = await this.table.toArray();
      console.log('tabela foi salvo no IndexedDb', todostabelas);
    } catch (error) {
      console.log('Erro ao incluir tabela no IdexedDb', error);
    }
  }

  private async enviarIndexedDBParaApi() {
    const todostabelas: T[] = await this.table.toArray();

    for (const tabela of todostabelas) {
      this.salvarAPI(tabela);
      await this.table.delete(tabela.id);
      console.log(`tabela com o id ${tabela.id} foi excluido com sucesso`);
    }
  }

  private salvarAPI(tabela: T) {
    this.http.post(this.urlApi, tabela)
      .subscribe(
        () => alert("tabela foi cadastrado com sucesso"),
        (err) => console.log("Erro ao cadastrar tabela")
    );
  }

  public salvar(tabela: T){
    if (this.OnlineOfflineService.isOnline) {
      this.salvarAPI(tabela);
    } else {
      this.salvarIndexedDb(tabela);
    }
  }

  listar(): Observable<T[]>{
    return this.http.get<T[]>(this.urlApi);
  }

  private ouvirStatusConexao() {
    this.OnlineOfflineService.statusConexao
      .subscribe(online => {
        if (online) {
          this.enviarIndexedDBParaApi();
        } else {
          console.log('estou offline');
        }
      })
  }
}
