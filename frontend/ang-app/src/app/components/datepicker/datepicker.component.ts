import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-datepicker',
    templateUrl: './datepicker.component.html',
    styleUrls: ['./datepicker.component.scss']
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

    isMonthSelectVisible = false;
    isYearSelectVisible = false;

    currentVisibleYear = this.date.getFullYear();

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        document.addEventListener('click', (event) => {
            if (!this.isMonthSelectVisible && !this.isYearSelectVisible) {
                return;
            }
            if (!this.elementRef.nativeElement.contains(event.target)) {
                if (this.isYearSelectVisible) {
                    this.hideYearSelect();
                }

                if (this.isMonthSelectVisible) {
                    this.hideMonthSelect();
                }
            }
        })
    }

    showMonthSelect() {
        this.isMonthSelectVisible = true;
    }

    hideMonthSelect() {
        this.isMonthSelectVisible = false;
    }

    showYearSelect() {
        this.currentVisibleYear = this.year;
        this.isYearSelectVisible = true;
    }

    hideYearSelect() {
        this.isYearSelectVisible = false;
    }

    onYearScroll(event) {
        event.preventDefault();
        this.currentVisibleYear += event.deltaY >= 0 ? 5: -5;
    }

    get visibleYears() {

        return Array.from(Array(10)).map((n, i) => this.currentVisibleYear - 6 + i);
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

        this.onSelect.emit({
            date: this.selectedDate,
            string: this.dateToFormat(this.selectedDate)
        });
    }

    onScroll(event) {
        event.preventDefault();

        if (event.deltaY >= 0) {
            this.setMonth(this.month + 1);
        } else {
            this.setMonth(this.month - 1);
        }
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
        const emptyDaysLength = this.date.getDay() % 7 + 1;
        return new Array(emptyDaysLength === 7 ? 0: emptyDaysLength )
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


    dateToFormat(date: Date) {
        if (!date) {
            return '';
        }

        let day = '' + date.getDate();
        if (day.length === 1) {
            day = '0' + day;
        }

        let month = '' + (date.getMonth() + 1);
        if (month.length === 1) {
            month = '0' + month;
        }

        const year = '' + date.getFullYear();

        return '' + this.format.replace('dd', day).replace('mm', month).replace('yyyy', year);
    }
}
