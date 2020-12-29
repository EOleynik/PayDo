import loginPage from "../../../pages/LoginPage";
import moneyTransferPage from "../../../pages/MoneyTransferPage";
import parentPage from "../../../pages/ParentPage";
import withdraw from "../../../fixtures/withdraw";
import withdrawPage from "../../../pages/WithdrawPage";
import merchant from "../../../fixtures/merchant";
import homePage from "../../../pages/HomePage";

describe('Withdraw suit ', () => {

    beforeEach('', () => {
        loginPage.visit('/');
        loginPage.loginWithCred(merchant.email, merchant.password);
        loginPage.enter2FACode(merchant.authenticator);
        cy.wait(3000);
    });

    it('Create withdraw, payment is not commercial', () => {

        homePage.checkUrl('/en/overview');
        homePage.clickMenuCreateTransfer();
        cy.wait(2000);

        moneyTransferPage.checkUrl('/money-transfers');
        moneyTransferPage.enterTextInToInputIBAN(withdraw.IBAN);
        moneyTransferPage.enterTextInToInputBeneficiaryName(withdraw.beneficiary_name);
        moneyTransferPage.selectCountry();
        moneyTransferPage.enterTextInToInputCity('City');
        moneyTransferPage.enterTextInToInputRecipientAdress(withdraw.recipient_address);
        moneyTransferPage.enterTextInToInputBICCode('BIJORU66XXX');
        moneyTransferPage.enterTextInToInputBeneficiaryBank('Primatbank');
        moneyTransferPage.enterTextInToInputPurposePayment('Other');
        moneyTransferPage.InstallCheckboxPaymentNotCommercial();
        moneyTransferPage.enterTextInToInputAmountToTransfer(withdraw.amount);
        moneyTransferPage.clickFieldAmountToBeCharged();
        moneyTransferPage.clickButtonProceed('Proceed');
        moneyTransferPage.clickButtonConfirmTransfer();
        cy.wait(1000);
        moneyTransferPage.enterAuthCode(merchant.authenticator);
        cy.wait(1000);
        moneyTransferPage.checkStatusWithdraw('Withdraw created');
        moneyTransferPage.closeAlert();
        moneyTransferPage.clickButtonGoToMoneyTransferList();

        moneyTransferPage.checkUrl('/list-of-transfers/incoming-bank-transfer');
        moneyTransferPage.checkCreateWithdraw(withdraw.beneficiary_name, ' Pending ', withdraw.amount );
        withdrawPage.rejectWithdraw();
    });

    it('Create withdraw, payment is commercial', () => {

        homePage.checkUrl('/en/overview');
        homePage.clickMenuCreateTransfer();
        cy.wait(2000);

        moneyTransferPage.checkUrl('/money-transfers');
        moneyTransferPage.enterTextInToInputIBAN(withdraw.IBAN);
        moneyTransferPage.enterTextInToInputBeneficiaryName(withdraw.beneficiary_name);
        moneyTransferPage.selectCountry();
        moneyTransferPage.enterTextInToInputCity('City');
        moneyTransferPage.enterTextInToInputRecipientAdress(withdraw.recipient_address);
        moneyTransferPage.enterTextInToInputBICCode('BIJORU66XXX');
        moneyTransferPage.enterTextInToInputBeneficiaryBank('Primatbank');
        moneyTransferPage.enterTextInToInputPurposePayment('Other');
        moneyTransferPage.chooseAndAttachDocument();
        moneyTransferPage.enterTextInToInputAmountToTransfer(withdraw.amount);
        moneyTransferPage.clickFieldAmountToBeCharged();
        moneyTransferPage.clickButtonProceed('Proceed');
        moneyTransferPage.clickButtonConfirmTransfer();
        cy.wait(1000);
        moneyTransferPage.enterAuthCode(merchant.authenticator);
        cy.wait(1000);
        moneyTransferPage.checkStatusWithdraw('Withdraw created');
        moneyTransferPage.closeAlert();
        moneyTransferPage.clickButtonGoToMoneyTransferList();

        moneyTransferPage.checkUrl('/list-of-transfers/outgoing-bank-transfer');
        moneyTransferPage.checkCreateWithdraw(withdraw.beneficiary_name, ' Pending ', withdraw.amount );
        withdrawPage.rejectWithdraw()
    });

})
