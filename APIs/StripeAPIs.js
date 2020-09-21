import stripe from 'tipsi-stripe'
stripe.setOptions({
    publishableKey: 'pk_test_A4NpuY8IglXSz4BGF0xQIkXE',
})
export const OpenStripeCard = async () => {


    let token = await stripe.paymentRequestWithCardForm()
    return token
}






export const makePaymentAPI = async (amount, currency, token) => {

    let data = {
        'amount': amount,
        'currency': currency,
        'token': token
    }

    return await fetch('https://us-central1-businessvalley-3fbda.cloudfunctions.net/completePaymentWithStripe', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',

        },
        body: JSON.stringify(data)


    }).then((response) => response.json())

        .catch((error) => {
            console.error(error);
        });;



}