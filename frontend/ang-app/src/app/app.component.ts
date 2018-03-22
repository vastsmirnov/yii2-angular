import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'app';

    form: FormGroup;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            name: ['Steve'],
            age: [18],
            birthday: ['16.03.2018'],
            month: [5],
            year: [1999]
        })
    }
}
