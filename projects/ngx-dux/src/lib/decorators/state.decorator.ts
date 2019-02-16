import { Store } from '@ngrx/store'
import { Subscription } from 'rxjs';
import { AppInjector } from '../ngx-dux.module';

export function State() {
    return function(target, key: string) {
        let subscription: Subscription
        const targetNgOnDestroy = target.ngOnDestroy || function (){}
        const targetNgOnInit = target.ngOnInit || function (){}
        
        function ngOnInit(this): void {
            const store = AppInjector.get(Store)
            subscription = store.subscribe(v => this[key] = v)
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