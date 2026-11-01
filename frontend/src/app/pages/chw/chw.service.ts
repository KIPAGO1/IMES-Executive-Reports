import {Injectable} from '@angular/core';
import {ChwData} from './chw.model';
@Injectable({providedIn:'root'}) export class ChwService {private cache?:Promise<ChwData>;load():Promise<ChwData>{return this.cache??=fetch('assets/data/chw-demo.json').then(r=>{if(!r.ok)throw new Error('CHW demo JSON HTTP '+r.status);return r.json() as Promise<ChwData>}).catch(e=>{this.cache=undefined;throw e})}}
