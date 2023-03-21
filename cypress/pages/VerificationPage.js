import parentPage from "../pages/ParentPage"


const elementTitle = '.title-wrap > h1'


class VerificationPage {

    checkUrl(Url) {
        parentPage.checkUrl(Url)
    }

    checkPageTitle(title) {
        parentPage.isPageTitleExist(elementTitle);
        parentPage.checkText(title, elementTitle);
    }

    checkButtonExist(button_name) {
        parentPage.isButtonExist(button_name);
    }

    checkButtonStatus(name, status) {
        parentPage.getButtonStatus(name, status)
    }


}


export default new VerificationPage();