//this file was used to add additional options to the playwright.config.ts file primarily for other webpage URL variables
//revisited this in a later lesson - each item in the "test" function definition is a fixture
import {test as base} from '@playwright/test'
import { PageManager } from '../pw-practice-app/page-objects/pageManager'
export type TestOptions = {
    globalsqaURL: string
    formLayoutsPage: string
    pageManager: PageManager
}

export const test = base.extend<TestOptions>({
    globalsqaURL: ['', {option: true}],

    formLayoutsPage: async({page}, use) => {
        await page.goto('/')
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
        await use(''),
        console.log('Tear Down')
    },

    pageManager: async({page, formLayoutsPage}, use) => {
        const pm = new PageManager(page)
        await use(pm)
    }
})