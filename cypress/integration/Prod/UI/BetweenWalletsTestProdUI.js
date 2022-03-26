
import moneyTransferPage from "../../../pages/MoneyTransferPage";
import merchants from "../../../fixtures/Prod/merchants.json";
import loginPage from "../../../pages/LoginPage";
import homePage from "../../../pages/HomePage";
import betweenWallets from "../../../fixtures/Prod/betweenWallets.json";

describe('Between Wallets suit UI', () => {

    beforeEach(() => {
        cy.visit('https://account.paydo.com/en/auth/login');
        cy.wait(2000);
        loginPage.checkUrl('/auth/login');
        loginPage.checkAuthorization(merchants.email_2, merchants.password_2, merchants.authenticator_2);
        cy.wait(3000);

        homePage.checkUrl('/overview');
    })

    it('Create transfer by recipient ID, all data is valid', () => {

        homePage.clickMenuCreateTransfer();
        cy.wait(3000);

        moneyTransferPage.checkUrl('/money-transfers');
        moneyTransferPage.clickTab('Between Wallets');
        moneyTransferPage.chooseCurrencyWallet(betweenWallets.wallet);
        moneyTransferPage.enterTextInToInputRecipient(merchants.account_4);
        moneyTransferPage.enterTextInToInputAmount(betweenWallets.amount_transfer);
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

        homePage.clickMenuCreateTransfer();
        cy.wait(3000);

        moneyTransferPage.checkUrl('/money-transfers');
        moneyTransferPage.clickTab('Between Wallets');
        moneyTransferPage.chooseCurrencyWallet(betweenWallets.wallet);
        moneyTransferPage.enterTextInToInputRecipient(merchants.email_4);
        moneyTransferPage.chooseAccountType('business');
        moneyTransferPage.enterTextInToInputAmount(betweenWallets.amount_transfer);
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

        homePage.clickMenuCreateTransfer();
        cy.wait(3000);

        moneyTransferPage.checkUrl('/money-transfers');
        moneyTransferPage.clickTab('Between Wallets');
        moneyTransferPage.chooseCurrencyWallet(betweenWallets.wallet);
        moneyTransferPage.enterTextInToInputRecipient(merchants.email_4);
        moneyTransferPage.chooseAccountType('personal');
        moneyTransferPage.enterTextInToInputAmount(betweenWallets.amount_transfer);
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

        homePage.clickMenuCreateTransfer();
        cy.wait(3000);

        moneyTransferPage.checkUrl('/money-transfers');
        moneyTransferPage.clickTab('Between Wallets');
        moneyTransferPage.chooseCurrencyWallet(betweenWallets.wallet);
        moneyTransferPage.enterTextInToInputRecipient(merchants.email_2);
        moneyTransferPage.chooseAccountType('personal');
        moneyTransferPage.enterTextInToInputAmount(betweenWallets.amount_transfer);
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

        homePage.getChangeAccount('Switch to personal')
        homePage.clickMenuCreateTransfer();
        cy.wait(3000);

        moneyTransferPage.checkUrl('/money-transfers');
        moneyTransferPage.clickTab('Between Wallets');
        moneyTransferPage.chooseCurrencyWallet(betweenWallets.wallet);
        moneyTransferPage.enterTextInToInputRecipient(merchants.email_2);
        moneyTransferPage.chooseAccountType('business')
        moneyTransferPage.enterTextInToInputAmount(betweenWallets.amount_transfer);
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

        homePage.clickMenuCreateTransfer();
        cy.wait(3000);

        moneyTransferPage.checkUrl('/money-transfers');
        moneyTransferPage.clickTab('Between Wallets');
        moneyTransferPage.chooseCurrencyWallet(betweenWallets.wallet);
        moneyTransferPage.enterTextInToInputRecipient("ECOM" + 0 + merchants.account_4 + "F");
        moneyTransferPage.enterTextInToInputAmount(betweenWallets.amount_transfer);
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

        homePage.clickMenuCreateTransfer();
        cy.wait(3000);

        moneyTransferPage.checkUrl('/money-transfers');
        moneyTransferPage.clickTab('Between Wallets');
        moneyTransferPage.chooseCurrencyWallet(betweenWallets.wallet);
        moneyTransferPage.enterTextInToInputRecipient("ECOM" + 0 + merchants.account_6 + "F");
        moneyTransferPage.enterTextInToInputAmount(betweenWallets.amount_transfer);
        cy.wait(1000);
        moneyTransferPage.clickButtonProceed();
        cy.wait(1000);
        moneyTransferPage.confirmTransferWith2FA(merchants.authenticator_2)
        moneyTransferPage.clickButtonConfirmTransfer();
        moneyTransferPage.ConfirmationTransfer('Yes, I sure ')
        cy.wait(2000);
        moneyTransferPage.checkStatusWithdraw('Withdraw created');
    });

    it('Create transfer, recipient data include boundary spaces', () => {

        homePage.clickMenuCreateTransfer();
        cy.wait(3000);

        moneyTransferPage.checkUrl('/money-transfers');
        moneyTransferPage.clickTab('Between Wallets');
        moneyTransferPage.chooseCurrencyWallet(betweenWallets.wallet);
        moneyTransferPage.enterTextInToInputRecipient('    ' + merchants.email_4 + '    ');
        moneyTransferPage.chooseAccountType('personal')
        moneyTransferPage.enterTextInToInputAmount(betweenWallets.amount_transfer);
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

    it('Create transfer by email, check block info', () => {

        homePage.clickMenuCreateTransfer();
        cy.wait(3000);

        moneyTransferPage.checkUrl('/money-transfers');
        moneyTransferPage.clickTab('Between Wallets');
        moneyTransferPage.chooseCurrencyWallet(betweenWallets.wallet);
        moneyTransferPage.enterTextInToInputRecipient(merchants.email_4);
        moneyTransferPage.checkDisplayInformationBlock(betweenWallets.infoTextFull, 0);
    });

    it('Create transfer, recipient is not verified, check alert message', () => {

        homePage.clickMenuCreateTransfer();
        cy.wait(3000);

        moneyTransferPage.checkUrl('/money-transfers');
        moneyTransferPage.clickTab('Between Wallets');
        moneyTransferPage.chooseCurrencyWallet(betweenWallets.wallet);
        moneyTransferPage.enterTextInToInputRecipient(merchants.email_6);
        let account_type = moneyTransferPage.getRandomAccountType2(1, 2);
        moneyTransferPage.chooseAccountType(account_type);
        moneyTransferPage.enterTextInToInputAmount(betweenWallets.amount_transfer);
        cy.wait(1000);
        moneyTransferPage.clickButtonProceed();
        cy.wait(1000);
        moneyTransferPage.checkDisplayInformationBlock(betweenWallets.infoPart1 + account_type + betweenWallets.infoPart2, 1);
        moneyTransferPage.checkDisplayInformationBlock(betweenWallets.infoText2, 2);
    });

    it('Create a transfer, check the details of the recipient on the preview, recipient verified', () => {

        homePage.clickMenuCreateTransfer();
        cy.wait(3000);

        moneyTransferPage.checkUrl('/money-transfers');
        moneyTransferPage.clickTab('Between Wallets');
        moneyTransferPage.chooseCurrencyWallet(betweenWallets.wallet);
        moneyTransferPage.enterTextInToInputRecipient(merchants.email_4);
        let account_type = moneyTransferPage.getRandomAccountType(1, 2);
        console.log(account_type)
        moneyTransferPage.chooseAccountType(account_type);
        moneyTransferPage.enterTextInToInputAmount(betweenWallets.amount_transfer);
        cy.wait(1000);
        moneyTransferPage.clickButtonProceed();
        cy.wait(1000);
        moneyTransferPage.checkDetailsOfTheRecipient( betweenWallets.recipientData + merchants.email_4 + " ", 4);
        moneyTransferPage.checkDetailsOfTheRecipient(betweenWallets.recipientData2,5, account_type)
    });

    it('Create a transfer, check the details of the recipient on the preview, recipient not verified', () => {

        homePage.clickMenuCreateTransfer();
        cy.wait(3000);

        moneyTransferPage.checkUrl('/money-transfers');
        moneyTransferPage.clickTab('Between Wallets');
        moneyTransferPage.chooseCurrencyWallet(betweenWallets.wallet);
        moneyTransferPage.enterTextInToInputRecipient(merchants.email_6);
        let account_type = moneyTransferPage.getRandomAccountType(1, 2);
        moneyTransferPage.chooseAccountType(account_type);
        moneyTransferPage.enterTextInToInputAmount(betweenWallets.amount_transfer);
        cy.wait(1000);
        moneyTransferPage.clickButtonProceed();
        cy.wait(1000);
        moneyTransferPage.checkDetailsOfTheRecipient( betweenWallets.recipientData + merchants.email_6 + " ", 4);
        moneyTransferPage.checkDetailsOfTheRecipient(betweenWallets.recipientData2 + "  ", 5)
    });

    it('Create transfer by email, sender account type = recipient account type', () => {

        homePage.clickMenuCreateTransfer();
        cy.wait(3000);

        moneyTransferPage.checkUrl('/money-transfers');
        moneyTransferPage.clickTab('Between Wallets');
        moneyTransferPage.chooseCurrencyWallet(betweenWallets.wallet);
        moneyTransferPage.enterTextInToInputRecipient(merchants.email_2);
        moneyTransferPage.chooseAccountType('business');
        moneyTransferPage.checkErrorDisplay('We didn\'t find anyone for your request. Please, try again');
        moneyTransferPage.checkButtonStatus('Proceed', 'disabled');
    });

    it('Create transfer, recipient data invalid', () => {

        homePage.clickMenuCreateTransfer();
        cy.wait(3000);

        moneyTransferPage.checkUrl('/money-transfers');
        moneyTransferPage.clickTab('Between Wallets');
        moneyTransferPage.chooseCurrencyWallet(betweenWallets.wallet);
        moneyTransferPage.enterTextInToInputRecipient('00');
        moneyTransferPage.checkErrorDisplay('We didn\'t find anyone for your request. Please, try again');
        moneyTransferPage.checkButtonStatus('Proceed', 'disabled');
    });

    it('Create a transfer, not enough money in the wallets', () => {

        homePage.clickMenuCreateTransfer();
        cy.wait(3000);

        moneyTransferPage.checkUrl('/money-transfers');
        moneyTransferPage.clickTab('Between Wallets');
        moneyTransferPage.chooseCurrencyWallet(betweenWallets.wallet);
        moneyTransferPage.enterTextInToInputRecipient("ECOM" + 0 + merchants.account_6 + "F");
        moneyTransferPage.enterTextInToInputAmount('1000');
        moneyTransferPage.checkErrorAlert('Insufficient funds');
        moneyTransferPage.closeErrorAlert();
        //moneyTransferPage.checkButtonStatus('Proceed', 'disabled')
    });


})