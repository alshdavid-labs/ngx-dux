import { FormGroup } from "@angular/forms";
import { Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { AppInjector, updateForm } from '../ngx-dux.module';
import { Store } from '@ngrx/store';
import { get, isEqual } from 'lodash'

export function Form(value: string) {
    return function(target, key: string) {
        const sub = new Subscription()
        const targetNgOnDestroy = target.ngOnDestroy || function (){}
        const targetNgOnInit = target.ngOnInit || function (){}
        
        function ngOnInit() {
            const store = AppInjector.get(Store)
            const form: FormGroup = this[key]
            let lastFormChange: any
            let lastStoreChange: any

            // Initalize state
            store.dispatch(updateForm(value, { ...form.value }))

            // Watch for changes to form
            const formChanges = form.valueChanges
                .pipe(
                    tap(formValue => lastFormChange = formValue),
                    filter(_ => !isEqual(lastStoreChange, lastFormChange))
                )
                .subscribe(formValue => store.dispatch(updateForm(value, formValue)))
            
            // Watch for changes on state
            const storeChanges = store
                .select(s => get(s, ['dux-forms', 'forms', value], {}))
                .pipe(
                    tap(storeValue => lastStoreChange = storeValue),
                    filter(_ => !isEqual(lastStoreChange, lastFormChange))
                )
                .subscribe(storeValue => form.setValue({ ...form.value, ...storeValue }))

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
