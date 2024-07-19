import {test, expect} from '@playwright/test'

test.beforeEach(async({page}) => {
    await page.goto(process.env.URL)
    await page.getByText('Button Triggering AJAX Request').click()
    //testInfo.setTimeout(0)
    //need to figure out why .testInfo isn't working >.<
})

test('auto waiting', async({page}) => {
    const successButton = page.locator('.bg-success')

    //await successButton.click()

    //const text = await successButton.textContent()

    //.allTestContents() does not have any auto-waits, so it needs a .waitFor() command before it
    //await successButton.waitFor({state: "attached"})
    //const text = await successButton.allTextContents()

    //expect(text).toContain('Data loaded with AJAX get request.')

    await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000})
})

test.skip('alternative waits', async({page}) => {
    const successButton = page.locator('.bg-success')

    //__ wait for element
    //await page.waitForSelector('.bg-success')

    //__ wait for particular response
    //await page.waitForResponse('http://www.uitestingplayground.com/ajaxdata')

    //__ wait for network calls to be completed ('NOT RECOMMENDED')
    //if an API call is stuck, the test itself would become stuck as well with this
    await page.waitForLoadState('networkidle')

    await page.waitForURL

    const text = await successButton.allTextContents()
    expect(text).toContain('Data loaded with AJAX get request.')
})

test.skip('timeouts', async({page}) => {
    //test.setTimeout(10000)

    //this will triple the allotted time for the test
    test.slow()

    const successButton = page.locator('.bg-success')

    await successButton.click()
})