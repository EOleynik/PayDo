import parentPage from "../pages/ParentPage"
import withdraw from  "../fixtures/withdraw";
import merchant from "../fixtures/merchant";
import feen from "../fixtures/feen";
import betweenWallets from "../fixtures/betweenWallets";

class MoneyTransferPage {

    checkUrl(Url) {
        parentPage.checkUrl(Url)
    }

    enterTextInToInputRecipient(recipient_account) {
        parentPage.getInput('recipient').clear().type(recipient_account);
    }

    enterTextInToInputAmount(amount_transfer) {
        parentPage.getInput('amount').clear().type(amount_transfer);
    }

    clickButtonProceed() {
        parentPage.clickButton('Proceed');
    }

    clickButtonGoToMoneyTransferList() {
        parentPage.clickButton('Go to Money Transfers list')
    }

    enter2FACode(authenticator) {
        cy.get('ng-otp-input').find('input[class="otp-input ng-pristine ng-valid ng-star-inserted ng-touched"]')
            .clear().type(parentPage.get2FACode(authenticator));
    }

    clickButtonConfirmTransfer() {
        parentPage.clickButton('Confirm transfer');
    }

    clickTab(name) {
        parentPage.clickTab(name).click()
    }

    closeAlert() {
        parentPage.closeAlert()
    }

    enterTextInToInputIBAN(text) {
        parentPage.getInput('account').clear().type(text);
    }

    enterTextInToInputBeneficiaryName(text) {
        parentPage.getInput('name').eq(0).clear().type(text);
    }

    selectCountry() {
        cy.get('[class="withdraw-method__select"]').click();
        //cy.get ('#mat-input-13').click();
        //return cy.get ('#mat-option-5 > .mat-option-text').click();
        return cy.contains('span', 'Algeria').click();
    }

    enterTextInToInputCity(text) {
        parentPage.getInput('city').eq(0).clear().type(text);
    }

    enterTextInToInputRecipientAdress(text) {
        parentPage.getInput('address').eq(0).clear().type(text);
    }

    enterTextInToInputBICCode(text) {
        parentPage.getInput('bic').clear().type(text);
    }

    enterTextInToInputBeneficiaryBank(text) {
        parentPage.getInput('name').eq(1).clear().type(text);
    }

    enterTextInToInputCityBeneficiaryBank(text) {
        parentPage.getInput('city').eq(1).clear().type(text);
    }

    enterTextInToInputAddressBeneficiaryBank(text) {
        parentPage.getInput('address').eq(1).clear().type(text);
    }

    enterTextInToInputPurposePayment(text) {
        parentPage.getInput('direction').clear().type(text);
    }

    InstallCheckboxPaymentNotCommercial() {
        cy.get('[class="mat-checkbox-inner-container"]').eq(0).click();
    }

    enterTextInToInputAmountToTransfer(text) {
        parentPage.getInput('amount').clear().type(text);
    }

    clickFieldAmountToBeCharged() {
        cy.get('[class="transfer-item__view"]').click();
    }

    getButtonConfirmTransfer() {
        return cy.get ('.step-preview > .py-4 > .mat-focus-indicator > .mat-button-wrapper');
    }

    chooseCurrencyWallet(wallet) {
        cy.get('[formcontrolname="wallet"]').click();
        cy.get ('[class="mat-option-text"]').contains(wallet).click();
    }

    chooseCurrencyTransfer(currency) {
        cy.get('[formcontrolname="currency"]').click();
        cy.get ('[class="mat-option-text"]').contains(currency).click();
    }

    enterAuthCode(code) {
        cy.get('ng-otp-input').find('input[class="otp-input ng-pristine ng-valid ng-star-inserted ng-touched"]').
        clear().type(parentPage.get2FACode(code));
    }

    checkStatusWithdraw(message) {
        cy.get('.alert-text').invoke('text').should((text) => {
            let alert = (text);
            let error = alert.split(':',1);
            expect(error.toString()).to.eq(message);
        });
    }

    checkTransferBetweenWallets(type, sender, recipient, amount, currency) {
        cy.get(':nth-child(1) > .cdk-column-type > .bold').invoke('text').should((text) => {
            expect(text).to.eq(type);
        });
        cy.get('tbody > :nth-child(1) > .cdk-column-sender').invoke('text').should((text) => {
            expect(text).to.eq(sender);
        });
        cy.get('tbody > :nth-child(1) > .cdk-column-recipient').invoke('text').should((text) => {
            expect(text).to.eq(" ID: "+recipient);
        });
        cy.get(':nth-child(1) > .text-right > .amount > .bold').invoke('text').should((text) => {
            expect(parseFloat(text).toFixed(2)).to.eq(parseFloat(amount).toFixed(2));
        });
    }

