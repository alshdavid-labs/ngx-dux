import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Select, Form } from 'ngx-dux'

@Component({
  selector: 'app-root',
  template: `
    <pre [innerHtml]="JSON.stringify(state, null, 4)"></pre> 
    <form (ngSubmit)="submit()" [formGroup]="helloWorld">
      <input 
        formControlName="email" 
        type="text" 
        placeholder="Email" />

      <input 
        formControlName="password" 
        type="password"
        placeholder="Password" />
        
      <button type="submit">ok</button>  
    </form>
  `
})
export class AppComponent {
  public JSON = JSON

  @Select('dux-forms', 'forms')
  public state

  @Form('Main Form')
  public helloWorld = new FormGroup({
    email: new FormControl(),
    password: new FormControl()
  })
}
