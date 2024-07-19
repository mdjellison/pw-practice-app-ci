import {test, expect} from '@playwright/test'

test.beforeEach(async({page}) => {
    await page.goto('/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})

test('Locator syntax rules', async({page}) =>{
    //by Tag name (no prefix)
    await page.locator('input').first().click()

    //by ID (#)
    await page.locator('#inputEmail1')

    //by Class value (.)
    page.locator('.shape-rectangle')

    //by Attribute ([])
    page.locator('[placeholder="Email"]')

    //by full Class value (entire class in brackets [])
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    //combine different selectors (place next to each other without a space between them)
    //playwright will find the element that has a match for all 3 elements below
    page.locator('input[placeholder="Email"][nbinput]')

    //by XPath (NOT RECOMMENDED) - came from Selenium? - no longer recommended
    page.locator('//*[@id="inputEmail1"]')

    //by partial text match
    page.locator(':text("Using")')

    //by exact text match
    page.locator(':text-is("Using the Grid")')
})

test('User facing locators', async({page}) => {
    await page.getByRole('textbox', {name: "Email"}).first().click()
    await page.getByRole('button', {name: "Sign in"}).first().click()

    await page.getByLabel('Email').first().click()

    await page.getByPlaceholder('Jane Doe').click()

    await page.getByText('Using the Grid').click()

    //we added data-testid="SignIn" to form-layouts.component.html file so that this ID could be used as a locator
    //data-testid="" is a reserved variable that Playwright uses
    //Interesting because a company could decide to provide test IDs for various elements as part of development to assist with testing
    await page.getByTestId('SignIn').click()

    await page.getByTitle('IoT Dashboard').click()
})

test('Locating child elements', async({page}) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()

    //technically calling out the 'nb-card' locator isn't necessary here, but this is an example of how we can drill down into child elements
    await page.locator('nb-card').getByRole('button', {name: "Sign in"}).first().click()

    //Can select by index - probably not the best approach in case the order of elements changes at some point throughout the project
    await page.locator('nb-card').nth(3).getByRole('button').click()
})

test('Locating parent elements', async({page}) => {
    //using filters as a second input argument to locate parent element
    await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Email"}).click()

    //using filter method instead
    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).click()

    //filter method allows for chaining filtering together
    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"}).getByRole('textbox', {name: "Email"}).click()

    //XPath - "only example of when you should actually use this in Playwright"
    //.locator('..') is an XPath command that allows us to go one level up to parent element
    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: "Email"}).click()
})

test('Reusing the locators', async({page}) => {
    //defining this constant to easily reuse code that is used frequently
    const basicForm = page.locator('nb-card').filter({hasText: "Basic Form"})
    const emailField = basicForm.getByRole('textbox', {name: "Email"})

    //use of constant instead of large function calls
    await emailField.fill('test@test.com')
    await basicForm.getByRole('textbox', {name: "Password"}).fill('Welcome123')
    await basicForm.locator('nb-checkbox').click()
    await basicForm.getByRole('button').click()

    //first assertion - haven't covered these yet but will get to them soon
    //needs to be added to import line at top
    await expect(emailField).toHaveValue('test@test.com')
})

test('Extracting values', async({page}) => {
    //single text value
    const basicForm = page.locator('nb-card').filter({hasText: "Basic Form"})
    const buttonText = await basicForm.locator('button').textContent()
    expect(buttonText).toEqual('Submit')

    //all text values
    //.allTextContents creates an array which can be assigned to a const
    const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents()
    //.toContain looks for the value in the passed in array
    expect(allRadioButtonsLabels).toContain("Option 1")

    //input value
    const emailField = basicForm.getByRole('textbox', {name: "Email"})
    await emailField.fill('test@test.com')
    const emailValue = await emailField.inputValue()
    expect(emailValue).toEqual('test@test.com')

    const placeholderValue = await emailField.getAttribute('placeholder')
    expect(placeholderValue).toEqual('Email')
})

test('Assertions', async({page}) => {

    const basicFormButton = page.locator('nb-card').filter({hasText: "Basic Form"}).locator('button')
    //General (generic) assertions
    //passing in a value
    const value = 5
    expect(value).toEqual(5)

    const text = await basicFormButton.textContent()
    expect(text).toEqual("Submit")

    //Locator assertion
    //passing in a locator - different set of methods - requires await
    await expect(basicFormButton).toHaveText('Submit')

    //Soft assertion
    //Will continue running test despite failure on assertion
    //Typically not best practice but might be circumstances in which this would make sense
    await expect.soft(basicFormButton).toHaveText('Submit')
    await basicFormButton.click()
})