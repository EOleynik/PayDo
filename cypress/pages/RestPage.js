import parentPage from "../pages/ParentPage"

class RestPage{

    enterTextInToInput(Input, text) {
        parentPage.getInput(Input).clear().type(text);
    }

    clickButton(name) {
        parentPage.clickButton(name).click();
    }

}


export default new RestPage();