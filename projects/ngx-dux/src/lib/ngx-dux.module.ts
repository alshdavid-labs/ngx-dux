import { NgModule, Injector } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { cloneDeep } from 'lodash'

export let AppInjector: Injector

export function setAppInjector(injector: Injector) {
  if (AppInjector) {
    return
  }
  AppInjector = injector
}

export const updateFormAction = '[Dux-Forms] Update Form'


export interface IAction {
  type: string
  payload: {
    id: string,
    data: any
  }
}

export const updateForm = (id: string, data: any) => {
  return {
    type: updateFormAction,
    payload: { id, data }
  }
}

export function reducer(
  state = {}, 
  action: IAction
) {
  if (action.type !== updateFormAction) {
    return state
  }
  const newState = cloneDeep(state)
  const newForm = action.payload
  newState[newForm.id] = newForm.data
  return newState
}

@NgModule({
  declarations: [],
  imports: [
    StoreModule.forFeature('dux-forms', reducer),
  ],
  exports: []
})
export class NgxDuxModule {
  constructor(
    injector: Injector
  ) {
      setAppInjector(injector)
  }
}
