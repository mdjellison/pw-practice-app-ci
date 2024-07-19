import {expect} from '@playwright/test'
import {test} from '../test-options'

test('drag and drop with iframe', async({page, globalsqaURL}) => {
    await page.goto(globalsqaURL)

    //iFrame locator
    const frame = page.frameLocator('[rel-title="Photo Manager"] iframe')
    //change page to frame here due to the following being located within the iFrame
    await frame.locator('li', {hasText: "High Tatras 2"}).dragTo(frame.locator('#trash'))

    //more precise control over drag & drop - can use mouse.down() and mouse.up()
    await frame.locator('li', {hasText: "High Tatras 4"}).hover()
    await page.mouse.down()
    await frame.locator('#trash').hover()
    await page.mouse.up()

    await expect(frame.locator('#trash li h5')).toHaveText(["High Tatras 2", "High Tatras 4"])
})