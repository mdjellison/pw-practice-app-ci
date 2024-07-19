import {test, expect} from '@playwright/test'
import { using } from 'rxjs'

test.beforeEach(async({page}) => {
    await page.goto('/')
})

test.describe('Form Layouts page @block', () => {
    test.describe.configure({retries: 0})
    test.describe.configure({mode: 'serial'})
    
    test.beforeEach(async({page}) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('input fields', async({page}) => {
        const usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"})

        await usingTheGridEmailInput.fill('test@test.com')
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially('test2@test.com')

        //generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toEqual('test2@test.com')


        //locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com')
    })

    test.only('radio buttons', async({page}) => {
        const usingTheGridForm = page.locator('nb-card', {hasText: "Using the Grid"})

        //await usingTheGridForm.getByLabel('Option 1').check({force: true})
        //Can use .getByLabel or .getByRole to select here ^
        //must use {force: true} due to 'visually-hidden' specified as parameter in this class in the DOM
        await usingTheGridForm.getByRole('radio', {name: "Option 1"}).check({force: true})

        //generic assertion
        const radioStatus = await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked()
        await expect(usingTheGridForm).toHaveScreenshot({maxDiffPixels: 150})
        // expect(radioStatus).toBeTruthy()

        // //locator assertion
        // await expect(await usingTheGridForm.getByRole('radio', {name: "Option 1"})).toBeChecked()

        //selecting button 2, verifying button 1 is no longer checked, verifying button 2 is now checked
        // await usingTheGridForm.getByRole('radio', {name: "Option 2"}).check({force: true})
        // expect(await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked()).toBeFalsy()
        // expect(await usingTheGridForm.getByRole('radio', {name: "Option 2"}).isChecked()).toBeTruthy()
    })
})

test('checkboxes', async({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Toastr').click()

    //use check() and uncheck() to set checkbox into state instead of just clicking it
    await page.getByRole('checkbox', {name: "Hide on click"}).uncheck({force: true})
    await page.getByRole('checkbox', {name: "Prevent arising of duplicate toast"}).check({force: true})

    //need to use .all() here to convert list of located elements to an array
    //reminder to use {force: true} when a located class is visually-hidden
    const allBoxes = page.getByRole('checkbox')
    for(const box of await allBoxes.all()){
        await box.uncheck({force: true})
        expect(await box.isChecked()).toBeFalsy()
    }
})

test('lists and dropdowns', async({page}) => {
    const dropDownMenu = page.locator('ngx-header nb-select')
    await dropDownMenu.click()

    //recommended locator approach for list items - requires UL/LI tags in DOM
    page.getByRole('list') //use when the list has UL tag
    page.getByRole('listitem') //use when the list has LI tag

    //const optionList = page.getByRole('list').locator('nb-option')
    const optionList = page.locator('nb-option-list nb-option')
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
    await optionList.filter({hasText: "Cosmic"}).click()

    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    //object initialized with expected 'background-color' values for 'nb-layout-header' in each page style
    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    }

    //for loop that selects each style and validates 'background-color' value of 'nb-layout-header'
    await dropDownMenu.click()
    for(const color in colors){
        await optionList.filter({hasText: color}).click()
        await expect(header).toHaveCSS('background-color', colors[color])
        if(color != "Corporate")
            await dropDownMenu.click()
    }
})

test('tooltips', async({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()

    const tooltipCard = page.locator('nb-card', {hasText: "Tooltip Placements"})
    await tooltipCard.getByRole('button', {name: "Top"}).hover()

    //page.getByRole('tooltip') ----- //if you have a role tooltip created (this is not assigned to the web element in our example)
    
    //locator for tooltip that was found after pausing DOM (use F8 while on Sources tab to pause webpage)
    const tooltip = await page.locator('nb-tooltip').textContent()
    expect(tooltip).toEqual('This is a tooltip')
})

test('dialog boxes', async({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    //listener function that instructs Playwright how to handle the dialog box owned by the browser
    //must be before the action that causes the dialog box to appear
    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()
    })
    
    await page.getByRole('table').locator('tr', {hasText: 'mdo@gmail.com'}).locator('.nb-trash').click()
    await expect(page.locator('tbody tr').first()).not.toHaveText('mdo@gmail.com')
})

test('web tables', async({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    //1 get the row by any text in this row
    const targetRow = page.getByRole('row', {name: "twitter@outlook.com"})
    //select pencil icon on row
    await targetRow.locator('.nb-edit').click()

    //once this pencil icon is selected, the text in the row changes to a property and needs a different locator
    await page.locator('input-editor').getByPlaceholder('Age').clear()
    await page.locator('input-editor').getByPlaceholder('Age').fill('35')
    await page.locator('.nb-checkmark').click()

    //2 get the row based on the value in the specific column
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click()

    //this calls the specific row first by looking for any row with 11
    //since there are two rows with 11 in the 2nd page, we have to narrow it down further but looking at the column
    //.filter() here does this by looking for "a row with a value in column index 1 equal to 11"
    const targetRowById = page.getByRole('row', {name: "11"}).filter({has: page.locator('td').nth(1).getByText('11')})

    await targetRowById.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
    await page.locator('.nb-checkmark').click()
    await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')

    //3 test filter of table
    const ages = ["20", "30", "40", "200"]

    //input each value into age field
    for(let age of ages){
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age)
        //delay is necessary here because table loads slower than playwright
        await page.waitForTimeout(500)

        const ageRows = page.locator('tbody tr')
        
        //look through each row after table filters and verify only input ages are listed after filtering
        for(let row of await ageRows.all()){
            const cellValue = await row.locator('td').last().textContent()

            //since no rows listed for an age of 200, we want "No data found" for that input to pass test
            if(age == "200"){
                expect(await page.getByRole('table').textContent()).toContain('No data found')
            } else {
                expect(cellValue).toEqual(age)
            }
        }
    }
})

test('datepicker', async({page}) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarInputField = page.getByPlaceholder('Form Picker')
    await calendarInputField.click()

    //create a new Date object that has methods to easily grab dates
    let date = new Date()

    //set date value for testing
    //a better way to write this might be to loop through various inputs
    date.setDate(date.getDate() + 10000)

    //get expected date to click on cell
    const expectedDate = date.getDate().toString()

    //create date string from individual pieces for final assertion
    const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'})
    const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})
    const expectedYear = date.getFullYear()
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`
    
    //compare current month to displayed month on date picker
    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} `

    //loop through date picker until the correct month is displayed
    while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    }

    //using class locator to differentiate between cells from other months
    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click()
    await expect(calendarInputField).toHaveValue(dateToAssert)
})

test('Sliders', async({page}) => {
    //1 update attribute
    //const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')

    //by default, page scripts run in browser page environment while Playwright scripts run in the Playwright environment
    //the page.evaluate() function can run a javascript function in the context of the web page
    //await tempGauge.evaluate(node => {
    //    node.setAttribute('cx', '232.630')
    //    node.setAttribute('cy', '232.630')
    //})
    //await tempGauge.click()

    //2 using actual mouse movement
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    //need to scroll page into view to correctly use bounding box for mouse input
    await tempBox.scrollIntoViewIfNeeded()

    //creates bounding box
    const box = await tempBox.boundingBox()

    //Shift coordinates from top-left corner to center of bounding box
    const x = box.x + box.width / 2
    const y = box.y + box.height / 2

    
    await page.mouse.move(x, y)
    //up() and down() refer to mouse button being held up/down like click()
    await page.mouse.down()

    //move() function uses absolute coordinates and not coordinates from current position
    //for some reason the test application with a 2-D slider doesn't react well with a single command so two are used here
    await page.mouse.move(x + 100, y)
    await page.mouse.move(x + 100, y + 100)
    await page.mouse.up()
    await expect(tempBox).toContainText('30')
})

