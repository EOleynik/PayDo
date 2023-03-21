import parentPage from "../pages/ParentPage"

const pageTitleElement = '.breadcrumbs'

class IPNPage {

    checkUrl(Url) {
        parentPage.checkUrl(Url)
    }

    checkPageTitle(title) {
        parentPage.isPageTitleExist(pageTitleElement);
        parentPage.checkText(title, pageTitleElement)
    }
}


export default new IPNPage();