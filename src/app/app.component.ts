import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Select, Form, State } from 'ngx-dux'

@Component({
  selector: 'app-root',
  template: `
    <pre [innerHtml]="JSON.stringify(state, null, 4)"></pre> 
    <form (ngSubmit)="submit($event)" [formGroup]="helloWorld">
      <input 
        formControlName="email" 
        type="text" 
        placeholder="Email" />
      
      {{ helloWorld.controls.email.valid }}

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
  
  @State()
  public state = {}

  @Select('dux-forms', 'forms')
  public forms = {}

  @Form({
    id: 'mySpecialForm',
    ignore: ['password']
  })
  public helloWorld = new FormGroup({
    email: new FormControl('', [ Validators.email ]),
    password: new FormControl()
  })

  ngOnInit() {
    console.log(this.helloWorld.controls.email)
  }

  submit(event) {
    console.log(this.helloWorld.getRawValue())
    this.helloWorld.controls.email
  }
}
