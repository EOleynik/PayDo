import parentPage from "./ParentPage";
import boardStepper from "../fixtures/Prod/boardStepper.json";

const sectionTitle = '.section-title';
const noVerificationBlock = '.no-verification-block';

class ListOfTransfers {

    checkUrl(Url) {
        parentPage.checkUrl(Url)
    }

    checkPageTitle(title) {
        parentPage.isPageTitleExist(sectionTitle);
        parentPage.checkText(title, sectionTitle)
    }

    checkInfoText(checkText) {
        parentPage.isElementExist(noVerificationBlock);
       // parentPage.checkText(checkText, noVerificationBlock);
        cy.get(noVerificationBlock).find('p').invoke('text').should((text) => {
            expect(text).to.eq(checkText);
        })
    }

    checkButtonExist(button_name) {
        parentPage.isButtonExist(button_name);
    }

    checkButtonStatus(name, status) {
        parentPage.getButtonStatus(name, status)
    }

}

export default new ListOfTransfers();