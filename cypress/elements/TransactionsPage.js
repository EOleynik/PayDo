import merchant from "../fixtures/merchant.json"
import feen from "../fixtures/feen.json"

class TransactionsPage {


    getAmountTransaction() {
        const amount = cy.get('[class="bold price-align"]').first();
    }

    getCheck() {
        const amount1 = cy.get(10 - 0.35 - 0.6)

    }


    checkAmountUiGbpAll(payAmount, payCurrency) {

        // Get percent commission
        cy.request({
            method: 'GET',
            url: "https://app.stage.paydo.com/v1/instrument-settings/commissions/custom/300/"+merchant.bussiness_account,
            headers: {
                token: feen.token,
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200)
            expect(response.body).property('data').to.not.be.oneOf([null, ""])
            let perscom = response.body.data[7].value.GBP[1];
            perscom = (perscom).toFixed(2)

            // Get fixed commission
            cy.request({
                method: 'GET',
                url: "https://app.stage.paydo.com/v1/instrument-settings/commissions/custom/300/"+merchant.bussiness_account,
                headers: {
                    token: feen.token,
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200)
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                let fixcom = response.body.data[7].value.GBP[0];
                fixcom = (fixcom).toFixed(2)

                cy.wait(3000)

                //Check status tranzaction
                cy.get('[class="mat-chip mat-focus-indicator mat-primary mat-standard-chip status_2"]').eq(0).invoke('text').should((text) => {
                    expect(text).to.eq(' Accepted ')
                })

                //Сalculation formula & Check Amount
                cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                    expect(text).to.eq((payAmount - fixcom - (payAmount / 100 * perscom)).toFixed(2) + ' ' + payCurrency)
                })
            })
        })

    }


    // Самый простой кейс.Цена товара - совпадает с валютами которые в кабинете мерчанта (USD, EUR, GBP, RUB)
    // и валютами провайдера, Стратегия комиссии - ALL. Валюта товара GBP
    checkAmountUiGbpMax(payAmount, payCurrency) {

        // Get percent commission
        cy.request({
            method: 'GET',
            url: "https://app.stage.paydo.com/v1/instrument-settings/commissions/custom/300/" + merchant.bussiness_account,
            headers: {
                token: feen.token,
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200)
            expect(response.body).property('data').to.not.be.oneOf([null, ""])
            let perscom = response.body.data[7].value.GBP[1];

            // Get fixed commission
            cy.request({
                method: 'GET',
                url: "https://app.stage.paydo.com/v1/instrument-settings/commissions/custom/300/" + merchant.bussiness_account,
                headers: {
                    token: feen.token,
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200)
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                let fixcom = response.body.data[7].value.GBP[0];

                cy.wait(3000);

                // Checking transaction status
                // cy.request({
                //     method: 'GET',
                //     url: 'https://app.stage.paydo.com/v1/transactions/user-transactions?query[type]=7',
                //     headers: {
                //         token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjE3ODIiLCJhY2Nlc3NUb2tlbiI6IjU4ZjE4NzhiZWQwYmJiMzM5OTk1NzVkMiIsInRva2VuSWQiOiIyOCIsIndhbGxldElkIjoiMTc3NiIsInRpbWUiOjE1OTY5NjYyNzUsImV4cGlyZWRBdCI6MTYwOTM2NTYwMCwicm9sZXMiOltdLCJ0d29GYWN0b3IiOnsicGFzc2VkIjpmYWxzZX19.CKWO2ky4C0GytFG0_pK-aKsFCa5cITEE7hBVxedH-78'
                //     }
                // }).then((response) => {
                //     expect(response).property('status').to.equal(200)
                //     expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                //     let status = response.body.data[0].state;
                //     expect(status).to.eq(2);

                // Check status tranzaction
                cy.get('[class="mat-chip mat-focus-indicator mat-primary mat-standard-chip status_2"]').eq(0).invoke('text').should((text) => {
                    expect(text).to.eq(' Accepted ')
                })

                //Сalculation formula & Check Amount
                cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                    if (fixcom > (payAmount / 100 * perscom)) {
                        expect(text).to.eq((payAmount - fixcom).toFixed(2) + ' ' + payCurrency)
                    } else {
                        expect(text).to.eq((payAmount - (payAmount / 100 * perscom)).toFixed(2) + ' ' + payCurrency)
                    }
                })

                // Checking transaction amount
                // cy.request({
                //     method: 'GET',
                //     url: 'https://app.stage.paydo.com/v1/transactions/user-transactions?query[type]=7',
                //     headers: {
                //         token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjE3ODIiLCJhY2Nlc3NUb2tlbiI6IjU4ZjE4NzhiZWQwYmJiMzM5OTk1NzVkMiIsInRva2VuSWQiOiIyOCIsIndhbGxldElkIjoiMTc3NiIsInRpbWUiOjE1OTY5NjYyNzUsImV4cGlyZWRBdCI6MTYwOTM2NTYwMCwicm9sZXMiOltdLCJ0d29GYWN0b3IiOnsicGFzc2VkIjpmYWxzZX19.CKWO2ky4C0GytFG0_pK-aKsFCa5cITEE7hBVxedH-78'
                //     }
                // }).then((response) => {
                //     expect(response).property('status').to.equal(200)
                //     expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                //     let sum = response.body.data[0].amount;
                //      if (fixcom > (payAmount / 100 * perscom)) {
                //          expect(sum).to.eq((payAmount - fixcom - (payAmount / 100 * conversion)).toFixed(8))
                //      } else {
                //          expect(sum).to.eq((payAmount - (payAmount / 100 * perscom) - (payAmount / 100 * conversion)).toFixed(8))
                //      }
                //})
            })
        })


    }

    checkAmountUiUsdAll(payAmount, conversion, payCurrency) {

        // Get percent commission
        cy.request({
            method: 'GET',
            url: "https://app.stage.paydo.com/v1/instrument-settings/commissions/custom/300/"+merchant.bussiness_account,
            headers: {
                token: feen.token,
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200)
            expect(response.body).property('data').to.not.be.oneOf([null, ""])
            let perscom = response.body.data[7].value.USD[1];

            // Get fixed commission
            cy.request({
                method: 'GET',
                url: "https://app.stage.paydo.com/v1/instrument-settings/commissions/custom/300/"+merchant.bussiness_account,
                headers: {
                    token: feen.token,
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200)
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                let fixcom = response.body.data[7].value.USD[0];

                cy.wait(3000)

                //Check status tranzaction
                cy.get('[class="mat-chip mat-focus-indicator mat-primary mat-standard-chip status_2"]').eq(0).invoke('text').should((text) => {
                    expect(text).to.eq(' Accepted ')
                })

                // Сalculation formula & Check Amount
                cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                   expect(text).to.eq((payAmount - fixcom - (payAmount / 100 * perscom) - (payAmount / 100 * conversion)).toFixed(2) + ' ' + payCurrency)
                })

            })
        })
    }


    // Цена товара - совпадает с валютами которые в кабинете мерчанта (USD, EUR, GBP, RUB)
    // и валютами провайдера, Стратегия комиссии - ALL. Валюта товара USD
    checkAmountUSDMax(payAmount, conversion, payCurrency) {

        // Get percent commission
        cy.request({
            method: 'GET',
            url: "https://app.stage.paydo.com/v1/instrument-settings/commissions/custom/300/" + merchant.bussiness_account,
            headers: {
                token: feen.token,
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200)
            expect(response.body).property('data').to.not.be.oneOf([null, ""])
            let perscom = response.body.data[7].value.USD[1];

            // Get fixed commission
            cy.request({
                method: 'GET',
                url: "https://app.stage.paydo.com/v1/instrument-settings/commissions/custom/300/" + merchant.bussiness_account,
                headers: {
                    token: feen.token,
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200)
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                let fixcom = response.body.data[7].value.USD[0];

                cy.wait(3000);

                // Checking transaction status
                cy.request({
                    method: 'GET',
                    url: 'https://app.stage.paydo.com/v1/transactions/user-transactions?query[type]=7',
                    headers: {
                        token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjE4MTIiLCJhY2Nlc3NUb2tlbiI6IjY0YjE2NGUxOTMyMzA0ODFjNmZlY2VmYiIsInRva2VuSWQiOiIyOSIsIndhbGxldElkIjoiMTgwNiIsInRpbWUiOjE1OTcxMjYwNDYsImV4cGlyZWRBdCI6MTYwOTM2NTYwMCwicm9sZXMiOltdLCJ0d29GYWN0b3IiOnsicGFzc2VkIjpmYWxzZX19.7RrfbqC_w5ovuMq4j0KtAnCslgBAKUHPmR0wOOFNhqM'
                    }
                }).then((response) => {
                    expect(response).property('status').to.equal(200)
                    expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                    let status = response.body.data[0].state;
                    expect(status).to.eq(2);

                    // Checking transaction amount
                    cy.request({
                        method: 'GET',
                        url: 'https://app.stage.paydo.com/v1/transactions/user-transactions?query[type]=7',
                        headers: {
                            token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjE4MTIiLCJhY2Nlc3NUb2tlbiI6IjY0YjE2NGUxOTMyMzA0ODFjNmZlY2VmYiIsInRva2VuSWQiOiIyOSIsIndhbGxldElkIjoiMTgwNiIsInRpbWUiOjE1OTcxMjYwNDYsImV4cGlyZWRBdCI6MTYwOTM2NTYwMCwicm9sZXMiOltdLCJ0d29GYWN0b3IiOnsicGFzc2VkIjpmYWxzZX19.7RrfbqC_w5ovuMq4j0KtAnCslgBAKUHPmR0wOOFNhqM'
                        }
                    }).then((response) => {
                        expect(response).property('status').to.equal(200)
                        expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                        let sum = response.body.data[0].amount;
                        if (fixcom > (payAmount / 100 * perscom)) {
                            expect(sum).to.eq((payAmount - fixcom - (payAmount / 100 * conversion)).toFixed(8))
                        } else {
                            expect(sum).to.eq((payAmount - (payAmount / 100 * perscom) - (payAmount / 100 * conversion)).toFixed(8))
                        }
                    })

                    // Check status tranzaction
                    // cy.get('[class="mat-chip mat-focus-indicator mat-primary mat-standard-chip status_2"]').eq(0).invoke('text').should((text) => {
                    //     expect(text).to.eq(' Accepted ')
                    // })
                    //
                    // // Сalculation formula & Check Amount
                    // cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                    //     if (fixcom > (payAmount / 100 * perscom)) {
                    //         expect(text).to.eq((payAmount - fixcom - (payAmount / 100 * conversion)).toFixed(2) + ' ' + payCurrency)
                    //     } else {
                    //         expect(text).to.eq((payAmount - (payAmount / 100 * perscom) - (payAmount / 100 * conversion)).toFixed(2) + ' ' + payCurrency)
                    //     }
                    // })

                })
            })

        })
    }

    checkAmountTRYAll(payAmount, conversion, payCurrency) {

        // Get percent commission
        cy.request({
            method: 'GET',
            url: `https://app.stage.paydo.com/v1/instrument-settings/commissions/custom/300/1782`,
            headers: {
                token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjE2MDQiLCJhY2Nlc3NUb2tlbiI6ImRlYzhhMDE5YjA1Y2M2ZjVkMzk3ZjdiOSIsInRva2VuSWQiOm51bGwsIndhbGxldElkIjoiMTU5OCIsInRpbWUiOjE1OTYzNTgyNzMsImV4cGlyZWRBdCI6bnVsbCwicm9sZXMiOlsiUk9MRV9GSU5BTkNJQUwiXSwidHdvRmFjdG9yIjp7InBhc3NlZCI6dHJ1ZX19.GGimEqCfcBU3fMMiO23Uc9_-nPidBcmNwpFvNuNi3SU',
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200)
            expect(response.body).property('data').to.not.be.oneOf([null, ""])
            let perscom = response.body.data[7].value.TRY[1];

            // Get fixed commission
            cy.request({
                method: 'GET',
                url: `https://app.stage.paydo.com/v1/instrument-settings/commissions/custom/300/1782`,
                headers: {
                    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjE2MDQiLCJhY2Nlc3NUb2tlbiI6ImRlYzhhMDE5YjA1Y2M2ZjVkMzk3ZjdiOSIsInRva2VuSWQiOm51bGwsIndhbGxldElkIjoiMTU5OCIsInRpbWUiOjE1OTYzNTgyNzMsImV4cGlyZWRBdCI6bnVsbCwicm9sZXMiOlsiUk9MRV9GSU5BTkNJQUwiXSwidHdvRmFjdG9yIjp7InBhc3NlZCI6dHJ1ZX19.GGimEqCfcBU3fMMiO23Uc9_-nPidBcmNwpFvNuNi3SU',
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200)
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                let fixcom = response.body.data[7].value.TRY[0];

                cy.wait(3000);

                // Checking transaction status
                cy.request({
                    method: 'GET',
                    url: 'https://app.stage.paydo.com/v1/transactions/user-transactions?query[type]=7',
                    headers: {
                        token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjE3ODIiLCJhY2Nlc3NUb2tlbiI6IjU4ZjE4NzhiZWQwYmJiMzM5OTk1NzVkMiIsInRva2VuSWQiOiIyOCIsIndhbGxldElkIjoiMTc3NiIsInRpbWUiOjE1OTY5NjYyNzUsImV4cGlyZWRBdCI6MTYwOTM2NTYwMCwicm9sZXMiOltdLCJ0d29GYWN0b3IiOnsicGFzc2VkIjpmYWxzZX19.CKWO2ky4C0GytFG0_pK-aKsFCa5cITEE7hBVxedH-78'
                    }
                }).then((response) => {
                    expect(response).property('status').to.equal(200)
                    expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                    let status = response.body.data[0].state;
                    expect(status).to.eq(2);

                    // Check status tranzaction
                    // cy.get('[class="mat-chip mat-focus-indicator mat-primary mat-standard-chip status_2"]').eq(0).invoke('text').should((text) => {
                    //     expect(text).to.eq(' Accepted ')
                    // })

                    // Checking transaction amount
                    cy.request({
                        method: 'GET',
                        url: 'https://app.stage.paydo.com/v1/transactions/user-transactions?query[type]=7',
                        headers: {
                            token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjE3ODIiLCJhY2Nlc3NUb2tlbiI6IjU4ZjE4NzhiZWQwYmJiMzM5OTk1NzVkMiIsInRva2VuSWQiOiIyOCIsIndhbGxldElkIjoiMTc3NiIsInRpbWUiOjE1OTY5NjYyNzUsImV4cGlyZWRBdCI6MTYwOTM2NTYwMCwicm9sZXMiOltdLCJ0d29GYWN0b3IiOnsicGFzc2VkIjpmYWxzZX19.CKWO2ky4C0GytFG0_pK-aKsFCa5cITEE7hBVxedH-78'
                        }
                    }).then((response) => {
                        expect(response).property('status').to.equal(200)
                        expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                        let sum = response.body.data[0].amount;

                        let one = (payAmount / 100 * conversion) //комиссия за первую конвертацию
                        let two = (payAmount - fixcom - (payAmount / 100 * perscom) - one) //отнимаем комиссии

                        cy.request({
                            method: 'GET',
                            url: 'http://data.fixer.io/api/convert?access_key=f74d95af4d874be993c3d2b716800735&from=TRY&to=USD&amount=1',
                        }).then((response) => {
                            expect(response).property('status').to.equal(200)
                            //expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                            let rat = response.body.info.rate;

                            let thre = (two * rat)//конвертируем в основную валюту мерчанта т к try есть в валюте оплаты


                            let four = (thre - ((two * rat) / 100 * conversion)) //отнимаем проц за конверт
                            let five = (four / 100 * conversion)//вторая конверт в GBP
                            let result = (four - five).toFixed(8)

                            expect(sum).to.eq(result)//((payAmount - fixcom - (payAmount / 100 * perscom) - (payAmount / 100 * conversion)).toFixed(8))

                            // Сalculation formula & Check Amount
                            // cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                            //     expect(text).to.eq((payAmount - fixcom - (payAmount / 100 * perscom) - (payAmount / 100 * conversion)).toFixed(2) + ' ' + payCurrency)
                            // })

                        })
                    })
                })
            })


        })
    }

    // Цена товара - не совпадает с валютами, которые в кабинете мерчанта (USD, EUR, GBP, RUB),
    // основная валюта мерчанта совпадает с валютой оплаты, Стратегия комиссии - ALL.
    checkAmountUiUahAll(payAmount, conversion, payCurrency, mainCurrency) {

        // Get percent commission
        cy.request({
            method: 'GET',
            url: "https://app.stage.paydo.com/v1/instrument-settings/commissions/custom/300/"+merchant.bussiness_account,
            headers: {
                token: feen.token,
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200)
            expect(response.body).property('data').to.not.be.oneOf([null, ""])
            let perscom = response.body.data[7].value.UAH[1];
            console.log(perscom)

            // Get fixed commission
            cy.request({
                method: 'GET',
                url: "https://app.stage.paydo.com/v1/instrument-settings/commissions/custom/300/"+merchant.bussiness_account,
                headers: {
                    token: feen.token,
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200)
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                let fixcom = response.body.data[7].value.UAH[0];
                console.log(fixcom)

                cy.wait(3000);

                // Check status tranzaction
                cy.get('[class="mat-chip mat-focus-indicator mat-primary mat-standard-chip status_2"]').eq(0).invoke('text').should((text) => {
                    expect(text).to.eq(' Accepted ')
                })

                // Get rate
                cy.request({
                    method: 'GET',
                    url: "http://data.fixer.io/api/convert?access_key=f74d95af4d874be993c3d2b716800735&from=UAH&to="+mainCurrency+"&amount=1",
                }).then((response) => {
                    expect(response).property('status').to.equal(200)
                    //expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                    let rat = response.body.info.rate; //0.04
                    console.log(rat)


                    // Checking transaction amount

                    // комиссия за первую конвертацию с UAH в USD
                    let exch = (payAmount / 100 * conversion).toFixed(2)
                    console.log(exch)

                    // комиссия за вторую конвертацию с USD в GBP
                    let exch2 = ((payAmount * rat) / 100 * conversion)
                    console.log(exch2)

                    // сумма комиссий
                    //let com = ((perscom + fixcom) + exch)
                    //console.log(com)

                    // отнимаем комиссии от стоимости
                    let wcom = (payAmount - fixcom - (payAmount/100*perscom) - exch)
                    console.log(wcom)

                    // отнимаем комиссию за первую конвертацию
                    //let wcom2 = (wcom-exch)
                   // console.log(wcom2)

                    // конвертация в USD
                    let exusd = (wcom * rat)
                    console.log(exusd)

                    // комиссия за конвертацию в USD
                    let comusd = (exusd / 100 * conversion)
                    console.log(comusd)




                    let final = (exusd - comusd - exch2)

                    //

                    // // комиссия за конвертацию с UAH в USD
                    // let com1 = (payAmount / 100 * conversion).toFixed(2); // UAH 15.58
                    // console.log(com1)
                    //
                    // // комиссия за конвертацию с USD в GBP
                    // let com2 = ((payAmount * rat).toFixed(2) / 100 * conversion).toFixed(2) //USD o.58
                    // console.log(com2)
                    //
                    // // отнимаем комиссии фикс проц конвертация в USD
                    // let result = (payAmount - fixcom.toFixed(2) - (payAmount / 100 * perscom.toFixed(2)) - com1).toFixed(2) //UAH 377.2
                    // console.log(result)
                    //
                    // // конвертируем result в USD
                    // let convresult = (result * rat).toFixed(2) // USD 13.8
                    // console.log(convresult)
                    //
                    // // комиссия за конвертацию result в USD
                    // let com3 = (convresult / 100 * conversion).toFixed(2) // USD 0.48
                    // console.log(com3)
                    //
                    // //отнимаем комиссию за конвертацию
                    // let result2 = (convresult - com3).toFixed(2) // USD 13.32
                    // console.log(result2)
                    //
                    // // комиссия за конвертацию с USD в GBP
                    // let com4 = ((payAmount * rat).toFixed(2) / 100 * conversion).toFixed(2) //(result2 / 100 * conversion) // USD
                    // console.log(com4)
                    //
                    // // FINAL
                    // let final = result2 - com4 // USD
                    // console.log(final)

                    cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                        expect(text).to.eq((final).toFixed(2) + ' ' + mainCurrency)
                    })

                })
            })
        })

    }

    // Цена товара - совпадает с валютами которые в кабинете мерчанта (USD, EUR, GBP, RUB)
    // и валютами провайдера, Стратегия комиссии - ALL. Валюта товара USD
    checkAmountUiUSDMax(payAmount, conversion, payCurrency) {

        // Get percent commission
        cy.request({
            method: 'GET',
            url: "https://app.stage.paydo.com/v1/instrument-settings/commissions/custom/300/" + merchant.bussiness_account,
            headers: {
                token: feen.token,
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200)
            expect(response.body).property('data').to.not.be.oneOf([null, ""])
            let perscom = response.body.data[7].value.USD[1];

            // Get fixed commission
            cy.request({
                method: 'GET',
                url: "https://app.stage.paydo.com/v1/instrument-settings/commissions/custom/300/" + merchant.bussiness_account,
                headers: {
                    token: feen.token,
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200)
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                let fixcom = response.body.data[7].value.USD[0];

                cy.wait(3000);

                // Checking status tranzaction
                cy.get('[class="mat-chip mat-focus-indicator mat-primary mat-standard-chip status_2"]').eq(0).invoke('text').should((text) => {
                    expect(text).to.eq(' Accepted ')
                })

                // Сalculation formula & Check Amount
                cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                    if (fixcom > (payAmount / 100 * perscom)) {
                        expect(text).to.eq((payAmount - (fixcom + (payAmount / 100 * conversion)).toFixed(2)).toFixed(2) + ' ' + payCurrency)
                    } else {
                        expect(text).to.eq((payAmount - ((payAmount / 100 * perscom) + (payAmount / 100 * conversion)).toFixed(2)).toFixed(2) + ' ' + payCurrency)
                    }
                })
            })
        })
    }

    //Цена товара - не совпадает с валютами, которые в кабинете мерчанта (USD, EUR, GBP, RUB),
    // основная валюта мерчанта совпадает с валютой оплаты, Стратегия комиссии - ALL. Валюта товара UAH
    checkAmountUiUahMax(payAmount, conversion, payCurrency, mainCurrency) {
        // Get percent commission
        cy.request({
            method: 'GET',
            url: "https://app.stage.paydo.com/v1/instrument-settings/commissions/custom/300/" + merchant.bussiness_account,
            headers: {
                token: feen.token,
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200)
            expect(response.body).property('data').to.not.be.oneOf([null, ""])
            let perscom = (response.body.data[7].value.UAH[1]).toFixed(2);

            // Get fixed commission
            cy.request({
                method: 'GET',
                url: "https://app.stage.paydo.com/v1/instrument-settings/commissions/custom/300/" + merchant.bussiness_account,
                headers: {
                    token: feen.token,
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200)
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                let fixcom = (response.body.data[7].value.UAH[0]).toFixed(2);

                cy.wait(3000);

                // Check status tranzaction
                cy.get('[class="mat-chip mat-focus-indicator mat-primary mat-standard-chip status_2"]').eq(0).invoke('text').should((text) => {
                    expect(text).to.eq(' Accepted ')
                })

                // Get rate
                cy.request({
                    method: 'GET',
                    url: 'http://data.fixer.io/api/convert?access_key=f74d95af4d874be993c3d2b716800735&from=UAH&to=USD&amount=1',
                }).then((response) => {
                    expect(response).property('status').to.equal(200)
                    //expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                    let rat = response.body.info.rate;
                    console.log(rat)

                    // Checking transaction amount

                    if (fixcom > (payAmount / 100 * perscom)) {




                        // комиссия за конвертацию с UAH в USD
                        let com1 = (payAmount / 100 * conversion).toFixed(2); // UAH
                        console.log(com1)

                        // комиссия за конвертацию с USD в GBP
                        let com2 = ((payAmount * rat) / 100 * conversion).toFixed(2) //USD
                        console.log(com2)

                        // отнимаем комиссию фикс и ком конвертации в USD
                        let result = (payAmount - fixcom - com1).toFixed(2) //UAH
                        console.log(result)

                        // конвертируем result в USD
                        let convresult = (result * rat).toFixed(2) // USD
                        console.log(convresult)

                        // комиссия за конвертацию result в USD
                        let com3 = (convresult / 100 * conversion).toFixed(2) // USD
                        console.log(com3)

                        //отнимаем комиссию за конвертацию
                        let result2 = (convresult - com3).toFixed(2) // USD
                        console.log(result2)

                        // комиссия за конвертацию с USD в GBP
                        let com4 = ((payAmount * rat) / 100 * conversion).toFixed(2)   // USD
                        console.log(com4)

                        // FINAL
                        let final = result2 - com4 // USD
                        console.log(final)

                        cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                            expect(text).to.eq((final).toFixed(2) + ' ' + mainCurrency)
                        })
                    } else {

                        // комиссия за конвертацию с UAH в USD
                        let com1 = (payAmount / 100 * conversion).toFixed(2); // UAH
                        console.log(com1)

                        // комиссия за конвертацию с USD в GBP
                        let com2 = ((payAmount * rat) / 100 * conversion).toFixed(2) //USD
                        console.log(com2)

                        // отнимаем комиссию фикс и ком конвертации в USD
                        let result = (payAmount - (payAmount / 100 * perscom) - com1).toFixed(2) //UAH
                        console.log(result)

                        // конвертируем result в USD
                        let convresult = (result * rat).toFixed(2) // USD
                        console.log(convresult)

                        // комиссия за конвертацию result в USD
                        let com3 = (convresult / 100 * conversion).toFixed(2) // USD
                        console.log(com3)

                        //отнимаем комиссию за конвертацию
                        let result2 = (convresult - com3).toFixed(2) // USD
                        console.log(result2)

                        // комиссия за конвертацию с USD в GBP
                        let com4 = ((payAmount * rat) / 100 * conversion).toFixed(2)   // USD
                        console.log(com4)

                        // FINAL
                        let final = result2 - com4 // USD
                        console.log(final)

                        cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                            expect(text).to.eq((final).toFixed(2) + ' ' + mainCurrency)
                        })

                    }

                })
            })
        })
    }


    checkAmountAPIGbpAll(payAmount, payCurrency) {
        // Get persent commission
        cy.request({
            method: 'GET',
            url: "https://app.stage.paydo.com/v1/instrument-settings/commissions/custom/300/" + merchant.bussiness_account,
            headers: {
                token: feen.token,
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200)
            expect(response.body).property('data').to.not.be.oneOf([null, ""])
            let perscom = response.body.data[7].value.GBP[1];
            perscom = (perscom).toFixed(2)

            // Get fixed commission
            cy.request({
                method: 'GET',
                url: "https://app.stage.paydo.com/v1/instrument-settings/commissions/custom/300/" + merchant.bussiness_account,
                headers: {
                    token: feen.token,
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200)
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                let fixcom = response.body.data[7].value.GBP[0];
                fixcom = (fixcom).toFixed(2)

                cy.wait(3000)

                //Check status tranzaction
                cy.request({
                    method: 'GET',
                    url: 'https://app.stage.paydo.com/v1/transactions/user-transactions?query[type]=7',
                    headers: {
                        token: merchant.token
                    }
                }).then((response) => {
                    expect(response).property('status').to.equal(200)
                    expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                    let status = response.body.data[0].state;
                    expect(status).to.eq(2);

                    //Сalculation formula & Check Amount
                    cy.request({
                        method: 'GET',
                        url: 'https://app.stage.paydo.com/v1/transactions/user-transactions?query[type]=7',
                        headers: {
                            token: merchant.token
                        }
                    }).then((response) => {
                        expect(response).property('status').to.equal(200)
                        expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                        let sum = response.body.data[0].amount;
                        cy.log(sum)
                        expect(sum).to.eq((payAmount - fixcom - (payAmount / 100 * perscom)).toFixed(2)) //+ ' ' + payCurrency)
                    })
                })
            })
        })
    }


    checkAmountAPIUsdAll(payAmount, conversion, payCurrency) {
        // Get persent commission
        cy.request({
            method: 'GET',
            url: "https://app.stage.paydo.com/v1/instrument-settings/commissions/custom/300/" + merchant.bussiness_account,
            headers: {
                token: feen.token,
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200)
            expect(response.body).property('data').to.not.be.oneOf([null, ""])
            let perscom = response.body.data[7].value.USD[1];
            perscom = (perscom).toFixed(2)

            // Get fixed commission
            cy.request({
                method: 'GET',
                url: "https://app.stage.paydo.com/v1/instrument-settings/commissions/custom/300/" + merchant.bussiness_account,
                headers: {
                    token: feen.token,
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200)
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                let fixcom = response.body.data[7].value.USD[0];
                fixcom = (fixcom).toFixed(2)

                cy.wait(4000)

                //Check status tranzaction
                cy.request({
                    method: 'GET',
                    url: 'https://app.stage.paydo.com/v1/transactions/user-transactions?query[type]=7',
                    headers: {
                        token: merchant.token
                    }
                }).then((response) => {
                    expect(response).property('status').to.equal(200)
                    expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                    let status = response.body.data[0].state;
                    expect(status).to.eq(2);

                    //Сalculation formula & Check Amount
                    cy.request({
                        method: 'GET',
                        url: 'https://app.stage.paydo.com/v1/transactions/user-transactions?query[type]=7',
                        headers: {
                            token: merchant.token
                        }
                    }).then((response) => {
                        expect(response).property('status').to.equal(200)
                        expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                        let sum = response.body.data[0].amount;
                        console.log(sum)
                        expect(sum).to.eq((payAmount - fixcom - (payAmount / 100 * perscom) - (payAmount / 100 * conversion)).toFixed(2)) //+ ' ' + payCurrency)
                    })
                })
            })
        })
    }

    checkAmountAPIUAHAll(payAmount, conversion, payCurrency) {
        // Get persent commission
        cy.request({
            method: 'GET',
            url: "https://app.stage.paydo.com/v1/instrument-settings/commissions/custom/300/" + merchant.bussiness_account,
            headers: {
                token: feen.token,
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200)
            expect(response.body).property('data').to.not.be.oneOf([null, ""])
            let perscom = response.body.data[7].value.UAH[1];
            perscom = (perscom).toFixed(2)

            // Get fixed commission
            cy.request({
                method: 'GET',
                url: "https://app.stage.paydo.com/v1/instrument-settings/commissions/custom/300/" + merchant.bussiness_account,
                headers: {
                    token: feen.token,
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200)
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                let fixcom = response.body.data[7].value.UAH[0];
                fixcom = (fixcom).toFixed(2)

                cy.wait(4000)

                //Check status tranzaction
                cy.request({
                    method: 'GET',
                    url: 'https://app.stage.paydo.com/v1/transactions/user-transactions?query[type]=7',
                    headers: {
                        token: merchant.token
                    }
                }).then((response) => {
                    expect(response).property('status').to.equal(200)
                    expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                    let status = response.body.data[0].state;
                    expect(status).to.eq(2);

                    //Сalculation formula & Check Amount

                    // Get rate
                    cy.request({
                        method: 'GET',
                        url: 'http://data.fixer.io/api/convert?access_key=f74d95af4d874be993c3d2b716800735&from=UAH&to=USD&amount=1',
                    }).then((response) => {
                        expect(response).property('status').to.equal(200)
                        //expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                        let rat = response.body.info.rate;
                        console.log(rat)

                        // комиссия за конвертацию с UAH в USD
                        let com1 = (payAmount / 100 * conversion).toFixed(2); // UAH 15.58
                        console.log(com1)

                        // комиссия за конвертацию с USD в GBP
                        let com2 = ((payAmount * rat).toFixed(2) / 100 * conversion).toFixed(2) //USD o.58
                        console.log(com2)

                        // отнимаем комиссии фикс проц конвертация в USD
                        let result = ((payAmount - fixcom).toFixed(2) - (payAmount / 100 * perscom).toFixed(2) - com1).toFixed(2)  //UAH 377.2
                        console.log(result)

                        // конвертируем result в USD
                        let convresult = (result * rat).toFixed(2) // USD 13.8
                        console.log(convresult)

                        // комиссия за конвертацию result в USD
                        let com3 = (convresult / 100 * conversion).toFixed(2) // USD 0.48
                        console.log(com3)

                        //отнимаем комиссию за конвертацию
                        let result2 = (convresult - com3).toFixed(2) // USD 13.32
                        console.log(result2)

                        // комиссия за конвертацию с USD в GBP
                        let com4 = ((payAmount * rat).toFixed(2) / 100 * conversion).toFixed(2) //(result2 / 100 * conversion) // USD
                        console.log(com4)

                        // FINAL
                        let final = result2 - com4 // USD
                        console.log(final)

                        cy.request({
                            method: 'GET',
                            url: 'https://app.stage.paydo.com/v1/transactions/user-transactions?query[type]=7',
                            headers: {
                                token: merchant.token
                            }
                        }).then((response) => {
                            expect(response).property('status').to.equal(200)
                            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                            let sum = response.body.data[0].amount;
                            expect(sum).to.eq(final).toFixed(2) //+ ' ' + mainCurrency)
                        })
                    })
                })
            })
        })
    }
}

export default new TransactionsPage();