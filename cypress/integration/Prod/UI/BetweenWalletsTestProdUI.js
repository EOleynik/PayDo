
import moneyTransferPage from "../../../pages/MoneyTransferPage";
import merchants from "../../../fixtures/Prod/merchants.json";
import loginPage from "../../../pages/LoginPage";
import homePage from "../../../pages/HomePage";
import betweenWallets from "../../../fixtures/Prod/betweenWallets.json";

describe('Between Wallets suit UI', () => {

    beforeEach(() => {
        cy.visit('https://account.paydo.com/en/auth/login');
        cy.wait(1000);
        loginPage.checkUrl('/auth/login');
        loginPage.checkAuthorization(merchants.email_2, merchants.password_2, merchants.authenticator_2);
        cy.wait(3000);

        homePage.checkUrl('/overview');
        homePage.clickMenuCreateTransfer();
        cy.wait(3000);

        moneyTransferPage.checkUrl('/money-transfers');
        moneyTransferPage.clickTab('Between Wallets');
    })

    it('Create transfer by recipient ID, all data is valid', () => {

        moneyTransferPage.chooseCurrencyWallet(betweenWallets.wallet);
        moneyTransferPage.enterTextInToInputRecipient(merchants.account_4);
        moneyTransferPage.enterTextInToInputAmount(merchants.amount_transfer);
        cy.wait(1000);
        moneyTransferPage.clickButtonProceed();
        cy.wait(1000);
        moneyTransferPage.confirmTransferWith2FA(merchants.authenticator_2)
        moneyTransferPage.clickButtonConfirmTransfer();
        cy.wait(2000);
        moneyTransferPage.ConfirmationTransfer('Yes, I sure ')
        cy.wait(2000);
        moneyTransferPage.checkStatusWithdraw('Withdraw created');
    });

    it('Create a transfer to a business account by email to the recipient, all data is valid', () => {

        moneyTransferPage.chooseCurrencyWallet(betweenWallets.wallet);
        moneyTransferPage.enterTextInToInputRecipient(merchants.email_4);
        moneyTransferPage.enterTextInToInputAmount(merchants.amount_transfer);
        cy.wait(1000);
        moneyTransferPage.clickButtonProceed();
        cy.wait(1000);
        moneyTransferPage.confirmTransferWith2FA(merchants.authenticator_2)
        moneyTransferPage.clickButtonConfirmTransfer();
        moneyTransferPage.ConfirmationTransfer('Yes, I sure ')
        cy.wait(2000);
        moneyTransferPage.checkStatusWithdraw('Withdraw created');
    });

    it('Create a transfer to a personal account by email to the recipient, all data is valid', () => {

        moneyTransferPage.chooseCurrencyWallet(betweenWallets.wallet);
        moneyTransferPage.enterTextInToInputRecipient(merchants.email_4);
        moneyTransferPage.chooseAccountType('personal');
        moneyTransferPage.enterTextInToInputAmount(merchants.amount_transfer);
        cy.wait(1000);
        moneyTransferPage.clickButtonProceed();
        cy.wait(1000);
        moneyTransferPage.confirmTransferWith2FA(merchants.authenticator_2)
        moneyTransferPage.clickButtonConfirmTransfer();
        moneyTransferPage.ConfirmationTransfer('Yes, I sure ')
        cy.wait(2000);
        moneyTransferPage.checkStatusWithdraw('Withdraw created');
    });

    it('Create a transfer from a business account to a personal account (sender = recipient), all data is valid', () => {

        moneyTransferPage.chooseCurrencyWallet(betweenWallets.wallet);
        moneyTransferPage.enterTextInToInputRecipient(merchants.email_2);
        moneyTransferPage.chooseAccountType('personal');
        moneyTransferPage.enterTextInToInputAmount(merchants.amount_transfer);
        cy.wait(1000);
        moneyTransferPage.clickButtonProceed();
        cy.wait(1000);
        moneyTransferPage.confirmTransferWith2FA(merchants.authenticator_2)
        moneyTransferPage.clickButtonConfirmTransfer();
        moneyTransferPage.ConfirmationTransfer('Yes, I sure ')
        cy.wait(2000);
        moneyTransferPage.checkStatusWithdraw('Withdraw created');
    });

    it('Create a transfer from a personal account to a business account (sender = recipient), all data is valid', () => {

        moneyTransferPage.chooseCurrencyWallet(betweenWallets.wallet);
        moneyTransferPage.enterTextInToInputRecipient(merchants.email_2);
        moneyTransferPage.enterTextInToInputAmount(merchants.amount_transfer);
        cy.wait(1000);
        moneyTransferPage.clickButtonProceed();
        cy.wait(1000);
        moneyTransferPage.confirmTransferWith2FA(merchants.authenticator_2)
        moneyTransferPage.clickButtonConfirmTransfer();
        moneyTransferPage.ConfirmationTransfer('Yes, I sure ')
        cy.wait(2000);
        moneyTransferPage.checkStatusWithdraw('Withdraw created');
    });

    it('Create transfer by reference number, all data is valid', () => {

        moneyTransferPage.chooseCurrencyWallet(betweenWallets.wallet);
        moneyTransferPage.enterTextInToInputRecipient("ECOM" + 0 + merchants.account_4 + "F");
        moneyTransferPage.enterTextInToInputAmount(merchants.amount_transfer);
        cy.wait(1000);
        moneyTransferPage.clickButtonProceed();
        cy.wait(1000);
        moneyTransferPage.confirmTransferWith2FA(merchants.authenticator_2)
        moneyTransferPage.clickButtonConfirmTransfer();
        moneyTransferPage.ConfirmationTransfer('Yes, I sure ')
        cy.wait(2000);
        moneyTransferPage.checkStatusWithdraw('Withdraw created');
    });

    it('Create transfer, recipient is not verified', () => {

        moneyTransferPage.chooseCurrencyWallet(betweenWallets.wallet);
        moneyTransferPage.enterTextInToInputRecipient("ECOM" + 0 + merchants.account_6 + "F");
        moneyTransferPage.enterTextInToInputAmount(merchants.amount_transfer);
        cy.wait(1000);
        moneyTransferPage.clickButtonProceed();
        cy.wait(1000);
        moneyTransferPage.confirmTransferWith2FA(merchants.authenticator_2)
        moneyTransferPage.clickButtonConfirmTransfer();
        moneyTransferPage.ConfirmationTransfer('Yes, I sure ')
        cy.wait(2000);
        moneyTransferPage.checkStatusWithdraw('Withdraw created');
    });

    it('Create transfer, recipient data invalid', () => {

        moneyTransferPage.chooseCurrencyWallet(betweenWallets.wallet);
        moneyTransferPage.enterTextInToInputRecipient('00');
        moneyTransferPage.checkErrorDisplay('We didn\'t find anyone for your request. Please, try again');
        moneyTransferPage.checkButtonStatus('Proceed', 'disabled');
    });

    it('Create a transfer, not enough money in the wallets', () => {

        moneyTransferPage.chooseCurrencyWallet(betweenWallets.wallet);
        moneyTransferPage.enterTextInToInputRecipient("ECOM" + 0 + merchants.account_6 + "F");
        moneyTransferPage.enterTextInToInputAmount('1000');
        moneyTransferPage.checkErrorAlert('Insufficient funds');
        moneyTransferPage.closeErrorAlert();
        //moneyTransferPage.checkButtonStatus('Proceed', 'disabled')
    });


})