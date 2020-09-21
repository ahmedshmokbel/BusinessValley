
import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

import CardFormScreen from '../screens/CardFormScreen'

jest.mock('tipsi-stripe', () => {

    return {
        setOptions: jest.fn()

    };
});



const findElement = (tree, element) => {
    console.log(tree.children);
    let result = undefined
    for (node in tree.children) {
        if (tree.children[node].props.testID == element) {
            result = true

        }
    }
    return result
}

test('Payment Elements', () => {
    const tree = renderer.create(
        <CardFormScreen />
    ).toJSON();

    expect(findElement(tree, 'Pay')).toBeDefined()

    //expect(findElement(tree, 'MakePayment')).toBeDefined()

});
