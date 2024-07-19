import {test} from '../test-options'
import { PageManager } from '../page-objects/pageManager'
import {faker} from '@faker-js/faker'


test('paramaterized methods', async({pageManager}) => {
    const randomFullName = faker.name.fullName()
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.datatype.number(1000)}@test.com`

    //await pm.navigateTo().formLayoutsPage()
    await pageManager.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption(process.env.USERNAME, process.env.PASSWORD, 'Option 1')
    await pageManager.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)
})
