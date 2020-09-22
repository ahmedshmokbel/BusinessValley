
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




export const getRandRangLocation = () => {
    const locations = [{ lat: 30.004463590130133, lng: 31.22987582899576 },
    { lat: 30.06183628555302, lng: 31.231638585463234 },
    { lat: 30.12459197239538, lng: 31.261066575701513 },
    { lat: 30.117871441171623, lng: 31.36639115562378 },
    { lat: 30.027159299462802, lng: 31.20740539045705 },
    { lat: 30.6087236, lng: 32.301847 },
    { lat: 31.251520797721312, lng: 29.984505977300845 },
    { lat: 31.236122204137835, lng: 29.950371362926496 },
    { lat: 31.215525642462815, lng: 29.945902697735292 },
    { lat: 31.207934194530196, lng: 29.964801566179368 },
    { lat: 31.201876059843325, lng: 29.8880890374658 },]

    const random = Math.floor(Math.random() * locations.length);
    console.log(random, locations[random]);
    return locations[random]
}

export const getLatLng = (a, b) => { // a and b included 


    //latlng=[{lat:}]

    return (Math.random() * (b - a + 1) + a);
}

