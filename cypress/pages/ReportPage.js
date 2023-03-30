import parentPage from "../pages/ParentPage"

const pageTitleElement = 'h1.page-title'

class ReportPage {

    checkUrl(Url) {
        parentPage.checkUrl(Url)
    }

    checkPageTitle(title) {
        parentPage.isPageTitleExist();
        parentPage.checkText(title, pageTitleElement)
    }
}


export default new ReportPage();