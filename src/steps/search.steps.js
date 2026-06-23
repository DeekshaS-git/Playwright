const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const SearchPage = require('../pages/searchPage');

Given('User is on the homepage', async function () {
    this.searchPage = new SearchPage(this.page);
    await this.searchPage.launchApplication();
});

When('User searches for {string}', async function (product) {
    await this.searchPage.searchProduct(product);
});

Then('Search results for {string} should be displayed', async function (product) {
   const products = await this.searchPage.getSearchResults();

   console.log(products);
    
});
