import { Validator, NG_VALIDATORS, AbstractControl, ValidationErrors } from '@angular/forms';
import { Directive, Input } from '@angular/core'
import { Subscription } from 'rxjs';

@Directive({
    selector: '[compare]',
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: compareEqualDirective,
        multi: true
    }]
})


export class compareEqualDirective implements Validator {

    @Input('compare') controlNameToCompare: string


    validate(c: AbstractControl): ValidationErrors | null {

        const controlToCompare = c.root.get(this.controlNameToCompare)
        if (controlToCompare) {
            const subscription: Subscription = controlToCompare.valueChanges.subscribe(() => {
                c.updateValueAndValidity()
                subscription.unsubscribe()
            })
        }
        return controlToCompare && controlToCompare.value !== c.value ? { 'notEqual': true } : null
    }
}