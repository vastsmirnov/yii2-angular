import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-datepicker',
    templateUrl: './datepicker.component.html',
    styleUrls: ['./datepicker.component.css']
})
export class DatepickerComponent implements OnInit {

    @Input() format = 'dd.mm.yyyy';         // Формат даты
    @Input() startAt: string;               // Дата начала
    @Input() endWith: string;               // Дата окончания
    @Input() defaultDate: string;           // Дата окончания
    @Input() inline = false;                // Всегда показывать пикер?
    @Input() hideInput = false;             // Скрывать input?
    @Input() inputClass: string;            // CSS класс для input

    @Output() onSelect = new EventEmitter();

    date = new Date();
    selectedDate: Date;

    public weekdays = [
        'ПН',
        'ВТ',
        'СР',
        'ЧТ',
        'ПТ',
        'СБ',
        'ВС',
    ];

    public months = [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь',
    ];

    constructor() {
    }

    ngOnInit() {

    }

    setMonth(month) {
        if (month < 0) {
            this.date.setMonth(11);
            this.setYear(this.year - 1);
        } else if (month > 11) {
            this.date.setMonth(0);
            this.setYear(this.year + 1);
        } else {
            this.date.setMonth(month);
        }
    }

    setYear(year) {
        this.date.setFullYear(year);
    }

    selectDate(day) {
        this.selectedDate = new Date(this.year, this.month, day);
    }

    get month() {
        return this.date.getMonth();
    }

    get year() {
        return this.date.getFullYear();
    }

    get daysInMonth() {
        return new Date(this.year, this.month+1, 0).getDate();
    }

    get days() {
        return new Array(this.daysInMonth);
    }

    get emptyDaysBefore() {
        return new Array(this.date.getDay() % 7 + 1)
    }

    setToday() {
        this.date = this.selectedDate = new Date();
    }

    isDaySelected(dayIndex) {
        if (!this.selectedDate) {
            return false;
        }

        const sMonth = this.selectedDate.getMonth();
        const sYear = this.selectedDate.getFullYear();
        const sDate = this.selectedDate.getDate();

        return (this.month === sMonth) && (this.year === sYear) && (dayIndex === sDate);

    }

    isToday(dayIndex) {
        const date = new Date();
        const sMonth = date.getMonth();
        const sYear = date.getFullYear();
        const sDate = date.getDate();
        return (this.month === sMonth) && (this.year === sYear) && (dayIndex === sDate);

    }

}
