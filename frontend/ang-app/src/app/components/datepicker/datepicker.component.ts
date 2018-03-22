import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
    selector: 'app-datepicker',
    templateUrl: './datepicker.component.html',
    styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements OnInit {

    @Input() format = 'dd.mm.yyyy';         // Формат даты
    @Input() startAt: string;               // Дата начала
    @Input() endWith: string;               // Дата окончания
    @Input() value: string;                 // Текущее значение

    @Output() onSelect = new EventEmitter();

    @ViewChild('monthSelect') private monthSelectDOM: ElementRef;
    @ViewChild('yearSelect') private yearSelectDOM: ElementRef;

    /**
     * Тип календаря:
     * dd - выбор с точностью до дня
     * mm - выбор с точностью до месяца
     * yyyy - выбор года
     * @type {string}
     */
    type: 'dd' | 'mm' | 'yyyy' = 'dd';

    /**
     * Сегодняшняя дата
     * @type {Date}
     */
    private today = new Date();
    private dateFrom;
    private dateTo;

    /**
     * Текущая дата, которую отображаем (месяц и год. Конкретная дата не важна, берем по умолчанию первое число).
     * @type {Date}
     */
    date = new Date(this.today.getFullYear(), this.today.getMonth(), 1);

    /**
     * Выбранная пользователем дата
     */
    selectedDate: Date;

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

    /**
     * Видны ли селекты выбора месяца и года
     * @type {boolean}
     */
    isMonthSelectVisible = false;
    isYearSelectVisible = false;

    /**
     * Текущий отображаемый год в селекте выбора года.
     * От него будут отображаться доступные годы до и после для выбора.
     * @type {number}
     */
    currentVisibleYear = this.date.getFullYear();

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        document.addEventListener('click', (event) => {
            /**
             * Скрываем селекты с выбором месяца и года, если кликнули вне них.
             */

            if (!this.isMonthSelectVisible && !this.isYearSelectVisible) {
                return;
            }

            if (this.isMonthSelectVisible && !this.monthSelectDOM.nativeElement.contains(event.target)) {
                this.hideMonthSelect();
            }

            if (this.isYearSelectVisible && !this.yearSelectDOM.nativeElement.contains(event.target)) {
                this.hideYearSelect();
            }
        });

        /**
         * Определяем тип пикера в зависимости от указанного формата даты
         */
        if (this.format.indexOf('dd') >= 0) {
            this.type = 'dd';
        } else if (this.format.indexOf('mm') >= 0) {
            this.type = 'mm';
        } else {
            this.type = 'yyyy';
        }

        const dateFrom = this.stringToDate(this.startAt);
        if (dateFrom) {
            this.dateFrom = {
                d: dateFrom.getDate(),
                m: dateFrom.getMonth(),
                y: dateFrom.getFullYear(),
                date: dateFrom
            };
            console.log('--- 1: ', this.dateFrom)

        }

        const dateTo = this.stringToDate(this.endWith);
        if (dateTo) {
            this.dateTo = {
                d: dateTo.getDate(),
                m: dateTo.getMonth(),
                y: dateTo.getFullYear(),
                date: dateTo
            };
            console.log('--- 2: ', this.dateTo)

        }

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

    /**
     * При скролле селекты выбора города смещаем доступные годы на 5 лет вперед или назад, в зависимости от
     * направления скролла.
     * @param event
     */
    onYearScroll(event) {
        event.preventDefault();
        this.currentVisibleYear += event.deltaY >= 0 ? 6: -6;
    }

    /**
     * При скролле месяцев будем менять текущий год
     * @param event
     */
    onMonthScroll(event) {
        event.preventDefault();
        this.setYear(this.year + +(event.deltaY >= 0 ? 1 : -1));
        this.currentVisibleYear = this.year;
    }

    /**
     * Изменяем текущий отображаемый год в селекте на значение value
     * @param {number} value
     */
    incrementVisibleYearByValue(value: number) {
        this.currentVisibleYear += value;
    }

    /**
     * Возвращает 10 городов для отображения в селекте.
     * 6 до и 3 после значения в this.currentVisibleYear
     * @returns {any[]}
     */
    get visibleYears() {
        const countToShow = this.type === 'mm' ? 7 : 9;
        return Array.from(Array(countToShow)).map((n, i) => this.currentVisibleYear - Math.floor(countToShow/2) + i);
    }

    /**
     * Утсановить месяц для отображения в календаре
     * @param month
     */
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

    /**
     * Установить год для отображения в календаре
     * @param year
     */
    setYear(year) {
        this.date.setFullYear(year);
    }

    /**
     * Выбрать дату в календаре
     * @param day
     */
    selectDate(day) {
        this.selectedDate = new Date(this.year, this.month, day);

        this.onSelect.emit({
            date: this.selectedDate,
            string: this.dateToFormat(this.selectedDate)
        });
    }

    /**
     * Изменить месяц на следующий/предыдущий при скролле на календаре
     * @param event
     */
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

    /**
     * Получить количество дней в текущем отображаемом месяце.
     * @returns {number}
     */
    get daysInMonth() {
        /**
         * Берем следующий месяц и устанавливаем его датой нулевой день, тем самым получаем число последнего дня в текущем
         * месяца, которое равно количеству дней.
         */
        return new Date(this.year, this.month+1, 0).getDate();
    }

    get days() {
        return new Array(this.daysInMonth);
    }

    get currentMonthDays() {
        const days = [];

        for (let i = 1; i<= this.daysInMonth; i++) {
            days.push({
                day: i,
                active: this.isDateAvailable(i),
                selected: this.isDaySelected(i),
                current: this.isToday(i)
            })
        }

        return days;
    }

    get daysBefore() {
        let emptyDaysLength = this.date.getDay() - 1;
        if (emptyDaysLength < 0) {
            emptyDaysLength = 6;
        }

        if (emptyDaysLength === 0) {
            emptyDaysLength = 7;
        }

        const prevMonthDaysCount = new Date(this.year, this.month, 0).getDate();

        const days = [];

        for (let i = prevMonthDaysCount - emptyDaysLength + 1; i <= prevMonthDaysCount; i++) {
            days.push(i);
        }

        return days;
    }

    get daysAfter() {
        const totalCurrentLength = this.daysBefore.length + this.days.length;
        const countAfter = 42 - totalCurrentLength;


        const days = [];

        for (let i = 1; i <= countAfter; i++) {
            days.push(i);
        }

        return days;
    }

    /**
     * Выбрать текущий день
     */
    setToday() {
        this.date = new Date(this.today);
        this.date.setDate(1);
        this.selectedDate = new Date(this.today);
        this.currentVisibleYear = this.today.getFullYear();
    }

    /**
     * Проверяет, выбран ли отображаемый день
     * @param dayIndex
     * @returns {boolean}
     */
    isDaySelected(dayIndex) {
        if (!this.selectedDate) {
            return false;
        }

        const sMonth = this.selectedDate.getMonth();
        const sYear = this.selectedDate.getFullYear();
        const sDate = this.selectedDate.getDate();

        return (this.month === sMonth) && (this.year === sYear) && (dayIndex === sDate);

    }

    /**
     * Является ли отображаемый день сегодняшним
     * @param dayIndex
     * @returns {boolean}
     */
    isToday(dayIndex) {
        const date = this.today;
        const sMonth = date.getMonth();
        const sYear = date.getFullYear();
        const sDate = date.getDate();
        return (this.month === sMonth) && (this.year === sYear) && (dayIndex === sDate);
    }

    isYearAvailable(year) {
        if (this.dateFrom && this.dateFrom.getFullYear() > year) {
            return false;
        }

        if (this.dateTo && this.dateTo.getFullYear() < year) {
            return false;
        }

        return true;
    }

    isMonthAvailable(month, year) {
        return true;
    }

    isDateAvailable(dayIndex) {
        if (this.dateFrom) {
            if (this.year < this.dateFrom.y) {
                return false;
            }

            if (this.year === this.dateFrom.y && this.month < this.dateFrom.m) {
                return false;
            }

            if (this.year === this.dateFrom.y && this.month === this.dateFrom.m && (dayIndex < this.dateFrom.d)) {
                return false;
            }
        }

        if (this.dateTo) {
            if (this.year > this.dateTo.y) {
                return false;
            }

            if (this.year === this.dateTo.y && this.month > this.dateTo.m) {
                return false;
            }

            if (this.year === this.dateTo.y && this.month === this.dateTo.m && (dayIndex > this.dateTo.d)) {
                return false;
            }
        }

        return true;
    }


    /**
     * Преобразует дату в строку заданного формата (this.format)
     * @param {Date} date
     * @returns {any}
     */
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

    /**
     * Преобразует строку в формате this.format в объект даты.
     * Делаем это вручную, а не с помощью Date.parse, чтобы добиться кроссбраузерности.
     * @param {string} string
     * @returns {Date}
     */
    stringToDate(string: string): Date {
        if (!string) {
            return null;
        }

        if (string === 'today') {
            return new Date(this.today);
        }

        const newDate = new Date(1970, 0, 1);

        try {
            ['dd', 'mm', 'yyyy'].forEach((part) => {
                const index = this.format.indexOf(part);
                const length = part.length;

                const value = index >= 0 ? +string.substr(index, length) : null;

                if (!value) return;

                if (part === 'dd') newDate.setDate(value);
                if (part === 'mm') newDate.setMonth(value - 1);
                if (part === 'yyyy') newDate.setFullYear(value);
            });
        } catch(e) {

        }

        return newDate;
    }
}
