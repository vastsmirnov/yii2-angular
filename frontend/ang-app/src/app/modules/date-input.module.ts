
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {DatepickerComponent} from "./components/datepicker/datepicker.component";
import {DateInputComponent} from "./components/date-input/date-input.component";

@NgModule({
    declarations: [
        DatepickerComponent,
        DateInputComponent
    ],
    exports: [
        DatepickerComponent,
        DateInputComponent
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        CommonModule
    ]
})
export class DateInputModule {}