import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { TranslatePipe } from './core/translate.pipe';
import { TranslationService } from './core/translation.service';
import { AppState } from './core/app-state.service';
@Component({selector:'app-root',standalone:true,imports:[CommonModule,RouterLink,RouterOutlet,TranslatePipe],templateUrl:'./app.component.html',styleUrl:'./app.component.css'})
export class AppComponent {
 constructor(public state:AppState,public i18n:TranslationService,public router:Router,private location:Location){}
 back(){this.location.back()} logout(){this.state.logout();this.router.navigateByUrl('/login')}
 get isLogin(){return this.router.url.startsWith('/login')}
}
