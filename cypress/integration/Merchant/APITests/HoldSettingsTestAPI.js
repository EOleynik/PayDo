
import feenPage from "../../../pages/FeenPage"

describe('Hold settings', () => {

    // On group Cards International
    it('Set payment settings ', () => {
        feenPage.setPaymentSettings();
    });

    // Set Hold of Pending balance [0 days 100%] for PM 300
    it('Hold setting ', () => {
        feenPage.changeHoldPendingBalance();
    })
});