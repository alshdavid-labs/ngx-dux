import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule, Store } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDuxModule } from 'ngx-dux'
import { cloneDeep } from 'lodash'

const store = {
  things: (state = { test: { hello: 'value' }}, action: { type: string, payload: any }) => {
    if (action.type !== 'update_things') {
      return state
    }
    return { 
      ...cloneDeep(state),
      ...action.payload 
    }
  }
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot(store),
    StoreDevtoolsModule.instrument(),
    NgxDuxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(
    store: Store<any>
  ) {
    window['store'] = store
  }
}
