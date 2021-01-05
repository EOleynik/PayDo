import parentPage from "../pages/ParentPage"

class RestPage{

    enterTextInToInput(Input, text) {
        parentPage.getInput(Input).clear().type(text);
    }

    clickButton(name) {
        parentPage.clickButton(name);
    }

}


export default new RestPage();