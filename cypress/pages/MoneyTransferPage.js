import parentPage from "../pages/ParentPage"
import withdraw from "../fixtures/Stage/withdraw.json";
import merchant from "../fixtures/Stage/merchant.json";
import feen from "../fixtures/Stage/feen.json";
import betweenWallets from "../fixtures/Prod/betweenWallets.json";
import merchants from "../fixtures/Prod/merchants.json";

let no_res = '.no-result';
let country_name = '.mat-option-text';
let error = '.mat-error';
let info = '[class="block-info__text"]';
let preview = '[class="preview-item d-flex justify-content-between"]';
const sectionTitle = '.section-title';
const noVerificationBlock = '.no-verification-block';

class MoneyTransferPage {

    checkUrl(Url) {
        parentPage.checkUrl(Url)
    }

    checkPageTitle(title) {
        parentPage.isPageTitleExist(sectionTitle);
        parentPage.checkText(title, sectionTitle)
    }

    checkInfoText(checkText) {
        parentPage.isElementExist(noVerificationBlock);
        // parentPage.checkText(checkText, noVerificationBlock);
        cy.get(noVerificationBlock).find('p').invoke('text').should((text) => {
            expect(text).to.eq(checkText);
        })
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

    ConfirmationTransfer(button) {
        cy.contains(button).click();
    }

    clickButtonGoToMoneyTransferList() {
        parentPage.clickButton('Go to Money Transfers list')
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

    selectCountry(country_name) {
        cy.get('[class="withdraw-method__select"]').click();
        return cy.contains('span', country_name).click();
    }

    enterCountryAndCheckResult(country_name, blockCountry, message) {
        cy.get('[class="withdraw-method__select"]').click();
        for (let i = 0; i < country_name.length; i++) {
            cy.get('#mat-input-42').type(country_name[i])
            cy.wait(1000)
            for (let j = 0; j < blockCountry.length; j++) {
                if (parentPage.getCodeCountry(country_name[i]) === blockCountry[j]) {
                    this.checkMessageDisplay(message);
                } else {
                }
            }
            cy.get('#mat-input-42').clear()
        }
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

    enterTextInToInputAmountToTransfer(amount) {
        parentPage.getInput('amount').clear().type(amount);
    }

    clickFieldAmountToBeCharged() {
        cy.get('[class="transfer-item__view"]').click();
    }

    getButtonConfirmTransfer() {
        return cy.get('.step-preview > .py-4 > .mat-focus-indicator > .mat-button-wrapper');
    }

    confirmTransferWith2FA(key) {
        cy.get('[class="d-flex justify-content-center ng-star-inserted"]').click().type(parentPage.get2FACode(key));
    }

    chooseCurrencyWallet(wallet) {
        cy.get('[formcontrolname="wallet"]').click();
        cy.get('[class="mat-option-text"]').contains(wallet).click();
    }

    enterAuthCode(code) {
        cy.get('ng-otp-input').find('input[class="otp-input ng-pristine ng-valid ng-star-inserted ng-touched"]').
        clear().type(parentPage.get2FACode(code));
    }

    checkStatusWithdraw(message, part) {
        cy.get('.alert-text').invoke('text').should((text) => {
            let alert = (text);
            if (part && part.isSet) {
                expect(alert.toString()).to.eq(message);
            } else {
                let error = alert.split(':', part);
                expect(error.toString()).to.eq(message);
            }
        })
    }

    checkTransferBetweenWallets(type, sender, recipient, amount, currency, commission) {
        cy.get(':nth-child(1) > .cdk-column-type > .bold').invoke('text').should((text) => {
            expect(text).to.eq(type);
        });
        cy.get('tbody > :nth-child(1) > .cdk-column-sender').invoke('text').should((text) => {
            expect(text).to.eq(sender);
        });
        cy.get('tbody > :nth-child(1) > .cdk-column-recipient').invoke('text').should((text) => {
            expect(text).to.eq(" ID: " + recipient);
        });
        cy.get(':nth-child(1) > .text-right > .amount > .bold').invoke('text').should((text) => {
            expect(parseFloat(text).toFixed(2)).to.eq(parseFloat(amount + +commission).toFixed(2));
        });
    }

    checkCreateWithdraw(name, status, amount, currency) {
        cy.get(':nth-child(1) > .cdk-column-info > .payment-info > .payment-info__recipient').invoke('text').should((text) => {
            expect(text).to.eq(name);
        });
        cy.get(':nth-child(1) > .cdk-column-status > .mat-chip').invoke('text').should((text) => {
            expect(text).to.eq(status);
        });
        cy.get(':nth-child(1) > .text-right > .amount > .bold').invoke('text').should((text) => {
            expect(text).to.eq(amount + " " + currency);
        })
    }

    chooseAndAttachDocument() {
        for (let i = 0; i < withdraw.document_type.length; i++) {
            cy.get('withdraw-form-transfer-bank-docs mat-form-field').click();
            let doc_type = withdraw.document_type[i];
            cy.contains('span', doc_type).click();
            cy.wait(2000);
            parentPage.attachFile("2.jpeg");
            cy.wait(1000);
        }
    }

    createTransferAndCheckMath(admin, user, recipient) {
        // Get available balance "sender wallet"
        cy.request({
            method: 'GET',
            url: "https://account.stage.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
            headers: {
                token: user.token,
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
                    token: recipient.token,
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
                        token: user.token,
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
                            token: user.token,
                        },
                        body: {
                            "amount": betweenWallets.amount_transfer,
                            "currency": betweenWallets.recipient_wallet,
                            "email": "",
                            "paymentMethodIdentifier": betweenWallets.payment_method_ID,
                            "recipient": merchant.recipient,
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
                                token: user.token,
                                "x-2fa-code": parentPage.get2FACode(merchant.authenticator)
                            },
                            body: {
                                "amount": betweenWallets.amount_transfer,
                                "currency": betweenWallets.recipient_wallet,
                                "email": "",
                                "paymentMethodIdentifier": betweenWallets.payment_method_ID,
                                "recipient": merchant.recipient,
                                "startCurrency": betweenWallets.wallet,
                                "type": 1,
                                "userIdentifierTo": "",
                            }
                        }).then((response) => {
                            expect(response).property('status').to.equal(200);

                            // Get commission for transfer between wallets
                            cy.request({
                                method: 'GET',
                                url: "https://admin.stage.paydo.com/v1/instrument-settings/commissions/for-mid/13/155/204",
                                headers: {
                                    token: admin.token,
                                }
                            }).then((response) => {
                                expect(response).property('status').to.equal(200);
                                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                let fixcom = response.body.data.value[betweenWallets.wallet][0];
                                let perscom = response.body.data.value[betweenWallets.wallet][1];
                                let strateg = response.body.data.strategy;
                                let senderPart = response.body.data.payerPart;
                                let recipientPart = response.body.data.userPart;

                                //  Get available balance "from wallet" after
                                cy.request({
                                    method: 'GET',
                                    url: "https://account.stage.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
                                    headers: {
                                        token: user.token,
                                    }
                                }).then((response) => {
                                    expect(response).property('status').to.equal(200);
                                    expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                    let av_bal_from_wallet_after = response.body.data[betweenWallets.wallet].available.actual;

                                    expect(av_bal_from_wallet_after).to.eq(av_bal_from_wallet - (+betweenWallets.amount_transfer +
                                        +parentPage.calculationFinancialCommission(fixcom, perscom, strateg, betweenWallets.amount_transfer)));

                                    cy.log('av_bal_from_wallet' + ' ' + av_bal_from_wallet);
                                    cy.log('av_bal_from_wallet_after' + ' ' + av_bal_from_wallet_after);

                                    // Get available balance "recipient wallet" after
                                    cy.request({
                                        method: 'GET',
                                        url: "https://account.stage.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
                                        headers: {
                                            token: recipient.token,
                                        }
                                    }).then((response) => {
                                        expect(response).property('status').to.equal(200);
                                        expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                        let av_bal_to_wallet_after = response.body.data[betweenWallets.recipient_wallet].available.actual;

                                        expect(av_bal_to_wallet_after).to.eq(av_bal_to_wallet + Number(betweenWallets.amount_transfer));

                                        cy.log('av_bal_to_wallet' + ' ' + av_bal_to_wallet);
                                        cy.log('av_bal_to_wallet_after' + ' ' + av_bal_to_wallet_after);
                                        cy.log('sum' + ' ' + betweenWallets.amount_transfer);
                                    })
                                })
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
                        "bic": withdraw.BIC_code,
                        "name": withdraw.beneficiary_Bank,
                        "city": "LONDON",
                        "address": "180 TOTTENHAM COURT ROAD, 12 FLOOR 2"
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
                            "bic": withdraw.BIC_code,
                            "name": withdraw.beneficiary_Bank,
                            "city": "LONDON",
                            "address": "180 TOTTENHAM COURT ROAD, 12 FLOOR 2"
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
                        url: "https://admin.stage.paydo.com/v1/instrument-settings/commissions/custom/" + withdraw.payment_method_ID + "/" + merchant.bussiness_account,
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


    checkErrorDisplay(message) {
        cy.get('[class="transfer-main"]').click();
        cy.wait(1000);
        cy.get(error).invoke('text').should((text) => {
            let alert = (text);
            expect(alert.toString()).to.eq(message);
        });
    }

    checkDisplayInformationBlock(message,index) {
        cy.get(info).eq(index).invoke('text').should((text) => {
            let alert = (text);
            expect(alert.toString()).to.eq(message);
        });
    }

    checkDetailsOfTheRecipient(message, index, account_type) {
        cy.get(preview).eq(index).invoke('text').should((text) => {
            let alert = (text);
            if (account_type === 'business') {
                expect(alert.toString()).to.eq(message + " " + merchants.companyName_4 + " ");
            }
            else if (account_type === 'personal') {
                expect(alert.toString()).to.eq(message + " " + merchants.personalName_4 + " ");
            }
            else if (account_type === undefined) {
                expect(alert.toString()).to.eq(message)
            }
        });
    }

    checkMessageDisplay(cause, message) {
        cy.get(cause).eq(1).invoke('text').should((text) => {
            let alert = (text);
            expect(alert.toString()).to.eq(message);
        });
    }

    enterBICCodeAndCheckResult(admin, codes, message) {
        // Get list block Swift for PM and user
        cy.request({
            method: 'GET',
            url: 'https://admin.stage.paydo.com/v1/instrument-settings/restrictions/actual?operationType=6&paymentMethodIdentifier=1000005&userIdentifier=1812',
            headers: {
                token: admin.token
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);

            if (typeof response.body.data[0] !== 'undefined') {
                let blockSwift = response.body.data[0].value.swiftCodes;

                for (let i = 0; i < codes.length; i++) {
                    parentPage.getInput('bic').clear().type(codes[i]);
                    cy.wait(4000);
                    for (let j = 0; j < blockSwift.length; j++) {
                        if (codes[i] === blockSwift[j]) {
                            this.checkMessageDisplay(message);
                            break;
                        } else {
                        }
                    }
                }
            } else {
                cy.log('No blocked SWIFT codes');
            }
        })
    }


    enterReceiverCountryAndCheckResult(admin, beneficiary_country, message) {
        // Get list block Country for PM and user
        cy.request({
            method: 'GET',
            url: endpoints.restrictions_operationType_6 +
                "&paymentMethodIdentifier=1000005&userIdentifier=" + merchant.business_account,
            headers: {
                token: admin.token
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);

            if (typeof response.body.data[1] !== 'undefined') {
                let blockCountry = response.body.data[1].value.countries;

                cy.get('[class="withdraw-method__select"]').click();
                for (let i = 0; i < beneficiary_country.length; i++) {

                    cy.get('[placeholder="Search"]').clear().type(beneficiary_country[i])

                    for (let j = 0; j < blockCountry.length; j++) {

                        if (parentPage.getCodeCountry(beneficiary_country[i]) === blockCountry[j]) {
                            this.checkMessageDisplay(no_res, message);
                            break;
                        } else {
                            this.checkMessageDisplay(country_name, " " + beneficiary_country[i] + " ")
                            break;
                        }
                        cy.get('[placeholder="Search"]').clear()
                    }
                }
            }
        })
    }


    createTransferBetweenWallets(amount_transfer, wallet, sender_authenticator, recipient) {

        cy.readFile("cypress/fixtures/Prod/Helpers/sender_business_headers.json").then((data) => {
            let sender_token = data.token

            cy.readFile("cypress/fixtures/Prod/Helpers/recipient_personal_headers.json").then((data) => {
                let recipient_token = data.token

                cy.request({
                    method: 'POST',
                    url: 'https://account.paydo.com/v1/wallets/calculate-money/on-transfer-between-wallets',
                    headers: {
                        token: sender_token,
                    },
                    body: {
                        "amount": amount_transfer,
                        "currency": wallet,
                        "paymentMethodIdentifier": 204,
                        "type": 1
                    }
                }).then((response) => {
                    expect(response).property('status').to.equal(200);

                    // 2FA authentication
                    cy.request({
                        method: 'POST',
                        url: 'https://account.paydo.com/v1/wallets/move-money-between-wallets',
                        headers: {
                            token: recipient_token,
                        },
                        body: {
                            "amount": amount_transfer,
                            "currency": wallet,
                            "email": "",
                            "paymentMethodIdentifier": 204,
                            "recipient": recipient,
                            "startCurrency": wallet,
                            "type": 1,
                            "userIdentifierTo": "",
                        }
                    }).then((response) => {
                        expect(response).property('status').to.equal(206);

                        cy.request({
                            method: 'POST',
                            url: 'https://account.paydo.com/v1/wallets/move-money-between-wallets',
                            headers: {
                                token: sender_token,
                                "x-2fa-code": parentPage.get2FACode(sender_authenticator)
                            },
                            body: {
                                "amount": amount_transfer,
                                "currency": wallet,
                                "email": "",
                                "paymentMethodIdentifier": 204,
                                "recipient": recipient,
                                "startCurrency": wallet,
                                "type": 1,
                                "userIdentifierTo": "",
                            }
                        }).then((response) => {
                            expect(response).property('status').to.equal(200);
                        })
                    })
                })
            })
        })
    }

    createTransfer(amount_transfer, wallet, sender_authenticator, recipient) {

        cy.readFile("cypress/fixtures/Prod/Helpers/sender_business_headers.json").then((data) => {
            let sender_token = data.token

            cy.readFile("cypress/fixtures/Prod/Helpers/recipient_business_headers.json").then((data) => {
                let recipient_token = data.token

                cy.request({
                    method: 'POST',
                    url: 'https://account.paydo.com/v1/wallets/calculate-money/on-transfer-between-wallets',
                    headers: {
                        token: sender_token,
                    },
                    body: {
                        "amount": amount_transfer,
                        "currency": wallet,
                        "paymentMethodIdentifier": 204,
                        "type": 1
                    }
                }).then((response) => {
                    expect(response).property('status').to.equal(200);

                    // 2FA authentication
                    cy.request({
                        method: 'POST',
                        url: 'https://account.paydo.com/v1/wallets/move-money-between-wallets',
                        headers: {
                            token: recipient_token,
                        },
                        body: {
                            "amount": amount_transfer,
                            "currency": wallet,
                            "email": "",
                            "paymentMethodIdentifier": 204,
                            "recipient": recipient,
                            "startCurrency": wallet,
                            "type": 1,
                            "userIdentifierTo": "",
                        }
                    }).then((response) => {
                        expect(response).property('status').to.equal(206);

                        cy.request({
                            method: 'POST',
                            url: 'https://account.paydo.com/v1/wallets/move-money-between-wallets',
                            headers: {
                                token: sender_token,
                                "x-2fa-code": parentPage.get2FACode(sender_authenticator)
                            },
                            body: {
                                "amount": amount_transfer,
                                "currency": wallet,
                                "email": "",
                                "paymentMethodIdentifier": 204,
                                "recipient": recipient,
                                "startCurrency": wallet,
                                "type": 1,
                                "userIdentifierTo": "",
                            }
                        }).then((response) => {

                            //expect(response).property('status').to.equal(200);
                        })
                    })
                })
            })
        })
    }

    checkAvailableSenderWallet(user, account_type, wallet, amount_transfer) {

        cy.readFile("cypress/fixtures/Prod/Helpers/available " + account_type + " " + wallet + " " + user + ".json").then((data) => {
            let available_before = data.available;

            cy.readFile("cypress/fixtures/Prod/Helpers/" + user + "_" + account_type + "_headers.json").then((data) => {
                let tok = data.token

                cy.readFile("cypress/fixtures/Prod/Helpers/commission_for_13_type_" + wallet + ".json").then((data) => {
                    let fixcom = data.fixcom;
                    let perscom = data.perscom;
                    let strategy = data.strategy;

                    cy.request({
                        method: 'GET',
                        url: "https://account.paydo.com/v1/wallets/get-all-balances/" + merchants.main_currency,
                        headers: {
                            token: tok
                        }
                    }).then((response) => {
                        expect(response).property('status').to.equal(200);
                        expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                        let available_after = response.body.data[wallet].available.actual.toFixed(2)


                        let amountWithCommission = ((+amount_transfer + +parentPage.receiveCommission(fixcom, perscom, strategy))
                            .toFixed(2))

                        let result = (available_before - amountWithCommission).toFixed(2)

                        expect(Number.parseFloat(available_after).toFixed(2)).to.eq((available_before - amountWithCommission).toFixed(2))
                    })
                })
            })
        })
    }

    checkAvailableSenderWallet_2(user, account_type, amount_transfer) {

        //баланс отправителя до создания перевода
        cy.readFile("cypress/fixtures/Prod/Helpers/max available " + account_type + " " + user + ".json").then((data) => {
            let available_before = data.available;
            let wallet = data.wallet

            cy.readFile("cypress/fixtures/Prod/Helpers/admin_business_headers.json").then((data) => {
                let admin_tok = data.token

                cy.readFile("cypress/fixtures/Prod/Helpers/" + user + "_" + account_type + "_headers.json").then((data) => {
                    let tok = data.token

                    //проверка баланса отправителя в валюте перевода
                    cy.readFile("cypress/fixtures/Prod/Helpers/available " + account_type + " " + betweenWallets.wallet_null + " " + user + ".json").then((data) => {
                        let available = data.available

                        if (available > 0) {
                            amount_transfer = (+amount_transfer - available)
                        } else {
                        }

                        //сумма перевода + комиссия за перевод

                        cy.readFile("cypress/fixtures/Prod/Helpers/commission_for_13_type_" + betweenWallets.wallet_null + ".json").then((data) => {
                            let fixcom = data.fixcom;
                            let perscom = data.perscom;
                            let strategy = data.strategy;

                            let amountWithCommission = ((+amount_transfer + +parentPage.receiveCommission(fixcom, perscom, strategy)).toFixed(2))

                            //рейт для обмена в max wallet
                            cy.request({
                                method: 'GET',
                                url: "https://admin.paydo.com/v1/currencies/get-rates-for/" + betweenWallets.wallet_null,
                                headers: {
                                    token: admin_tok,
                                }
                            }).then((response) => {
                                expect(response).property('status').to.equal(200);
                                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                let ratesForExch = response.body.data.rates[wallet]

                                //переводим в валюту макс волета
                                let exch = (amountWithCommission * ratesForExch).toFixed(2)

                                //комиссия за обмен (Internal exchange commissions)
                                parentPage.getBaseCommission(exch, wallet, 10, 511)

                                cy.readFile("cypress/fixtures/Prod/Helpers/commission_for_10_type.json").then((data) => {
                                    let fixcom = data.fixcom
                                    let perscom = data.perscom
                                    let strategy = data.strategy

                                    let comForExch = parentPage.receiveCommission(fixcom, perscom, strategy)

                                    //общая сумма трансфера
                                    let amount = (+exch + +comForExch).toFixed(2)

                                    cy.request({
                                        method: 'GET',
                                        url: "https://account.paydo.com/v1/wallets/get-all-balances/" + merchants.main_currency,
                                        headers: {
                                            token: tok
                                        }
                                    }).then((response) => {
                                        expect(response).property('status').to.equal(200);
                                        expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                        let available_after = response.body.data[wallet].available.actual.toFixed(2)

                                        expect(Number.parseFloat(available_after).toFixed(2)).to.eq((available_before - amount).toFixed(2))
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    }

    logicMathCheckingBalances_1(amount, available_before, wallet, token) {

        // получаем баланс кошелька после трансфера
        cy.request({
            method: 'GET',
            url: "https://account.paydo.com/v1/wallets/get-all-balances/" + merchants.main_currency,
            headers: {
                token: token
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let available_wt_after = response.body.data[wallet].available.actual.toFixed(2)

            expect(Number.parseFloat(available_wt_after).toFixed(2)).to.eq((available_before - amount).toFixed(2))
        })
    }

    logicMathCheckingBalances_2(amountTransferWithCommission, available_before, sender_account_type, wallet_transfer, admin_token, sender_token) {

        // проверка достаточности средст на кошельках после recalculation
        // получаем рейт для пересчета балансов
        cy.request({
            method: 'GET',
            url: "https://admin.paydo.com/v1/currencies/get-rates-for/" + wallet_transfer,
            headers: {
                token: admin_token,
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let rate_0 = response.body.data.rates[betweenWallets.wallets[0]]
            let rate_1 = response.body.data.rates[betweenWallets.wallets[1]]
            let rate_2 = response.body.data.rates[betweenWallets.wallets[2]]
            let rate_3 = response.body.data.rates[betweenWallets.wallets[3]]

            // пишем в переменную масивом все available балансы мерчанта
            cy.readFile("cypress/fixtures/Prod/Helpers/all available " + sender_account_type + " balances " + "sender.json").then((data) => {
                let balances = data

                console.log('balances', balances)

                // пишем в переменную recalculation балансов
                let arrRecBal = [Number((data[0] / rate_0).toFixed(2)), Number((data[1] / rate_1).toFixed(2)),
                    Number((data[2] / rate_2).toFixed(2)), Number((data[3] / rate_3).toFixed(2))]

                console.log('arrRecBal', arrRecBal)

                // получаем сумму всех балансов после recalculation
                let sumAllBalances = parentPage.getSumElemArray(arrRecBal)

                cy.log('sumAllBalances', sumAllBalances)

                // amountTransferWithCommission + комиссия за конвертацию
                cy.log('amountTransferWithCommission + комиссия за конвертацию',
                    (+amountTransferWithCommission + (amountTransferWithCommission / 100 * 3.5)).toFixed(2))

                if(sumAllBalances >= (+amountTransferWithCommission + (amountTransferWithCommission / 100 * 3.5)).toFixed(2)) {

                    // получаем разницу между amountTransferWithCommission и балансом кошелька трансфера
                    let difference = (+amountTransferWithCommission - available_before).toFixed(2);

                    // получаем позицию и баланс кошелька с max available
                    let pos1 = parentPage.getIndex_max(arrRecBal)
                    let maxBal1 =arrRecBal[pos1]

                    //cy.log('amountTransferWithCommission / 100 * 3.5', amountTransferWithCommission / 100 * 3.5)

                    cy.log('difference', difference)
                    cy.log ('pos1', pos1)
                    cy.log ('maxBal1', maxBal1)

                    if(maxBal1 >= (+difference + (difference /100 *3.5)).toFixed(2)) {

                        // проверяем баланс wallet_for_transfer ( списало что было с wallet_for_transfer )
                        cy.request({
                            method: 'GET',
                            url: "https://account.paydo.com/v1/wallets/get-all-balances/" + merchants.main_currency,
                            headers: {
                                token: sender_token
                            }
                        }).then((response) => {
                            expect(response).property('status').to.equal(200);

                            expect(response.body.data[wallet_transfer].available.actual).to.eq(0);

                            // проверяем maxBall ( списало остаток )
                            this.logicMathCheckingBalances_2_1(wallet_transfer, difference, balances[pos1], betweenWallets.wallets[pos1], sender_token, admin_token)
                        })
                    }else {

                        // удаляем данный кошелек с массива
                        arrRecBal.splice(pos1, 1)
                        console.log(arrRecBal)

                        // получаем новые позицию и баланс кошелька с max available
                        let pos2 = parentPage.getIndex_max(arrRecBal)
                        let maxBal2 =arrRecBal[pos2]

                        cy.log ('pos2', pos2)
                        cy.log ('maxBal2', maxBal2)
                        cy.log ('difference - maxBal1', difference - (maxBal1 + (maxBal1 / 100 * 3.5)).toFixed(2))

                        if(maxBal2 >= (+difference - (maxBal1 + (maxBal1 / 100 * 3.5)).toFixed(2))) {
                            cy.log(' проверяем баланс max2')
                            this.logicMathCheckingBalances_2_2(pos1, maxBal1, pos2, maxBal2, difference, sender_token)
                        } else {
                            cy.log('other wallet')
                        }

                    }

                    //parentPage.getMaxAvailableBalanceAfterRecalculation('sender', sender_account_type, parentPage.getIndex_max(arrRecBal), balances)
                } else {
                    cy.log(' !!!!!!!!!!!!!!!!!! no mony !!!!!!!!!!!!!!!!!!!!')
                }






                //получаем баланс нужного кошелька
                //parentPage.getMaxAvailableBalanceAfterRecalculation('sender', sender_account_type, parentPage.getIndex_max(arrRecBal), balances)


                // получаем available баланс кошелька с max available
                // cy.readFile("cypress/fixtures/Prod/Helpers/max available " + sender_account_type + " sender.json").then((data) => {
                //     let max_available_before = data.available;
                //     let max_wallet = data.wallet
                //
                //     cy.log('difference', difference)
                //     cy.log('wallet this max balance', max_wallet);
                //     cy.log('max available before', max_available_before);
                //
                //     //рейт для обмена остатка c wallet_transfer в max_wallet
                //     cy.request({
                //         method: 'GET',
                //         url: "https://admin.paydo.com/v1/currencies/get-rates-for/" + wallet_transfer,
                //         headers: {
                //             token: admin_token,
                //         }
                //     }).then((response) => {
                //         expect(response).property('status').to.equal(200);
                //         expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                //         let ratesForExch = response.body.data.rates[max_wallet]
                //
                //         cy.log('ratesForExch', ratesForExch);
                //
                //         //переводим в валюту макс волета
                //         let exch = (+difference * ratesForExch).toFixed(2)
                //
                //         //комиссия за обмен (Internal exchange commissions)
                //         parentPage.getBaseCommission(exch, max_wallet, 10, 511)
                //
                //         cy.readFile("cypress/fixtures/Prod/Helpers/commission_for_10_type.json").then((data) => {
                //             let fixcom = data.fixcom
                //             let perscom = data.perscom
                //             let strategy = data.strategy
                //
                //             let comForExch = parentPage.receiveCommission(fixcom, perscom, strategy)
                //
                //             //общая сумма трансфера
                //             let amount = (+exch + +comForExch).toFixed(2)
                //
                //             // проверяем баланс wallet_for_transfer
                //             cy.request({
                //                 method: 'GET',
                //                 url: "https://account.paydo.com/v1/wallets/get-all-balances/" + merchants.main_currency,
                //                 headers: {
                //                     token: sender_token
                //                 }
                //             }).then((response) => {
                //                 expect(response).property('status').to.equal(200);
                //                 expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                //
                //                 expect(response.body.data[wallet_transfer].available.actual).to.eq(0);
                //
                //                 // проверяем баланс кошелька c max wallet
                //                 cy.request({
                //                     method: 'GET',
                //                     url: "https://account.paydo.com/v1/wallets/get-all-balances/" + merchants.main_currency,
                //                     headers: {
                //                         token: sender_token
                //                     }
                //                 }).then((response) => {
                //                     expect(response).property('status').to.equal(200);
                //                     expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                //                     let available_after = response.body.data[max_wallet].available.actual.toFixed(2)
                //
                //                     expect(Number.parseFloat(available_after).toFixed(2)).to.eq((max_available_before - amount).toFixed(2));
                //                 })
                            })
                        })
        //             })
        //         })
        //     })
        // })
    }

    logicMathCheckingBalances_3(amountTransferWithCommission, sender_account_type, wallet_transfer, admin_token, sender_token) {

        // получаем available баланс кошелька с max available
        cy.readFile("cypress/fixtures/Prod/Helpers/max available " + sender_account_type + " sender.json").then((data) => {
            let max_available_before = data.available;
            let max_wallet = data.wallet

            cy.log('wallet this max balance', max_wallet);
            cy.log('max available before', max_available_before);

            //рейт для обмена c wallet_transfer в max_wallet
            cy.request({
                method: 'GET',
                url: "https://admin.paydo.com/v1/currencies/get-rates-for/" + wallet_transfer,
                headers: {
                    token: admin_token,
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200);
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                let ratesForExch = response.body.data.rates[max_wallet]

                cy.log('ratesForExch', ratesForExch);

                //переводим в валюту макс волета
                let exch = (amountTransferWithCommission * ratesForExch).toFixed(2)

                //комиссия за обмен (Internal exchange commissions)
                parentPage.getBaseCommission(exch, max_wallet, 10, 511)

                cy.readFile("cypress/fixtures/Prod/Helpers/commission_for_10_type.json").then((data) => {
                    let fixcom = data.fixcom
                    let perscom = data.perscom
                    let strategy = data.strategy

                    let comForExch = parentPage.receiveCommission(fixcom, perscom, strategy)

                    //общая сумма трансфера
                    let amount = (+exch + +comForExch).toFixed(2)

                    // проверяем баланс кошелька c max wallet
                    cy.request({
                        method: 'GET',
                        url: "https://account.paydo.com/v1/wallets/get-all-balances/" + merchants.main_currency,
                        headers: {
                            token: sender_token
                        }
                    }).then((response) => {
                        expect(response).property('status').to.equal(200);
                        expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                        let available_after = response.body.data[max_wallet].available.actual.toFixed(2)

                        expect(Number.parseFloat(available_after).toFixed(2)).to.eq((+max_available_before - amount).
                        toFixed(2));
                    })
                })
            })
        })
    }

    checkAvailableSenderWallets(user, account_type, amount_transfer, wallet_transfer, admin_token, sender_token) {

        // получаем комиссию за трансфер
        cy.readFile("cypress/fixtures/Prod/Helpers/commission_for_13_type_" + wallet_transfer + ".json").then((data) => {
            let fixcom = data.fixcom;
            let perscom = data.perscom;
            let strategy = data.strategy;

            // amount_transfer + комиссия за трансфер
            let amountTransferWithCommission = ((+amount_transfer + parentPage.receiveCommission(fixcom, perscom, strategy)).toFixed(2));

            // проверка баланса кошелька для трансфера
            cy.readFile("cypress/fixtures/Prod/Helpers/available " + account_type + " " + wallet_transfer + " " + user + ".json").then((data) => {
                let available_wt_before = data.available;

                cy.log('available wt before', available_wt_before)
                cy.log('amount Transfer With Commission', amountTransferWithCommission)

                if (available_wt_before >= amountTransferWithCommission) {
                    this.logicMathCheckingBalances_1(amountTransferWithCommission, available_wt_before, wallet_transfer, sender_token)
                } else if ((available_wt_before < amountTransferWithCommission) && (available_wt_before > 0)) {
                    this.logicMathCheckingBalances_2(amountTransferWithCommission, available_wt_before, account_type, wallet_transfer, admin_token, sender_token)
                } else if (available_wt_before === 0) {
                    this.logicMathCheckingBalances_3(amountTransferWithCommission, account_type, wallet_transfer, admin_token, sender_token)
                }


            })
        })

    }







        // получаем available баланс выбранного кошелька и сам кошелек
        // cy.readFile("cypress/fixtures/Prod/Helpers/max available " + account_type + " " + user + ".json").then((data) => {
        //     let available_before = data.available;
        //     let wallet = data.wallet
        //
        //     //проверка баланса отправителя в выбранной валюте
        //     cy.readFile("cypress/fixtures/Prod/Helpers/available " + account_type + " " + wallet + " " + user + ".json").then((data) => {
        //         let available = data.available
        //     })
        // })

           // })

    checkAvailableRecipientWallet(user, account_type, wallet, amount_transfer) {

        cy.readFile("cypress/fixtures/Prod/Helpers/available " + account_type + " " + wallet + " " + user + ".json").then((data) => {
            let available_before = data.available;

            cy.readFile("cypress/fixtures/Prod/Helpers/" + user + "_" + account_type + "_headers.json").then((data) => {
                let tok = data.token

                cy.request({
                    method: 'GET',
                    url: "https://account.paydo.com/v1/wallets/get-all-balances/" + merchants.main_currency,
                    headers: {
                        token: tok
                    }
                }).then((response) => {
                    expect(response).property('status').to.equal(200);
                    expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                    let available_after = response.body.data[wallet].available.actual.toString()
                    expect(Number.parseFloat(available_after).toFixed(2)).to.eq((+available_before + +amount_transfer).toFixed(2))
                })
            })
        })
    }

    createExchange(user, account_type, amount, from, to) {

        cy.readFile("cypress/fixtures/Prod/Helpers/" + user + "_" + account_type + "_headers.json").then((data) => {
            let tok = data.token

            cy.request({
                method: 'POST',
                url: 'https://account.paydo.com/v1/wallets/exchange',
                headers: {
                    token: tok,
                },
                body: {
                    "amount": amount,
                    "currency": from,
                    "destinationCurrency": to
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200);
            })
        })
    }

    checkAvailableBalanceToWallet(user, account_type, wallet, amount_exchange) {

        cy.readFile("cypress/fixtures/Prod/Helpers/available " + account_type + " " + wallet + " " + user + ".json").then((data) => {
            let balance = data.available

            cy.readFile("cypress/fixtures/Prod/Helpers/" + user + "_" + account_type + "_headers.json").then((data) => {
                let token = data.token

                cy.readFile("cypress/fixtures/Prod/Helpers/commission_for_10_type.json").then((data) => {
                    let fixcom = data.fixcom;
                    let perscom = data.perscom;
                    let strategy = data.strategy;

                    cy.readFile("cypress/fixtures/Prod/Helpers/rate_exchange_" + wallet + ".json").then((data) => {
                        let rates = data.rates
                        let amount_after_exchange = (amount_exchange * rates) - parentPage.receiveCommission(fixcom,
                            perscom, strategy)

                        cy.request({
                            method: 'GET',
                            url: "https://account.paydo.com/v1/wallets/get-all-balances/" + merchants.main_currency,
                            headers: {
                                token: token
                            }
                        }).then((response) => {
                            expect(response).property('status').to.equal(200);
                            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                            expect(parseFloat(response.body.data[wallet].available.actual, 10).toFixed(2)).to.equal
                            ((+balance + amount_after_exchange).toFixed(2))
                        })
                    })
                })
            })
        })
    }

    checkAvailableBalanceFromWallet(user, account_type, wallet, amount_exchange) {

        cy.readFile("cypress/fixtures/Prod/Helpers/available " + account_type + " " + wallet + " " + user + ".json").then((data) => {
            let balance = data.available

            cy.readFile("cypress/fixtures/Prod/Helpers/" + user + "_" + account_type + "_headers.json").then((data) => {
                let token = data.token

                cy.request({
                    method: 'GET',
                    url: "https://account.paydo.com/v1/wallets/get-all-balances/" + merchants.main_currency,
                    headers: {
                        token: token
                    }
                }).then((response) => {
                    expect(response).property('status').to.equal(200);
                    expect(response.body).property('data').to.not.be.oneOf([null, ""])
                    expect((response.body.data[wallet].available.actual).toFixed(2)).to.equal((balance - amount_exchange).toFixed(2))
                })
            })
        })
    }

    chooseAccountType(type) {
        parentPage.chooseAccountType(type);
    }

    checkButtonStatus(name, status) {
        parentPage.getButtonStatus(name, status)
    }

    checkButtonExist(button_name) {
        parentPage.isButtonExist(button_name);
    }

    checkErrorAlert(message) {
        cy.get('[class="transfer-main"]').click();
        cy.get('.alert-text').invoke('text').should((text) => {
            let alert = (text);
            expect(alert).to.equal(message)
        })
    }

    closeErrorAlert() {
        parentPage.closeAlert()
    }


    getAvailableBalanceWalletAfterRecalculation(wallet, user, account_type) {

        // получаем рейт для пересчета балансов
        cy.readFile("cypress/fixtures/Prod/Helpers/admin_business_headers.json").then((data) => {
            let tok = data.token

            // рейт для 1 кошелька
            cy.request({
                method: 'GET',
                url: "https://admin.paydo.com/v1/currencies/get-rates-for/" + betweenWallets.wallets[0],
                headers: {
                    token: tok,
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200);
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                let rate_0 = response.body.data.rates[wallet]

                //рейт для 2 кошелька
                cy.request({
                    method: 'GET',
                    url: "https://admin.paydo.com/v1/currencies/get-rates-for/" + betweenWallets.wallets[1],
                    headers: {
                        token: tok,
                    }
                }).then((response) => {
                    expect(response).property('status').to.equal(200);
                    expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                    let rate_1 = response.body.data.rates[wallet]

                    //рейт для 3 кошелька
                    cy.request({
                        method: 'GET',
                        url: "https://admin.paydo.com/v1/currencies/get-rates-for/" + betweenWallets.wallets[2],
                        headers: {
                            token: tok,
                        }
                    }).then((response) => {
                        expect(response).property('status').to.equal(200);
                        expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                        let rate_2 = response.body.data.rates[wallet]

                        //рейт для 4 кошелька
                        cy.request({
                            method: 'GET',
                            url: "https://admin.paydo.com/v1/currencies/get-rates-for/" + betweenWallets.wallets[3],
                            headers: {
                                token: tok,
                            }
                        }).then((response) => {
                            expect(response).property('status').to.equal(200);
                            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                            let rate_3 = response.body.data.rates[wallet]

                            // пишем в переменную масивом все балансы мерчанта
                            cy.readFile("cypress/fixtures/Prod/Helpers/all available " + account_type + " balances " + user + ".json").then((data) => {
                                let balances = data

                                // пишем в переменную рекалькулэйт балансов
                                let arrRecBal = [(data[0] * rate_0).toFixed(2), (data[1] * rate_1).toFixed(2),
                                    (data[2] * rate_2).toFixed(2), (data[3] * rate_3).toFixed(2)]

                                //получаем баланс нужного кошелька
                                parentPage.getMaxAvailableBalanceAfterRecalculation('sender', account_type, parentPage.getIndex_max(arrRecBal), balances)

                            })
                        })
                    })
                })
            })
        })
    }


    getMaxAvailableBalanceAfterRecalculation(wallet, user, account_type, admin_token) {

        // получаем рейт для пересчета балансов
            cy.request({
                method: 'GET',
                url: "https://admin.paydo.com/v1/currencies/get-rates-for/" + wallet,
                headers: {
                    token: admin_token,
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200);
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                let rate_0 = response.body.data.rates[betweenWallets.wallets[0]]
                let rate_1 = response.body.data.rates[betweenWallets.wallets[1]]
                let rate_2 = response.body.data.rates[betweenWallets.wallets[2]]
                let rate_3 = response.body.data.rates[betweenWallets.wallets[3]]

                // пишем в переменную масивом все балансы мерчанта
                cy.readFile("cypress/fixtures/Prod/Helpers/all available " + account_type + " balances " + user + ".json").then((data) => {
                    let balances = data

                    // пишем в переменную recalculation балансов
                    let arrRecBal = [(data[0] / rate_0).toFixed(2), (data[1] / rate_1).toFixed(2),
                        (data[2] / rate_2).toFixed(2), (data[3] / rate_3).toFixed(2)]

                    //получаем баланс нужного кошелька
                    parentPage.getMaxAvailableBalanceAfterRecalculation('sender', account_type, parentPage.getIndex_max(arrRecBal), balances)
                })
            })
    }


    logicMathCheckingBalances_2_1(wallet_transfer, difference, maxBal1, maxWallet, sender_token, admin_token) {

        //рейт для обмена остатка c wallet_transfer в max_wallet
            cy.request({
                method: 'GET',
                url: "https://admin.paydo.com/v1/currencies/get-rates-for/" + wallet_transfer,
                headers: {
                    token: admin_token,
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200);
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                let ratesForExch = response.body.data.rates[maxWallet]

                cy.log('ratesForExch', ratesForExch);

                //переводим в валюту макс волета
                let exch = (+difference * ratesForExch).toFixed(2)

                //комиссия за обмен (Internal exchange commissions)
                parentPage.getBaseCommission(exch, maxWallet, 10, 511)

                cy.readFile("cypress/fixtures/Prod/Helpers/commission_for_10_type.json").then((data) => {
                    let fixcom = data.fixcom
                    let perscom = data.perscom
                    let strategy = data.strategy

                    let comForExch = parentPage.receiveCommission(fixcom, perscom, strategy)

                    //общая сумма трансфера
                    let amount = (+exch + +comForExch).toFixed(2)

                    // проверяем баланс кошелька  max wallet
                    cy.request({
                        method: 'GET',
                        url: "https://account.paydo.com/v1/wallets/get-all-balances/" + merchants.main_currency,
                        headers: {
                            token: sender_token
                        }
                    }).then((response) => {
                        expect(response).property('status').to.equal(200);
                        expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                        let available_after = response.body.data[maxWallet].available.actual.toFixed(2)

                        expect(Number.parseFloat(available_after).toFixed(2)).to.eq((maxBal1 - amount).toFixed(2));
                    })
                })
            })
    }

    logicMathCheckingBalances_2_2() {

    }

    getRandomAccountType(min, max) {
       return parentPage.getRandomAccountType(min, max)
    }

    getRandomAccountType2(min, max) {
        return parentPage.getRandomAccountType2(min, max)
    }


}

export default new MoneyTransferPage();