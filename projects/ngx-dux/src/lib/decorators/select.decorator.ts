import { Store } from '@ngrx/store'
import { Subscription } from 'rxjs';
import { AppInjector } from '../ngx-dux.module';

export function Select(...value: any) {
    return function(target, key: string) {
        let subscription: Subscription
        const targetNgOnDestroy = target.ngOnDestroy || function (){}
        const targetNgOnInit = target.ngOnInit || function (){}
        
        function ngOnInit(this): void {
            const store = AppInjector.get(Store)
            if (!value || value.length === 0) {
                subscription = store.subscribe(v => this[key] = v)
            } else if (value.length === 1) {
                subscription = store.select(value[0]).subscribe(v => this[key] = v)
            } else {
                subscription = store.select(...value).subscribe(v => this[key] = v)
            }
            targetNgOnInit.apply(this)
        }

        function ngOnDestroy(): void {
            subscription.unsubscribe()
            targetNgOnDestroy.apply(this)
        }

        target.ngOnInit = ngOnInit
        target.ngOnDestroy = ngOnDestroy
    }
}