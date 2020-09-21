import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Linking, I18nManager, ScrollView, ActivityIndicator, Platform, Switch, Image, } from 'react-native';

import MapView, { ProviderPropType, Marker } from 'react-native-maps';
import Polyline from '@mapbox/polyline'

import Icon from 'react-native-vector-icons/MaterialIcons';
import Button from '../components/Button'

import Animated from "react-native-reanimated";

const {
    set,
    cond,
    eq,
    spring,
    startClock,
    stopClock,
    clockRunning,
    defined,
    Value,
    Clock,
    event,
    diffClamp,
    interpolate
} = Animated;


const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

import CardFormScreen from './CardFormScreen';
import { getLocationAsync } from '../LocationData';
export const MapKey = 'AIzaSyCbfdkBxKCLIKiWx9CqAUxhoVEMDaKqQIg'

import RNLocation from 'react-native-location';
const IUST = {
    latitude: 31.214325, longitude: 29.944535,
};

class MapsScreen extends React.PureComponent {
    _isMounted = false;


    constructor() {
        super();
        this.state = {
            currentLongitude: 0,
            currentLatitude: 0,
            randomLatitude: 31.214325,
            randomLongitude: 29.944535,
            coords: [],
            markLatitude: 0,
            markLongitude: 0,
            heading: 0,
            isMapReady: false,
            isPaid: false,
            unsub: null,
            isStart: false

        }
        this.RotateValueHolder = new Animated.Value(0);
    }

    onLayout = () => {

        this.interval = setTimeout(
            () => {
                try {

                    this.map.fitToCoordinates([this.state.isStart == false ? {
                        latitude: this.state.currentLatitude, longitude: this.state.currentLongitude
                    } : {
                            latitude: markLatitude,
                            longitude: markLongitude,
                        }, { latitude: this.state.randomLatitude, longitude: this.state.randomLongitude }], {
                        animated: true,
                    });
                } catch (e) {
                    console.error(e);
                }
            }, 1000
        );
    }


    componentWillUnmount() {

        this._isMounted = false;
        this.state.unsub()
        clearInterval(this.interval);

    }

    async componentDidMount() {
        this._isMounted = true;

        RNLocation.configure({
            distanceFilter: 5.0
        })

        RNLocation.requestPermission({
            ios: "whenInUse",
            android: {
                detail: "coarse"
            }
        }).then(granted => {
            if (granted) {
                console.log(
                    'dkdkdk'
                );
                this.unsub = RNLocation.subscribeToLocationUpdates(locations => {

                    if (this._isMounted) {

                        this.setState({
                            unsub: this.unsub, heading: locations[0].heading,
                            currentLatitude: locations[0].latitude, currentLongitude: locations[0].longitude
                        })
                    }

                    this._DrawDirection(this.state.randomLatitude, this.state.randomLongitude)


                })
            }
        })
    }


    starRide = () => {

        if (this._isMounted) {

            this.setState({
                isStart: true
            })


            var coor = this.state.coords
            //  console.log('for loop', coor);
            for (var i = 0; i < coor.length; i++) {

                if (i + 1 < this.state.coords.length) {


                    var dist = this.getDistance(coor[i].latitude, coor[i].longitude, coor[i + 1].latitude, coor[i + 1].longitude,)

                    console.log('distanve', dist);
                    if (this._isMounted) {
                        this.setState({
                            heading: dist + 180
                        })
                    }
                }


            }



            this.state.coords.forEach((loc, i) => {
                setTimeout(() => {

                    this.setState({
                        markLatitude: loc.latitude, markLongitude: loc.longitude, heading: loc.longitude
                    })
                }, i * 1000);

                if (this.state.coords.length == i) {
                    this.setState({
                        isStart: false
                    })
                }
            });



            // this.setState({
            //     isStart: false
            // })

        }

    }


    animateCamera() {

        const camera = {
            center: {
                latitude: this.state.currentLatitude,
                longitude: this.state.currentLongitude,
            },
            heading: 0,
            zoom: 16
        }

        this.map.animateCamera(camera);


    }


    getDistance(xA, yA, xB, yB) {
        var xDiff = xA - xB;
        var yDiff = yA - yB;

        return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    }

    _DrawDirection = async (destiLat, destiLong) => {


        var myLocation = this.state.currentLatitude + "," + this.state.currentLongitude

        const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${myLocation}&destination=${destiLat},${destiLong}&key=${MapKey}&&mode=driving&optimize:true&alternatives=true`
        // const apiUrl = `https://maps.googleapis.com/maps/api/js?key=${myLocation}&libraries=geometry,places`
        // Linking.openURL(`http://maps.google.com/maps?daddr=${destiLat},${destiLong}`);
        try {

            var res = await fetch(apiUrl)
            var respJson = await res.json()
            console.log('Routes', respJson.routes[0].overview_polyline.points);
            let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
            let coords = points.map((point, index) => {
                return {
                    latitude: point[0],
                    longitude: point[1]
                }
            })
            if (this._isMounted) {
                this.setState({ coords: coords })
            }
            //console.log('points', respJson.routes[0].overview_polyline.points);

        }
        catch (error) {
            console.log('Direction Catch', error)
            // this.setState({ x: "error" })
            return error
        }
    }



    _isPaid = (isPaid) => {
        console.log('paid ', isPaid);
        if (this._isMounted) {
            this.setState({ isPaid: isPaid })
        }
    }






