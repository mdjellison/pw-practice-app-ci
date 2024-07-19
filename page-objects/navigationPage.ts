import { Locator, Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

//Treating the navigation side panel as its own page - hence "NavigationPage"
//need to export classes for them to be imported
export class NavigationPage extends HelperBase{

    //type declarations
    readonly formLayoutsMenuItem: Locator
    readonly datePickerMenuItem: Locator
    readonly smartTableMenuItem: Locator
    readonly toastrMenuItem: Locator
    readonly tooltipMenuItem: Locator

    constructor(page: Page){
        //use this.page to make sure the class is using the page that is passed in
        super(page)
        this.formLayoutsMenuItem = page.getByText('Form Layouts')
        this.datePickerMenuItem = page.getByText('Datepicker')
        this.smartTableMenuItem = page.getByText('Smart Table')
        this.toastrMenuItem = page.getByText('Toastr')
        this.tooltipMenuItem = page.getByText('Tooltip')
    }

    async formLayoutsPage(){
        //continue to use this.page in class method definitions
        await this.selectGroupMenuItem('Forms')
        await this.formLayoutsMenuItem.click()
        await this.waitForNumberOfSeconds(2)
    }

    async datepickerPage(){
        await this.selectGroupMenuItem('Forms')
        await this.datePickerMenuItem.click()
    }

    async smartTablePage(){
        await this.selectGroupMenuItem('Tables & Data')
        await this.smartTableMenuItem.click()
    }

    async toastrPage(){
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.toastrMenuItem.click()
    }

    async tooltipPage(){
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.tooltipMenuItem.click()
    }

    //method to check if a tab is already opened on navigation page before clicking it
    private async selectGroupMenuItem(groupItemTitle: string){
        const groupMenuItem = this.page.getByTitle(groupItemTitle)
        const expandedState = await groupMenuItem.getAttribute('aria-expanded')
        if(expandedState == "false")
                await groupMenuItem.click()
    }
}