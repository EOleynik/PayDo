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

    checkInfoText(checkText) {
        parentPage.isElementExist('.section-block');
        // parentPage.checkText(checkText, noVerificationBlock);
        cy.get('.section-block').find('p').invoke('text').should((text) => {
            expect(text).to.eq(checkText);
        })
    }

}


export default new ReportPage();