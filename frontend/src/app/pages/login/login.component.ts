import {TranslatePipe} from '../../core/translate.pipe';
import {TranslationService} from '../../core/translation.service';
import {Component} from '@angular/core';import {FormsModule} from '@angular/forms';import {Router} from '@angular/router';import {AppState} from '../../core/app-state.service';
@Component({standalone:true,imports:[FormsModule,TranslatePipe],templateUrl:'./login.component.html',styleUrl:'./login.component.css'})export class LoginComponent{username='';password='';error='';constructor(private state:AppState,private router:Router,public i18n:TranslationService){}submit(){if(this.state.login(this.username,this.password)){this.router.navigateByUrl('/dashboard')}else this.error=this.i18n.t('loginError')}}
