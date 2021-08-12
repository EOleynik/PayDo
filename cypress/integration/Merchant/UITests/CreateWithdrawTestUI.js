import loginPage from "../../../pages/LoginPage";
import moneyTransferPage from "../../../pages/MoneyTransferPage";
import withdraw from "../../../fixtures/Stage/withdraw.json";
import withdrawPage from "../../../pages/WithdrawPage";
import merchant from "../../../fixtures/Stage/merchant.json";
import homePage from "../../../pages/HomePage";
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
        cy.wait(6000);
        homePage.checkUrl('/en/overview');
    });

    it('Create withdraw, payment is not commercial', () => {

        homePage.clickMenuCreateTransfer();
        cy.wait(5000);

        moneyTransferPage.checkUrl('/money-transfers');
        moneyTransferPage.enterTextInToInputIBAN(withdraw.IBAN);
        moneyTransferPage.enterTextInToInputBeneficiaryName(withdraw.beneficiary_name);
        moneyTransferPage.selectCountry('Algeria');
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
        cy.wait(3000);
        moneyTransferPage.enterAuthCode(merchant.authenticator);
        cy.wait(3000);
        moneyTransferPage.checkStatusWithdraw('Withdraw created');
        moneyTransferPage.closeAlert();
        moneyTransferPage.clickButtonGoToMoneyTransferList();

        moneyTransferPage.checkUrl('/list-of-transfers/outgoing-bank-transfer');
        moneyTransferPage.checkCreateWithdraw(withdraw.beneficiary_name, ' Pending ',
            withdraw.amount, merchant.main_currency );
        withdrawPage.rejectWithdraw(admin.token);
    });

    it('Create withdraw, payment is commercial', () => {

        homePage.clickMenuCreateTransfer();
        cy.wait(5000);

        moneyTransferPage.checkUrl('/money-transfers');
        moneyTransferPage.enterTextInToInputIBAN(withdraw.IBAN);
        moneyTransferPage.enterTextInToInputBeneficiaryName(withdraw.beneficiary_name);
        moneyTransferPage.selectCountry('Algeria');
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
        cy.wait(3000);
        moneyTransferPage.enterAuthCode(merchant.authenticator);
        cy.wait(3000);
        moneyTransferPage.checkStatusWithdraw('Withdraw created');
        moneyTransferPage.closeAlert();
        moneyTransferPage.clickButtonGoToMoneyTransferList();

        moneyTransferPage.checkUrl('/list-of-transfers/outgoing-bank-transfer');
        moneyTransferPage.checkCreateWithdraw(withdraw.beneficiary_name, ' Pending ',
            withdraw.amount, merchant.main_currency);
        withdrawPage.rejectWithdraw(admin.token)
    });

    it('Create a withdrawal, there are not enough funds in the account', () => {

        homePage.clickMenuCreateTransfer();
        cy.wait(5000);

        moneyTransferPage.checkUrl('/money-transfers');
        moneyTransferPage.enterTextInToInputIBAN(withdraw.IBAN);
        moneyTransferPage.enterTextInToInputBeneficiaryName(withdraw.beneficiary_name);
        moneyTransferPage.selectCountry('Algeria');
        moneyTransferPage.enterTextInToInputCity('City');
        moneyTransferPage.enterTextInToInputRecipientAdress(withdraw.recipient_address);
        moneyTransferPage.enterTextInToInputBICCode('BIJORU66XXX');
        moneyTransferPage.enterTextInToInputBeneficiaryBank('Primatbank');
        moneyTransferPage.enterTextInToInputCityBeneficiaryBank('City Bank');
        moneyTransferPage.enterTextInToInputAddressBeneficiaryBank('Address Bank');
        moneyTransferPage.enterTextInToInputPurposePayment('Other');
        moneyTransferPage.InstallCheckboxPaymentNotCommercial();
        moneyTransferPage.enterTextInToInputAmountToTransfer(1000000);
        moneyTransferPage.clickFieldAmountToBeCharged();
        moneyTransferPage.checkErrorDisplay('Insufficient funds');
    })

    it('Create a withdrawal with Blocked swift codes', () => {

        homePage.clickMenuCreateTransfer();
        cy.wait(5000);

        moneyTransferPage.enterBICCodeAndCheckResult(admin, withdraw.BIC_code, withdraw.message_blockSwift)
    })

    it.only('Create a withdraw with Blocked receiver countries', () => {

        cy.wait(7000)
        homePage.clickMenuCreateTransfer();
        cy.wait(9000);

        moneyTransferPage.enterReceiverCountryAndCheckResult(admin, withdraw.beneficiary_countries, withdraw.message)
    })


    })
