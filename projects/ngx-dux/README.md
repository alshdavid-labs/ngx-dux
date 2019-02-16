# NGX-Dux

## Decorators for @ngrx

Installation

```
npm install --save ngx-dux
```

In your NgModule

```typescript
import { NgxDuxModule } from 'ngx-dux'

@NgModule({
  imports: [
    NgxDuxModule,
    ...
  ],
  ...
}
```

Usage

```typescript
import { Select, Form, State } from 'ngx-dux'

...

@Component({
  selector: 'app-root',
  template: `
    <pre 
      [innerHtml]="JSON.stringify(state, null, 4)">
    </pre> 
    <form 
      (ngSubmit)="submit($event)" 
      [formGroup]="helloWorld">

      <input 
        formControlName="email" 
        type="text" 
        placeholder="Email" />

      <div>
        {{ helloWorld.controls.email.valid }}
      </div>

      <input 
        formControlName="password" 
        type="password"
        placeholder="Password" />
        
      <button 
        type="submit">
        Submit
      </button>  
    </form>
  `
})
export class AppComponent { 
  public JSON = JSON
  
  // Bind to all of your state
  @State()
  public state = {}

  // Select part of your state
  @Select(s => s.myKey.property)
  public partOfState

  // Use a setter to trigger actions
  // on state update
  @Select(s => s.myKey.property)
  public set onPartOfStateUpdate(update) {
      console.log(update)
  }

  // Decorate a formGroup and it will store
  // each keypress in your state, with 
  // replay support
  @Form({
    id: 'mySpecialForm',
    ignore: ['password']
  })
  public helloWorld = new FormGroup({
    email: new FormControl('', [ Validators.email ]),
    password: new FormControl()
  })

  submit(event) {
    console.log(this.helloWorld.getRawValue())
  }

  // This method must be present, even if empty.
  ngOnDestroy() {
    // https://github.com/angular/angular/issues/16023
  }
}
```

```typescript
@Form({
    id?: string  // Identifies your form, must be globally unquie
    ignore?: string[]  // Redacts keys on your form from the store 
})
```

