import { MarcaCarro } from './../models/MarcaCarro';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';



interface CarResponse {
  Makes: Array<any>;
}

@Injectable({
  providedIn: 'root'
})
export class MarcaCarroService {

  private API_CARROS = 'https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getMakes';
  constructor(
    private http: HttpClient
  ) { }

  private mapMarcas(marcas): MarcaCarro[] {
    return marcas.map(marca => ({
      codigo: marca.make_id,
      nome: marca.make_display
    }));
  }


  public getMarcas(): Observable<MarcaCarro[]> {
    return this.http.jsonp<CarResponse>(this.API_CARROS, 'callback') // return this.http.jsonp(this.API_CARROS, 'callback') era desse jeito
      .pipe(
        map((res: CarResponse) => this.mapMarcas(res.Makes))
      );
  }
}
