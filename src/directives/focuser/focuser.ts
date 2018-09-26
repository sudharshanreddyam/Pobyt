import {Directive, Renderer, ElementRef} from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';

/**
 * Generated class for the Focuser directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[focuser]' // Attribute selector
})
export class Focuser {
	
	constructor(private renderer:Renderer, private elementRef:ElementRef,public keyboard:Keyboard) {
		console.log('Hello Focuser Directive');
	}
	
	ngAfterViewInit() {
	    const element = this.elementRef.nativeElement.querySelector('input');
	    // we need to delay our call in order to work with ionic ...
	    setTimeout(() => {
	    	console.log('Hello Focuser Directive setTimeout');
	        this.renderer.invokeElementMethod(element, 'focus', []);
	        this.keyboard.show();
	    }, 1000);
	}
}
