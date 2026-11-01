import { Injectable, signal } from '@angular/core';
@Injectable({providedIn:'root'}) export class AppState {
 authenticated=signal(sessionStorage.getItem('imes-demo')==='yes');
 language=signal<'sw'|'en'>('sw'); dark=signal(false); skin=signal<'blue'|'orange'|'purple'>('blue');
 login(username:string,password:string){if(!username.trim()||!password.trim())return false;sessionStorage.setItem('imes-demo','yes');this.authenticated.set(true);return true;}
 logout(){sessionStorage.removeItem('imes-demo');this.authenticated.set(false);}
}
