
import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import { OpenStripeCard, makePaymentAPI } from '../APIs/StripeAPIs'

jest.mock('tipsi-stripe', () => {

    return {
        setOptions: jest.fn(),
        paymentRequestWithCardForm: jest.fn()
    };
});



test('Test Open Card', async () => {
    global.fetch = jest.fn().mockImplementation(() => {
        var obj = new Promise((resolve, reject) => {
            resolve({
                json: () => {
                    return {
                        "card": { "cardId": "card_1HTwT2Kbht1ZQ9KD4WD8E93m", }
                    }
                }
            })
        })
        return obj
    })


    makePaymentAPI(100, 'usd', "tok_1HTwT2Kbht1ZQ9KDQrJxqHGE").then(resjson => {
        console.log('TOKEN', resjson);

        expect(resjson.amount).toBe(100)

    })


});
