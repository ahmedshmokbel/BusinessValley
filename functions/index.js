const functions = require('firebase-functions');
const stripe = require('stripe')('sk_test_z4N8mZoFvnpQY1tZgxSCQGl1');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
exports.completePaymentWithStripe = functions.https.onRequest(
    (request, response) => {
        stripe.charges
            .create({
                amount: request.body.amount,
                currency: request.body.currency,
                source: 'tok_mastercard'
            }).then(charge => {
                response.send(charge);
            }).catch((e) => {
                console.log('index func catch', e);
            });
    }
);
