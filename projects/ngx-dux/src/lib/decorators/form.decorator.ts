import { FormGroup } from "@angular/forms";
import { Subscription, Observable } from 'rxjs';
import { filter, tap, map } from 'rxjs/operators';
import { AppInjector, updateForm } from '../ngx-dux.module';
import { Store } from '@ngrx/store';
import { get, isEqual } from 'lodash'

export interface IFormConfig {
    id?: string,
    ignore?: string[]
}

export function Form(config: IFormConfig) {
    return function(target, key: string) {
        const id = config.id || `${window.location.pathname}[${key}]`
        const sub = new Subscription()
        const targetNgOnDestroy = target.ngOnDestroy || function (){}
        const targetNgOnInit = target.ngOnInit || function (){}
        const ignoredValues = {}
        
        function ngOnInit() {
            const store = AppInjector.get(Store)
            const form: FormGroup = this[key]
            let lastFormChange: any
            let lastStoreChange: any

            // Initalize state
            store.dispatch(updateForm(id, { ...form.value }))

            // Watch for changes to form
            const formChanges = form.valueChanges
                .pipe(
                    tap(formValue => lastFormChange = formValue),
                    filter(_ => !isEqual(lastStoreChange, lastFormChange)),
                    filter(formValue => {
                        for (const ignore of config.ignore) {
                            if (
                                formValue[ignore] !== undefined &&
                                formValue[ignore] !== null &&
                                formValue[ignore] !== ignoredValues[ignore]
                            ) {
                                return false
                            }
                            return true
                        }
                    }),
                    map(formValue => {
                        for (const ignore of config.ignore) {
                            ignoredValues[ignore] = formValue[ignore]
                            formValue[ignore] = '[redacted]'
                        }
                        return formValue
                    })
                )
                .subscribe(formValue => store.dispatch(updateForm(id, formValue)))
            
            // Watch for changes on state
            const storeChanges = store
                .select(s => get(s, ['dux-forms', id], {}))
                .pipe(
                    tap(storeValue => lastStoreChange = storeValue),
                    filter(_ => !isEqual(lastStoreChange, lastFormChange)),
                    map(storeValue => {
                        for (const ignore of config.ignore) {
                            if (
                                storeValue[ignore] !== null &&
                                storeValue[ignore] !== undefined &&
                                storeValue[ignore] !== '[redacted]'
                            ) {
                                throw new Error(`Form item "${ignore}" on "${id}" was set and shouldn't be`)
                            }
                            storeValue[ignore] = ignoredValues[ignore] || null
                        }
                        return storeValue
                    }),
                    map(storeValue => ({ ...form.value, ...storeValue })),
                )
                .subscribe(storeValue => {
                    console.log(storeValue)
                    form.setValue(storeValue)
                })

            sub.add(formChanges)
            sub.add(storeChanges)
            targetNgOnInit.apply(this)
        }
    
        function ngOnDestroy() {
            sub.unsubscribe()
            targetNgOnDestroy.apply(this)
        }
    
        target.ngOnInit = ngOnInit
        target.ngOnDestroy = ngOnDestroy
    }
}
