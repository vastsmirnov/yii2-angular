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
    @Input() defaultDate: string;           // Дата окончания
    @Input() inline = false;                // Всегда показывать пикер?
    @Input() hideInput = false;             // Скрывать input?
    @Input() inputClass: string;            // CSS класс для input

    @Output() onSelect = new EventEmitter();

    @ViewChild('monthSelect') private monthSelectDOM: ElementRef;
    @ViewChild('yearSelect') private yearSelectDOM: ElementRef;

    /**
     * Сегодняшняя дата
     * @type {Date}
     */
    private today = new Date();

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

        console.log(this.stringToDate('22.01.2007'));
        console.log(this.stringToDate('28.02.2018'));
        console.log(this.stringToDate('55.22.2018'));
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
        this.currentVisibleYear += event.deltaY >= 0 ? 5: -5;
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
        return Array.from(Array(10)).map((n, i) => this.currentVisibleYear - 6 + i);
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

    /**
     * Количество дней предыдущего месяца на первой неделе текущего.
     * Если текущий месяц начался в четверг, то вернет массив из трух пустых дней до четверга.
     * @returns {any[]}
     */
    get emptyDaysBefore() {
        const emptyDaysLength = ( 7 - (this.date.getDate() - this.date.getDay()) % 7);
        return new Array(emptyDaysLength === 7 ? 0: emptyDaysLength )
    }

    /**
     * Выбрать текущий день
     */
    setToday() {
        this.date = new Date(this.today);
        this.selectedDate = new Date(this.today);
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

        const newDate = new Date();

        try {
            ['dd', 'mm', 'yyyy'].forEach((part) => {
                const index = this.format.indexOf(part);
                const length = part.length;

                const value = +string.substr(index, length);

                if (part === 'dd') newDate.setDate(value);
                if (part === 'mm') newDate.setMonth(value - 1);
                if (part === 'yyyy') newDate.setFullYear(value);
            });
        } catch(e) {

        }

        return newDate;
    }
}
