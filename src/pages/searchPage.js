const BasePage = require('./basePage');

class SearchPage extends BasePage {
    constructor(page) {
        super(page);
        this.searchBox = page.locator('#twotabsearchtextbox');
        this.searchIcon = page.locator('#nav-search-submit-button');
        this.searchResults = page.locator('body');
        this.productTitle = page.locator('.a-size-medium.a-color-base.a-text-normal');
    }

    async searchProduct(product) {
        await this.searchBox.fill(product);
        await this.searchIcon.click();
    }

    async getSearchResults() {

        await this.productTitle.first().waitFor();
        const allProducts = await this.productTitle.allTextContents();
        console.log('All Products:', allProducts);
        return allProducts;
    }
}

module.exports = SearchPage;