import loginPage from "../elements/LoginPage";
import projectsPage from "../elements/ProjectsPage";
import feenpage from "../elements/FeenPage"

describe('Hold settings', () => {

    // On group Cards International
    it('Set payment settings ', () => {
        feenpage.setPaymentSettings();
    })

    // Set Hold of Pending balance [0 days 100%] for PM 300
    it('Hold seting ', () => {
        feenpage.changeHoldPendingBalance();
    })
})