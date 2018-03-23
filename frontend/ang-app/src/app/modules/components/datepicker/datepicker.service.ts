import {Injectable} from "@angular/core";

@Injectable()
export class DatepickerService {

    private weeksToShow = 6;
    private dateFrom: Date;
    private dateTo: Date;
    private today: Date = new Date();
    private selectedDate: Date;

    constructor() {

    }

    setSelectedDate(date: Date): void {
        this.selectedDate = date;
    }

    getCurrentDays(date: Date) {
        const daysCount = this.getDaysInMonth(date);

        const days = [];

        for (let i = 1; i<= daysCount; i++) {
            days.push({
                day: i,
                active: this.isDayAvailable(date, i),
                current: this.isToday(date, i),
                selected: this.isDateSelected(date, i)
            });
        }

        return days;
    }

    /**
     * Получить список дней, заполняющих неделю перед текущим отображаемым месяцем
     * @param {Date} date
     * @returns {Array}
     */
    getDaysBeforeCurrent(date: Date): any[] {
        const nDate = this.normalizeDate(date);

        /**
         * У дня недели есть индекс: ВС = 0, ПН - 1, ВТ - 2 и т.п.
         * Количество дней в неделе до 1-го числа текущего месяца равно = номер дня 1-го числа минус 1,
         * кроме ПН и ВС.
         * Если 1-е число это ПН (index === 1, а index - 1 === 0), то будем показывать всю неделю как предыдущий месяц,
         * Если 1-е число это ВС, то покажем 6 дней до ВС.
         * @type {number}
         */
        let emptyDaysLength = nDate.getDay() - 1;
        if (emptyDaysLength < 0) {
            emptyDaysLength = 6;
        }

        if (emptyDaysLength === 0) {
            emptyDaysLength = 7;
        }

        const prevMonthDaysCount = new Date(nDate.getFullYear(), nDate.getMonth(), 0).getDate();

        const days = [];

        /**
         * Например, для последних 4-х дней февраля получится массив [25, 26, 27, 28]
         */
        for (let i = prevMonthDaysCount - emptyDaysLength + 1; i <= prevMonthDaysCount; i++) {
            days.push(i);
        }

        return days;
    }

    /**
     * Получить коллецию дней после текущего месяца, чтобы заполнить пустое место до количества дней в this.weeksToShow
     * @param {number} totalCountBefore
     * @returns {Array}
     */
    getDaysAfterCurrent(totalCountBefore: number): any[] {
        const countAfter = this.weeksToShow * 7 - totalCountBefore;

        const days = [];

        for (let i = 1; i <= countAfter; i++) {
            days.push(i);
        }

        return days;
    }

    /**
     * Получить количество дней в месяце с датой date
     * @param {Date} date
     * @returns {number}
     */
    private getDaysInMonth(date: Date): number {
        return (new Date(date.getFullYear(), date.getMonth() + 1, 0)).getDate();
    }

    /**
     * Нормализует дату для корректной работы с ней.
     * Нормализация подразумевает выставление дня недели на первое число, чтобы
     * избежать коллизий при манипулировании датой.
     * @param {Date} date
     * @returns {Date}
     */
    private normalizeDate(date: Date): Date {
        const normalizedDate = new Date(date);
        normalizedDate.setDate(1);
        return normalizedDate;
    }

    /**
     * Является ли день под номером dateIndex доступным в текущей дате date.
     * День является недоступным если он не попадает в рамки дат "От" и "До"
     * @param date
     * @param dayIndex
     * @returns {boolean}
     */
    private isDayAvailable(date, dayIndex) {
        if (this.dateFrom) {
            if (date.getFullYear() < this.dateFrom.getFullYear()) {
                return false;
            }

            if (date.getFullYear() === this.dateFrom.getFullYear() && date.getMonth() < this.dateFrom.getMonth()) {
                return false;
            }

            if (date.getFullYear() === this.dateFrom.getFullYear() && date.getMonth() === this.dateFrom.getMonth() && dayIndex < this.dateFrom.getDate()) {
                return false;
            }
        }

        if (this.dateTo) {
            if (date.getFullYear() > this.dateTo.getFullYear()) {
                return false;
            }

            if (date.getFullYear() === this.dateTo.getFullYear() && date.getMonth() > this.dateTo.getMonth()) {
                return false;
            }

            if (date.getFullYear() === this.dateTo.getFullYear() && date.getMonth() === this.dateTo.getMonth() && dayIndex > this.dateTo.getDate()) {
                return false;
            }
        }

        return true;
    }

    /**
     * Проверяет, выбран ли отображаемый день
     * @param {Date} date
     * @param dayIndex
     * @returns {boolean}
     */
    private isDateSelected(date: Date, dayIndex?) {
        if (!this.selectedDate || !date) {
            return false;
        }

        const nDate = dayIndex ? date : this.normalizeDate(date);

        const sMonth = this.selectedDate.getMonth();
        const sYear = this.selectedDate.getFullYear();
        const sDate = this.selectedDate.getDate();

        if (sYear !== nDate.getFullYear()) {
            return false;
        }

        if (sMonth !== nDate.getMonth()) {
            return false;
        }

        if (dayIndex && dayIndex !== sDate) {
            return false;
        }

        return true;
    }

    /**
     * Является ли переданная дата сегодняшей?
     * @param {Date} date
     * @param {number} dayIndex
     * @returns {boolean}
     */
    private isToday(date: Date, dayIndex?: number): boolean {
        if (this.today.getFullYear() !== date.getFullYear()) {
            return false;
        }

        if (this.today.getMonth() !== date.getMonth()) {
            return false;
        }

        if (dayIndex && dayIndex !== this.today.getDate()) {
            return false;
        }

        return true;
    }
    /**
     * Преобразует дату в строку заданного формата
     * @param {Date} date
     * @param {string} format
     * @returns {any}
     */
    dateToFormat(date: Date, format: string): string {
        if (!date || !format) {
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

        return '' + format.replace('dd', day).replace('mm', month).replace('yyyy', year);
    }

    /**
     * Преобразует строку в формате this.format в объект даты.
     * Делаем это вручную, а не с помощью Date.parse, чтобы добиться кроссбраузерности.
     * @param {string} string
     * @param {string} format
     * @returns {Date}
     */
    stringToDate(string: string, format: string): Date {
        if (!string || !format || string.length !== format.length && string !== 'today') {
            return null;
        }

        if (string === 'today') {
            return new Date(this.today);
        }

        const newDate = new Date(1970, 0, 1);

        try {
            ['dd', 'mm', 'yyyy'].forEach((part) => {
                const index = format.indexOf(part);
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