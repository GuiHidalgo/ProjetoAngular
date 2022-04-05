import { BaseService } from './base.service';
import { Injectable, Injector } from '@angular/core';
import { Seguro } from '../models/Seguro';



@Injectable({
  providedIn: 'root'
})
export class SeguroService extends BaseService<Seguro> {

  constructor(
    protected override injector: Injector
  ) {
    super(injector, 'seguros', 'http://localhost:9400/api/seguros');
  }

}
