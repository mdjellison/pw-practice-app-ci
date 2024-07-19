import {Page , expect} from "@playwright/test";
import { HelperBase } from "./helperBase";

export class DatepickerPage extends HelperBase{

    constructor(page: Page){
        super(page)
    }

    async selectCommonDatepickerDateFromToday(numberOfDaysFromToday: number){
        const calendarInputField = this.page.getByPlaceholder('Form Picker')
        await calendarInputField.click()
        const dateToAssert = await this.selectDateInTheCalendar(numberOfDaysFromToday)
        await expect(calendarInputField).toHaveValue(dateToAssert)
    }

    async selectDatepickerWithRangeFromToday(startDayFromToday: number, endDayFromToday: number){
        const calendarInputField = this.page.getByPlaceholder('Range Picker')
        await calendarInputField.click()
        const dateToAssertStart = await this.selectDateInTheCalendar(startDayFromToday)
        const dateToAssertEnd = await this.selectDateInTheCalendar(endDayFromToday)
        const dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`
        await expect(calendarInputField).toHaveValue(dateToAssert)
    }



    private async selectDateInTheCalendar(numberOfDaysFromToday: number){
    //create a new Date object that has methods to easily grab dates
    let date = new Date()

    //set date value for testing
    date.setDate(date.getDate() + numberOfDaysFromToday)

    //get expected date to click on cell
    const expectedDate = date.getDate().toString()

    //create date string from individual pieces for final assertion
    const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'})
    const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})
    const expectedYear = date.getFullYear()
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`
    
    //compare current month to displayed month on date picker
    let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
    const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} `

    //loop through date picker until the correct month is displayed
    while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
        await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
    }

    //using class locator to differentiate between cells from other months
    await this.page.locator('.day-cell.ng-star-inserted').getByText(expectedDate, {exact: true}).click()
    return dateToAssert
    }
}