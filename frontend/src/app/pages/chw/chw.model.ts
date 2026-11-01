export interface ChwRecord {year:number;region:string;enrolled:number;trained:number;hired:number;quitted:number;disqualified:number;active:number;targetCHW:number;population:number;tablets:number;visits:number;householdsReached:number;totalPaymentTZS:number;latitude:number|null;longitude:number|null;}
export interface ChwMarker {region:string;x:number;y:number;}
export interface ChwData {records:ChwRecord[];mapMarkers:ChwMarker[];metadata:{demo:boolean;note:string}}
