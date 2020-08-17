import loginPage from "../elements/LoginPage";
import managerPage from "../elements/ManagerPage"

describe('Accept verification tests', () => {

        it('Accept personal verification', () => {
            managerPage.acceptPersonalVerification();
            managerPage.acceptPersonalIban();
        })

        it('Accept personal verification', () => {
            managerPage.acceptBusinessVerification();
            managerPage.acceptBusinessIban();
        })


})