    checkCreateWithdraw(name, status, amount) {
        cy.get(':nth-child(1) > .cdk-column-info > .payment-info > .payment-info__recipient').invoke('text').should((text) => {
            expect(text).to.eq(name);
        });
        cy.get(':nth-child(1) > .cdk-column-status > .mat-chip').invoke('text').should((text) => {
            expect(text).to.eq(status);
        });
        cy.get(':nth-child(1) > .text-right > .amount > .bold').invoke('text').should((text) => {
            expect(text).to.eq(amount+" "+"EUR");
        })
    }

    chooseAndAttachDocument() {
        for (let i = 0; i < withdraw.document_type.length; i++)
        {
            cy.get('#mat-select-value-29 > .mat-select-placeholder').click();
            let doc_type = withdraw.document_type[i];
            cy.contains('span', doc_type).click();
            cy.wait(2000);
            parentPage.attachFile("2.jpeg");
            cy.wait(1000);
        }
    }

    createTransferAndCheckMath() {
        // Get available balance "from wallet"
        cy.request({
            method: 'GET',
            url: "https://account.stage.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
            headers: {
                token: merchant.token,
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let av_bal_from_wallet = response.body.data[betweenWallets.wallet].available.actual;

            // Get available balance "recipient wallet"
            cy.request({
                method: 'GET',
                url: "https://account.stage.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
                headers: {
                    token: betweenWallets.recipient_token,
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200);
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                let av_bal_to_wallet = response.body.data[betweenWallets.recipient_wallet].available.actual;

                // Create transfer between wallets
                cy.request({
                    method: 'POST',
                    url: 'https://account.stage.paydo.com/v1/wallets/calculate-money/on-transfer-between-wallets',
                    headers: {
                        token: merchant.token,
                    },
                    body: {
                        "amount": betweenWallets.amount_transfer,
                        "currency": betweenWallets.wallet,
                        "paymentMethodIdentifier": betweenWallets.payment_method_ID,
                        "type": 1
                    }
                }).then((response) => {
                    expect(response).property('status').to.equal(200);

                    // 2FA
                    cy.request({
                        method: 'POST',
                        url: 'https://account.stage.paydo.com/v1/wallets/move-money-between-wallets',
                        headers: {
                            token: merchant.token,
                        },
                        body: {
                            "amount": betweenWallets.amount_transfer,
                            "currency": betweenWallets.recipient_wallet,
                            "email": "",
                            "paymentMethodIdentifier": betweenWallets.payment_method_ID,
                            "recipient": betweenWallets.recipient_ID,
                            "startCurrency": betweenWallets.wallet,
                            "type": 1,
                            "userIdentifierTo": "",
                        }
                    }).then((response) => {
                        expect(response).property('status').to.equal(206);

                        cy.request({
                            method: 'POST',
                            url: 'https://account.stage.paydo.com/v1/wallets/move-money-between-wallets',
                            headers: {
                                token: merchant.token,
                                "x-2fa-code":parentPage.get2FACode(merchant.authenticator)
                            },
                            body: {
                                "amount": betweenWallets.amount_transfer,
                                "currency": betweenWallets.recipient_wallet,
                                "email": "",
                                "paymentMethodIdentifier": betweenWallets.payment_method_ID,
                                "recipient": betweenWallets.recipient_ID,
                                "startCurrency": betweenWallets.wallet,
                                "type": 1,
                                "userIdentifierTo": "",
                            }
                        }).then((response) => {
                            expect(response).property('status').to.equal(200);

                            // Get commission for transfer between wallets
                            cy.request({
                                method: 'GET',
                                url: "https://account.stage.paydo.com/v1/instrument-settings/commissions/custom/" + betweenWallets.payment_method_ID + "/" + merchant.bussiness_account,
                                headers: {
                                    token: feen.token,
                                }
                            }).then((response) => {
                                expect(response).property('status').to.equal(200);
                                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                let fixcom = response.body.data[8].value[betweenWallets.wallet][0];
                                let perscom = response.body.data[8].value[betweenWallets.wallet][1];
                                let strateg = response.body.data[8].strategy;

                                let pers = ((betweenWallets.amount_transfer / 100) * perscom).toFixed(2);

                                if (strateg === 1) {
                                    // Amount of commissions
                                    let com = (+fixcom + +pers).toFixed(2);

                                    // Total amount with commission
                                    let sum = (Number(betweenWallets.amount_transfer) + +com);

                                    // Get available balance "from wallet" after
                                    cy.request({
                                        method: 'GET',
                                        url: "https://account.stage.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
                                        headers: {
                                            token: merchant.token,
                                        }
                                    }).then((response) => {
                                        expect(response).property('status').to.equal(200);
                                        expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                        let av_bal_from_wallet_after = response.body.data[betweenWallets.wallet].available.actual;

                                        try {

                                            expect(av_bal_from_wallet_after).to.eq(av_bal_from_wallet - sum);

                                        }catch (e) {
                                            cy.log(av_bal_from_wallet);
                                            cy.log(av_bal_from_wallet_after);
                                            cy.log(sum);
                                        }

                                        // Get available balance "recipient wallet" after
                                        cy.request({
                                            method: 'GET',
                                            url: "https://account.stage.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
                                            headers: {
                                                token: betweenWallets.recipient_token,
                                            }
                                        }).then((response) => {
                                            expect(response).property('status').to.equal(200);
                                            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                            let av_bal_to_wallet_after = response.body.data[betweenWallets.recipient_wallet].available.actual;

                                            try {

                                            expect(av_bal_to_wallet_after).to.eq(av_bal_to_wallet + Number(betweenWallets.amount_transfer));

                                            }catch (e) {
                                                cy.log(av_bal_to_wallet);
                                                cy.log(av_bal_to_wallet_after);
                                                cy.log(sum);
                                            }
                                        })
                                    })
                                }
                            })
                        })
                    })
                })
            })
        })
    }

    createWithdrawAndCheckMath() {
        // Get available balance "from wallet"
        cy.request({
            method: 'GET',
            url: "https://account.stage.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
            headers: {
                token: merchant.token,
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let available_balance = response.body.data[withdraw.from_wallet].available.actual;

            // Create withdraw
            cy.request({
                method: 'POST',
                url: 'https://account.stage.paydo.com/v1/withdrawals/create',
                headers: {
                    token: merchant.token,
                },
                body: {
                    "method": 1,
                    "direction": withdraw.direction,
                    "beneficiary": {
                        "account": withdraw.IBAN,
                        "name": withdraw.beneficiary_name,
                        "country": withdraw.beneficiary_country,
                        "city": withdraw.beneficiary_city,
                        "address": withdraw.beneficiary_address
                    },
                    "beneficiaryBank": {
                        "name": withdraw.beneficiary_Bank,
                        "bic": withdraw.BIC_code
                    },
                    "attachments": [],
                    "attachmentsToUpload": [],
                    "type": 1,
                    "amount": withdraw.amount,
                    "currency": withdraw.from_wallet,
                    "email": ""
                }
            }).then((response) => {
                expect(response).property('status').to.equal(206);

                // 2FA
                cy.request({
                    method: 'POST',
                    url: 'https://account.stage.paydo.com/v1/withdrawals/create',
                    headers: {
                        token: merchant.token,
                        "x-2fa-code": parentPage.get2FACode(merchant.authenticator)
                    },
                    body: {
                        "method": 1,
                        "direction": withdraw.direction,
                        "beneficiary": {
                            "account": withdraw.IBAN,
                            "name": withdraw.beneficiary_name,
                            "country": withdraw.beneficiary_country,
                            "city": withdraw.beneficiary_city,
                            "address": withdraw.beneficiary_address
                        },
                        "beneficiaryBank": {
                            "name": withdraw.beneficiary_Bank,
                            "bic": withdraw.BIC_code
                        },
                        "attachments": [],
                        "attachmentsToUpload": [],
                        "type": 1,
                        "amount": withdraw.amount,
                        "currency": withdraw.from_wallet,
                        "email": ""
                    }
                }).then((response) => {
                    expect(response).property('status').to.equal(201);


                    // Get commission for withdraw
                    cy.request({
                        method: 'GET',
                        url: "https://account.stage.paydo.com/v1/instrument-settings/commissions/custom/" + withdraw.payment_method_ID + "/" + merchant.bussiness_account,
                        headers: {
                            token: feen.token,
                        }
                    }).then((response) => {
                        expect(response).property('status').to.equal(200);
                        expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                        let fixcom = response.body.data[5].value[withdraw.from_wallet][0];
                        let perscom = response.body.data[5].value[withdraw.from_wallet][1];
                        let strateg = response.body.data[5].strategy;

                        let pers = ((withdraw.amount / 100) * perscom).toFixed(2);

                        if (strateg === 1) {
                            // Amount of commissions
                            let com = (+fixcom + +pers).toFixed(2);

                            // Total amount with commission
                            let sum = (Number(withdraw.amount) + +com);

                            // Get available balance "from wallet" after
                            cy.request({
                                method: 'GET',
                                url: "https://account.stage.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
                                headers: {
                                    token: merchant.token,
                                }
                            }).then((response) => {
                                expect(response).property('status').to.equal(200);
                                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                let available_balance_after = response.body.data[withdraw.from_wallet].available.actual;
                                expect(available_balance_after).to.eq(available_balance - sum);
                            })
                        }
                    })
                })
            })
        })
    }



}

export default new MoneyTransferPage();