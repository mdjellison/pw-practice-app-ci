import { defineConfig, devices } from '@playwright/test';
import type { TestOptions } from './test-options'

//example of a very basic config file
//these can be easily created and customized for various purposes

//Read environment variables from file.
require('dotenv').config();

//added type <TestOptions> to this function
export default defineConfig<TestOptions>({

  use: {
    globalsqaURL: 'https://www.globalsqa.com/demo-site/draganddrop/',
    baseURL: 'http://localhost:4200',
  },

  projects: [
    {
      name: 'chromium',
    },
  ]
});
