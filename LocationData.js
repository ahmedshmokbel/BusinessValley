
import RNSettings from 'react-native-settings';

import RNLocation from 'react-native-location';
import { Linking } from 'react-native';


export const MapKey = 'AIzaSyDaulFBobHuZPWOyKxfUQVLI3cUUtTyl5Q'
export const requestPermission = () => {


    RNLocation.configure({
        distanceFilter: 5.0
    })
    RNLocation.requestPermission({
        ios: "whenInUse",
        android: {
            detail: "coarse",
            rationale: {
                title: "Location permission",
                message: "We use your location to locate Customers",
                buttonPositive: "OK",
                buttonNegative: "Cancel"
            },

        }
    }).then(granted => {
        if (granted) {
            getLocationSettings();
            // alert('location granted', granted)

        }
        else {
            alert('location denid')
        }
    });


}


export const getLocationSettings = () => {
    return new Promise(function (resolve, reject) {

        RNSettings.getSetting(RNSettings.LOCATION_SETTING)
            .then(result => {

                //  console.log("LOCATION_SETTING In");

                if (result === RNSettings.ENABLED) {
                    //  console.log("LOCATION_SETTING true");
                    resolve(true)
                } else {
                    //    console.log("LOCATION_SETTING false");

                    openLocationSetting().then((value) => {
                        //       console.log('1st then, openlocation(): ' + value)
                        resolve(value)

                        //      console.log("LOCATION_SETTING Out");

                    })

                }

            });
    }).then((value) => {
        if (value) {
            // getLocationAsync().then((locations) => {
            //     console.log("Change", locations);

            // }).catch(e => {
            //     console.log('Carch', e);

            // })
        } else {

        }
        //    console.log('2nd then, getSettings(): ' + value);
    });



}








const openLocationSetting = () => {
    return new Promise((resolve, reject) => {

        if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:')
        }
        //    console.log("openLocationSetting in");

        RNSettings.openSetting(RNSettings.ACTION_LOCATION_SOURCE_SETTINGS).then(
            result => {
                if (result === RNSettings.ENABLED) {
                    //    this.setState({ locationOn: true });
                    //  getLocationAsync()
                    resolve(true);

                } else {
                    //  this.setState({ locationOn: false });

                    resolve(false);
                }
            },
        )
    });

};



export const getLocationAsync = () => {
    requestPermission()
    return new Promise((resolve, reject) => {
        //   //  getLocationSettings()
        RNLocation.subscribeToLocationUpdates(
            locations => {


                // console.log("Update", locations);

                resolve(locations[0])
            }
        )

    });


}


