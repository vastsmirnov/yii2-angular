import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DatepickerService} from "./datepicker.service";

@Component({
    selector: 'app-datepicker',
    templateUrl: './datepicker.component.html',
    styleUrls: ['./datepicker.component.scss'],
    providers: [DatepickerService]
})
export class DatepickerComponent implements OnInit {

    @Input() format = 'dd.mm.yyyy';         // Формат даты
    @Input() startAt: string;               // Дата начала
    @Input() endWith: string;               // Дата окончания
    @Input() value: string;                 // Текущее значение

    /**
     * Событие выбора даты в пикере.
     * @type {EventEmitter<any>}
     */
    @Output() onSelect = new EventEmitter();

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

    /**
     * Текущая дата, которую отображаем (месяц и год. Конкретная дата не важна, берем по умолчанию первое число).
     * @type {Date}
     */
    date = new Date(this.today.getFullYear(), this.today.getMonth(), 1);

    /**
     * Выбранная пользователем дата
     */
    selectedDate: Date;

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

    /**
     * Коллекции для отображения
     * Жни текущего месяца
     * */
    currentDaysList: any[] = [];
    /**
     * Дни предыдущего месяца
     * @type {Array}
     */
    prevDaysList: any[] = [];
    /**
     * Дни следующего месяца
     * @type {Array}
     */
    nextDaysList: any[] = [];

    /**
     * Список текущих месяцев
     * @type {Array}
     */
    currentMonthsList: any[] = [];

    /**
     * Список отображаемых лет
     * @type {Array}
     */
    currentYearsList: any[] = [];

    constructor(
        private dateService: DatepickerService
    ) {
    }

    ngOnInit() {
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

        if (this.startAt) {
            this.dateService.setDateFrom(this.startAt, this.format);
        }


        if (this.endWith) {
            this.dateService.setDateTo(this.endWith, this.format);
        }

        /**
         * В зависимости от типа пикера (день, месяц, год) юудем отображать разное количество лет
         */
        this.dateService.setYearsToShow(this.type === 'mm' ? 7 : 9);

        this.updateDateFromValue(this.value);

        this.updateDate();
    }

    private updateDate() {
        this.updateMonths();
        this.updateYears();
        this.updateDays();
    }

    private updateDays(): void {
        this.currentDaysList = this.dateService.getCurrentDays(this.date);
        this.prevDaysList = this.dateService.getDaysBeforeCurrent(this.date);
        this.nextDaysList = this.dateService.getDaysAfterCurrent(this.currentDaysList.length + this.prevDaysList.length);
        // console.log('---: updateDays()', this.currentDaysList, this.prevDaysList, this.nextDaysList);
    }

    private updateMonths(): void {
        this.currentMonthsList = this.dateService.getCurrentMonths(this.date);
        // console.log('---: updateMonths()', this.currentMonthsList)
    }

    private updateYears(): void {
        this.currentYearsList = this.dateService.getCurrentYears(this.currentVisibleYear);
        // console.log('---: updateYears()', this.currentYearsList);
    }

    showMonthSelect() {
        this.isMonthSelectVisible = true;
    }

    hideMonthSelect() {
        this.isMonthSelectVisible = false;
    }

    showYearSelect() {
        this.currentVisibleYear = this.year;
        this.updateYears();
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
        this.updateYears();
    }

    /**
     * При скролле месяцев будем менять текущий год
     * @param event
     */
    onMonthScroll(event) {
        event.preventDefault();
        const newYear = this.year + +(event.deltaY >= 0 ? 1 : -1);
        this.currentVisibleYear = newYear;
        this.setYear(newYear);
    }

    /**
     * Изменяем текущий отображаемый год в селекте на значение value
     * @param {number} value
     */
    incrementVisibleYearByValue(value: number) {
        this.currentVisibleYear += value;
        this.updateYears();
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
            this.updateDate();
        }
    }

    /**
     * Установить год для отображения в календаре
     * @param year
     */
    setYear(year) {
        this.date.setFullYear(year);
        this.updateDate();
    }

    /**
     * Выбрать дату в календаре
     * @param day
     */
    selectDate(day) {
        this.selectedDate = new Date(this.year, this.month, day);
        this.dateService.setSelectedDate(this.selectedDate);

        this.updateDate();

        this.onSelect.emit({
            date: this.selectedDate,
            string: this.dateToFormat(this.selectedDate)
        });
    }

    selectMonth(monthIndex: number) {
        this.setMonth(monthIndex);
        this.selectDate(1);
    }

    selectYear(year: number) {
        this.setYear(year);
        this.setMonth(0);
        this.selectDate(1)
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

    updateDateFromValue(value: string) {
        const date = this.stringToDate(value);
        if (!date) return;
        this.selectedDate = new Date(date);
        this.date = new Date(date);
        this.date.setDate(1); // Нормализация даты, с которой работаем, чтобы корректно высчитывать новые даты на основании этой.
        this.currentVisibleYear = date.getFullYear();
        this.dateService.setSelectedDate(this.selectedDate);
    }

    get month() {
        return this.date.getMonth();
    }

    get year() {
        return this.date.getFullYear();
    }

    /**
     * Выбрать текущий день
     */
    setToday() {
        this.date = new Date(this.today);
        this.date.setDate(1);
        this.selectDate(this.today.getDate());
        this.currentVisibleYear = this.today.getFullYear();
    }

    /**
     * Преобразует дату в строку заданного формата (this.format)
     * @param {Date} date
     * @returns {string}
     */
    dateToFormat(date: Date): string {
        return this.dateService.dateToFormat(date, this.format);
    }

    /**
     * Преобразует строку в формате this.format в объект даты.
     * Делаем это вручную, а не с помощью Date.parse, чтобы добиться кроссбраузерности.
     * @param {string} string
     * @returns {Date}
     */
    stringToDate(string: string): Date {
        return this.dateService.stringToDate(string, this.format);
    }
}
