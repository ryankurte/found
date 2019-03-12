/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Alert, TouchableOpacity} from 'react-native';
import MapView, {Marker} from 'react-native-maps';


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  state = {
    location: {
      latitude: null,
      longitude: null,
      altitude: null,
    }
  };

  componentWillMount = () => {
    console.log("Requesting geolocation");
    navigator.geolocation.setRNConfiguration({skipPermissionRequests: true});
    navigator.geolocation.requestAuthorization();

    this.findCoordinates();

    let id = navigator.geolocation.watchPosition( (location) => {
      this.setState({ location });
    });

   
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Loc: {JSON.stringify(this.state.location)}</Text>
      </View>
    );
  }

  findCoordinates = () => {
    console.log("Attempting to fetch current position");
    navigator.geolocation.getCurrentPosition(
      location => {
        console.log("Got position: " + location);
        this.setState({ location });
      },
      error => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
