
import parentPage from "../../pages/ParentPage";
import moneyTransferPage from "../../pages/MoneyTransferPage";
import merchants from "../../fixtures/Prod/merchants.json";
import feen from "../../fixtures/Prod/feen.json";
import loginPage from "../../pages/LoginPage";
import homePage from "../../pages/HomePage";
import admin_headers from "../../fixtures/Prod/admin_headers.json";
import sender_headers from "../../fixtures/Prod/sender_headers.json";
import recipient_headers from "../../fixtures/Prod/recipient_headers.json";
import betweenWallets from "../../fixtures/Prod/betweenWallets.json";

describe('Between Wallets suit ', () => {

    it('Create transfer by recipient ID, all data is valid', () => {

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
        moneyTransferPage.chooseCurrencyWallet('USD');
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

    it('Create transfer by recipient Email, all data is valid', () => {

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
        moneyTransferPage.chooseCurrencyWallet('USD');
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

    it('Create transfer by recipient Email, choose personal account', () => {

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
        moneyTransferPage.chooseCurrencyWallet('USD');
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

    it('Create transfer by reference number, all data is valid', () => {

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
        moneyTransferPage.chooseCurrencyWallet('USD');
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
        moneyTransferPage.chooseCurrencyWallet('USD');
        moneyTransferPage.enterTextInToInputRecipient("ECOM" + 0 + merchants.account_6 + "F");
        moneyTransferPage.enterTextInToInputAmount(merchants.amount_transfer);
        cy.wait(1000);
        moneyTransferPage.clickButtonProceed();
        cy.wait(1000);
        moneyTransferPage.confirmTransferWith2FA(merchants.authenticator_2)
        moneyTransferPage.clickButtonConfirmTransfer();
        moneyTransferPage.ConfirmationTransfer('Yes, I sure ')
        cy.wait(2000);
        moneyTransferPage.checkStatusWithdraw('Error "userIdentifierTo", This user is not verified yet.');
    });

    it('Create transfer, recipient data invalid', () => {

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
        moneyTransferPage.chooseCurrencyWallet('USD');
        moneyTransferPage.enterTextInToInputRecipient('00');
        moneyTransferPage.checkErrorDisplay('We didn\'t find anyone for your request. Please, try again');
        moneyTransferPage.checkButtonStatus('Proceed', 'disabled');

    });

    it('Create a transfer, not enough money in the wallets', () => {

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
        moneyTransferPage.chooseCurrencyWallet('USD');
        moneyTransferPage.enterTextInToInputRecipient("ECOM" + 0 + merchants.account_6 + "F");
        moneyTransferPage.enterTextInToInputAmount('1000');
        moneyTransferPage.checkErrorAlert('Insufficient funds');
        //moneyTransferPage.closeErrorAlert();
        moneyTransferPage.checkButtonStatus('Proceed', 'disabled')

    });


    describe('Between API ', () => {

        before(() => {
            parentPage.getTokenUser('recipient', merchants.email_4, merchants.password_4, merchants.authenticator_4); // token recipient
            parentPage.getTokenUser('sender', merchants.email_2, merchants.password_2, merchants.authenticator_2); // token sender
            parentPage.getTokenUser('admin', feen.email, feen.password, feen.authenticator); // token admin
            parentPage.getAvailableBalance('sender', betweenWallets.wallet);
            parentPage.getAvailableBalance('recipient', betweenWallets.wallet)
            parentPage.getCommission(merchants.amount_transfer, betweenWallets.wallet, 13, 511, admin_headers.token, 204);
        })

        it('Between Wallets math, wallets match', () => {
            moneyTransferPage.CreateTransferBetweenWallets(betweenWallets.amount_transfer, betweenWallets.wallet,
                'recipient', merchants.authenticator_2, merchants.account_4);
            moneyTransferPage.checkAvailableSenderWallet('sender', betweenWallets.wallet, merchants.amount_transfer, sender_headers.token);
            moneyTransferPage.checkAvailableRecipientWallet('recipient', betweenWallets.wallet, merchants.amount_transfer, recipient_headers.token);
        });
    })


})