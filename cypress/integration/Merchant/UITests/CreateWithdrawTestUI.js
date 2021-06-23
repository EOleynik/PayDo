import loginPage from "../../../pages/LoginPage";
import moneyTransferPage from "../../../pages/MoneyTransferPage";
import withdraw from "../../../fixtures/Stage/withdraw.json";
import withdrawPage from "../../../pages/WithdrawPage";
import merchant from "../../../fixtures/Stage/merchant.json";
import homePage from "../../../pages/HomePage";
import merchants from "../../../fixtures/Prod/merchants.json";
import parentPage from "../../../pages/ParentPage";
import feen from "../../../fixtures/Stage/feen.json";

let admin;

describe('Withdraw suit ', () => {

    before(function fetchToken() {

         //Get token for admin

        cy.request('POST', 'https://admin.stage.paydo.com/v1/users/login', {
            email: feen.email,
            password: feen.pass,
        }).then((response) => {
            expect(response).property('status').to.equal(206);

            cy.request({
                method: 'POST',
                url: 'https://admin.stage.paydo.com/v1/users/login',
                headers: {
                    "x-2fa-code": parentPage.get2FACode(feen.authenticator)
                },
                body: {
                    email: feen.email,
                    password: feen.pass
                }
            }).its('headers')
                .then((res) => {
                    admin = res
                })
        })
    })

    beforeEach('', () => {
        loginPage.visit('/');
        loginPage.checkAuthorization(merchant.email, merchant.password, merchant.authenticator)
        //loginPage.loginWithCred(merchant.email, merchant.password);
       // loginPage.enter2FACode(merchant.authenticator);
        cy.wait(3000);
    });

    it('Create withdraw, payment is not commercial', () => {

        homePage.checkUrl('/en/overview');
        homePage.clickMenuCreateTransfer();
        cy.wait(5000);

        moneyTransferPage.checkUrl('/money-transfers');
        moneyTransferPage.enterTextInToInputIBAN(withdraw.IBAN);
        moneyTransferPage.enterTextInToInputBeneficiaryName(withdraw.beneficiary_name);
        moneyTransferPage.selectCountry();
        moneyTransferPage.enterTextInToInputCity('City');
        moneyTransferPage.enterTextInToInputRecipientAdress(withdraw.recipient_address);
        moneyTransferPage.enterTextInToInputBICCode('BIJORU66XXX');
        moneyTransferPage.enterTextInToInputBeneficiaryBank('Primatbank');
        moneyTransferPage.enterTextInToInputCityBeneficiaryBank('City Bank');
        moneyTransferPage.enterTextInToInputAddressBeneficiaryBank('Address Bank');
        moneyTransferPage.enterTextInToInputPurposePayment('Other');
        moneyTransferPage.InstallCheckboxPaymentNotCommercial();
        moneyTransferPage.enterTextInToInputAmountToTransfer(withdraw.amount);
        moneyTransferPage.clickFieldAmountToBeCharged();
        moneyTransferPage.clickButtonProceed('Proceed');
        cy.wait(3000);
        moneyTransferPage.clickButtonConfirmTransfer('Confirm transfer');
        cy.wait(1000);
        moneyTransferPage.enterAuthCode(merchant.authenticator);
        cy.wait(1000);
        moneyTransferPage.checkStatusWithdraw('Withdraw created');
        moneyTransferPage.closeAlert();
        moneyTransferPage.clickButtonGoToMoneyTransferList();

        moneyTransferPage.checkUrl('/list-of-transfers/outgoing-bank-transfer');
        moneyTransferPage.checkCreateWithdraw(withdraw.beneficiary_name, ' Pending ',
            withdraw.amount, merchant.main_currency );
        withdrawPage.rejectWithdraw(admin.token);
    });

    it.only('Create withdraw, payment is commercial', () => {

        homePage.checkUrl('/en/overview');
        homePage.clickMenuCreateTransfer();
        cy.wait(5000);

        moneyTransferPage.checkUrl('/money-transfers');
        moneyTransferPage.enterTextInToInputIBAN(withdraw.IBAN);
        moneyTransferPage.enterTextInToInputBeneficiaryName(withdraw.beneficiary_name);
        moneyTransferPage.selectCountry();
        moneyTransferPage.enterTextInToInputCity('City');
        moneyTransferPage.enterTextInToInputRecipientAdress(withdraw.recipient_address);
        moneyTransferPage.enterTextInToInputBICCode('BIJORU66XXX');
        moneyTransferPage.enterTextInToInputBeneficiaryBank('Primatbank');
        moneyTransferPage.enterTextInToInputCityBeneficiaryBank('City Bank');
        moneyTransferPage.enterTextInToInputAddressBeneficiaryBank('Address Bank');
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
        moneyTransferPage.checkCreateWithdraw(withdraw.beneficiary_name, ' Pending ',
            withdraw.amount, merchant.main_currency);
        withdrawPage.rejectWithdraw(admin.token)
    });

})