    render() {
        const { currentLatitude, currentLongitude, randomLatitude, randomLongitude, heading, markLatitude, markLongitude } = this.state

        console.log('rrr',);



        const RotateData = new interpolate(this.RotateValueHolder, {
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
        });
        return (


            <View style={{ flex: 1, backgroundColor: 'white' }}>
                {this.state.isPaid == false ?
                    <View style={styles.payment}>
                        <CardFormScreen isPaid={this._isPaid} />

                    </View>

                    :

                    <Button
                        text='start'
                        onPress={() => this.starRide()}
                        style={styles.start}
                    />
                }


                <TouchableOpacity
                    onPress={() => this.animateCamera()}
                    style={[{ position: 'absolute', zIndex: 100, bottom: 1, alignSelf: 'flex-end', paddingHorizontal: 5 }]}
                >
                    <Icon name='my-location' style={[styles.card, { backgroundColor: 'lightgrey', }]} size={30} color='grey' />
                </TouchableOpacity>




                <MapView
                    showsUserLocation={true}
                    showsPointsOfInterest={true}
                    followsUserLocation={true}

                    pitchEnabled={true}
                    showsMyLocationButton={true}

                    zoomEnabled

                    userLocationPriority='high'
                    //  onLayout={this.onLayout}


                    initialCamera={{
                        center: this.state.isStart == false ? {
                            latitude: currentLatitude,
                            longitude: currentLongitude,

                        } : {
                                latitude: markLatitude,
                                longitude: markLongitude,

                            },
                        pitch: 0,
                        heading: 1,
                        altitude: 1000,
                        zoom: 16,
                    }}

                    ref={ref => {
                        this.map = ref;
                    }}

                    fitToCoordinates


                    style={{ flex: 1, width, height }}
                    initialRegion={this.state.isStart == false ? {
                        latitude: currentLatitude,
                        longitude: currentLongitude,
                        latitudeDelta: 0.0070,
                        longitudeDelta: 0.0080
                    } : {
                            latitude: markLatitude,
                            longitude: markLongitude,
                            latitudeDelta: 0.0070,
                            longitudeDelta: 0.0080
                        }}

                    region={this.state.isStart == false ? {
                        latitude: currentLatitude,
                        longitude: currentLongitude,
                        latitudeDelta: 0.0070,
                        longitudeDelta: 0.0080
                    } : {
                            latitude: markLatitude,
                            longitude: markLongitude,
                            latitudeDelta: 0.0070,
                            longitudeDelta: 0.0080
                        }}


                    onMapReady={() => {

                        if (this._isMounted) {
                            this.setState({ isMapReady: true });
                        }
                    }}


                    onUserLocationChange={event => {

                        console.log('OnChange', event.nativeEvent.coordinate);
                        if (this.state.isMapReady && this._isMounted) {
                            this.setState({
                                //  region: region,
                                heading: event.nativeEvent.coordinate.heading,
                                currentLatitude: event.nativeEvent.coordinate.latitude, currentLongitude: event.nativeEvent.coordinate.longitude,
                                // MarkerLocation: region
                            })
                        }
                    }}
                >
                    {this.state.isMapReady &&
                        <MapView.Polyline
                            coordinates={this.state.coords}
                            geodesic={true}
                            lineCap='round'
                            lineDashPhase={6}
                            strokeColor="red" // fallback for when `strokeColors` is not supported by the map-provider
                            strokeColors={[
                                '#7F0000',
                                '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
                                '#B24112',
                                '#E5845C',
                                '#238C23',
                                '#7F0000'
                            ]}
                            strokeWidth={6}
                        />
                    }


                    {
                        this.state.isMapReady &&
                        < Marker
                            pointerEvents='none'
                            coordinate={this.state.isStart == false ? {
                                latitude: currentLatitude,
                                longitude: currentLongitude,
                            } : {
                                    latitude: markLatitude,
                                    longitude: markLongitude,
                                }}
                        >
                            <Animated.View>
                                <Image style={{ height: 40, width: 40, transform: [{ rotate: heading === undefined ? '0deg' : `${heading}deg` }] }} source={require('../assets/car.png')} />
                            </Animated.View>
                        </Marker>
                    }


                    {
                        this.state.isMapReady &&
                        < Marker
                            pointerEvents='none'
                            coordinate={{ latitude: randomLatitude, longitude: randomLongitude }}
                        >
                            <View>
                                <Icon name='location-on' size={50} color='#D63447' />
                            </View>
                        </Marker>
                    }

                </MapView >

            </View>

        );


    }
}

export default (MapsScreen)

const styles = StyleSheet.create({


    card: {
        elevation: 5,
        borderRadius: 3

    },
    container: {
        flex: 1,
        padding: 120,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center', zIndex: 99
    },

    payment: {
        top: 15,
        zIndex: 99,
        position: 'absolute',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'transparent',
        left: width / 4,
        height: 40,
        marginHorizontal: 15,
        paddingHorizontal: 10,

    },
    start: {
        position: 'absolute', zIndex: 100,
        bottom: 1, top: 60,
        position: 'absolute',
        justifyContent: 'center',
        left: width / 4,
        marginHorizontal: 20,
        paddingHorizontal: 10,
        alignItems: 'center',
        flexDirection: 'row',
    }
});
