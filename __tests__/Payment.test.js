
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

test('renders correctly', () => {
    const rend = renderer.create(
        <CardFormScreen />
    ).toJSON();

    expect(rend).toMatchSnapshot()
});
