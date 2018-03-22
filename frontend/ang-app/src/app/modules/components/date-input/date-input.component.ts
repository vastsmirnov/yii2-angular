import {Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";

@Component({
    selector: 'app-date-input',
    templateUrl: './date-input.component.html',
    styleUrls: ['./date-input.component.scss']
})
export class DateInputComponent implements OnInit {
    @Input() fbControl: FormControl;
    @Input() fbGroup: FormGroup;
    @Input() pickByFocus: false;
    @Input() format: string = 'dd.mm.yyyy';
    @Input() from: string;
    @Input() to: string;

    @ViewChild('pickerContainer') private pickerContainer: ElementRef;

    isPickerHidden = true;

    constructor() {
    }

    ngOnInit() {
    }

    updateControlValue(value: string) {
        this.fbControl.patchValue(value);
    }

    showPicker() {
        this.isPickerHidden = false;
    }

    hidePicker() {
        this.isPickerHidden = true;
    }

    onDatePick(data) {
        this.updateControlValue(data.string);
        this.hidePicker();
    }

    togglePicker() {
        this.isPickerHidden = !this.isPickerHidden;
    }

    /**
     * TODO Жуткий костыль!
     *
     * Из-за того, что при клике внутри пикера на динамические поля (например год), они перерисовываются, то
     * event.target у события клика является элементом, которого внутри текущего DOM уже нет, поэтому
     * поймать клик вне текущего DOM, когда кликаем по динамическим элементам - нельзя.
     * Это проявляется прежде всего в списке годов и месяцев в датапикеры и тут костыльное решение, чтобы не закрывать пикер когла
     * это не нужно
     * @param event
     */
    checkTarget(event) {
        const parent = event.target.parentElement;
        if (parent && !this.pickerContainer.nativeElement.contains(parent)) {
            this.hidePicker();
        }
    }
}
