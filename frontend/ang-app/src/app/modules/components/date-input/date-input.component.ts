import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
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


    @ViewChild('pickerContainer') private pickerContainer: ElementRef;

    isPickerHidden = true;

    constructor() {
        document.addEventListener('click', (event) => {
            if (!this.isPickerHidden && !this.pickerContainer.nativeElement.contains(event.target)) {
                this.hidePicker();
                console.log('---: ', 'hide by click')
            }
        });
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
}
