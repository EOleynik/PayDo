import parentPage from "../pages/ParentPage"

const shortest = 'Enter personal information'

class VerificationPage {

    checkUrl(Url) {
        parentPage.checkUrl(Url)
    }

    checkPageTitle() {
        parentPage.isPageTitleExist(shortest);
    }

    checkButtonExist(button_name) {
        parentPage.isButtonExist(button_name);
    }
}


export default new VerificationPage();