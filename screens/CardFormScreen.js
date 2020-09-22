import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import stripe from 'tipsi-stripe'
import Button from '../components/Button'
import axios from 'axios'
import { OpenStripeCard, makePaymentAPI } from '../APIs/StripeAPIs'
stripe.setOptions({
    publishableKey: 'pk_test_A4NpuY8IglXSz4BGF0xQIkXE',
})
export default class CardFormScreen extends PureComponent {
    static title = 'Card Form'
    _isMount = false
    state = {
        loading: false,
        token: null,
        loadingP: false,
        isPaid: false

    }



    componentDidMount = () => {

        this._isMount = true

    }
    componentWillUnmount = () => {
        this._isMount = false
    }


    handleCardPayPress = async () => {
        try {
            if (this._isMount) {


                this.setState({ loading: true, token: null })
            }
            const token = await OpenStripeCard()//await stripe.paymentRequestWithCardForm()
            console.log('TOKEN', token);
            if (token) {
                this.makePayment()
            }
            else {
                alert('Payment Fails')
            }
            if (this._isMount) {


                this.setState({ loading: false, token })
            }
        } catch (error) {
            if (this._isMount) {

                this.setState({ loading: false })
            }
        }
    }




    makePayment = async () => {
        if (this._isMount) {

            this.setState({ loadingP: true })
        }


        makePaymentAPI(100, 'usd', this.state.token).then(responseJson => {
            console.log('RESP', responseJson);
            if (responseJson.status == 'succeeded' && responseJson.paid) {
                if (this._isMount) {
                    this.setState({ loadingP: false, isPaid: true })
                }
                this.props.isPaid(true)

            }
        })

    }
    render() {
        const { loading, token, loadingP } = this.state

        return (
            <View style={styles.container}>
                {!token &&

                    <Button

                        testID='Pay'
                        //   style={{ backgroundColor: 'green' }}
                        text="Pay"
                        loading={loading}
                        onPress={this.handleCardPayPress}
                    />
                }

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        top: 10,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        width: 150,
        height: 50
    },
    header: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instruction: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    token: {
        height: 22,
    },
})