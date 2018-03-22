
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {DatepickerComponent} from "./components/datepicker/datepicker.component";
import {DateInputComponent} from "./components/date-input/date-input.component";
import {ClickOutsideDirective} from "./directives/click-outside.directive";
import {BestPositionDirective} from "./directives/best-position.directive";

@NgModule({
    declarations: [
        DatepickerComponent,
        DateInputComponent,
        ClickOutsideDirective,
        BestPositionDirective
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