import moneyTransferPage from "../../../pages/MoneyTransferPage";


describe('Between Wallets math', () => {

    it('Between Wallets math, wallets match', () => {
        moneyTransferPage.createTransferAndCheckMath();
    });

})