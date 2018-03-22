
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {DatepickerComponent} from "./components/datepicker/datepicker.component";

@NgModule({
    declarations: [
        DatepickerComponent
    ],
    exports: [
        DatepickerComponent
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        CommonModule
    ]
})
export class DateInputModule {}