import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

/**
 * Находит лучшую абсолютную позицию для элемента на экране.
 * Если элемент вылазиет за пределы экрана сверху или справа, то компесирует эти "Вылазки", чтобы элемент был на экране
 */


@Directive({
    selector: '[bestPosition]'
})
export class BestPositionDirective {
    private windowWidth = 0;

    constructor(private _elementRef : ElementRef) {
        this.windowWidth = window.innerWidth;
        setTimeout(() => {
            this.setCoords();
        }, 0);
    }

    setCoords() {
        try {
            const native = this._elementRef.nativeElement;
            const { width, height, top, left, right, bottom} = native.getBoundingClientRect();

            let mt = 0, mr = 0;

            if (top <= 0) {
                mt = -top + 30;
            }

            if (right >= this.windowWidth) {
                mr = right - this.windowWidth + 30;
            }

            native.style.marginTop = mt + 'px';
            native.style.marginLeft = -mr + 'px';
        } catch (e) {

        }

    }
}