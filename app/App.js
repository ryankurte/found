/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Alert, ScrollView, TouchableOpacity} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

import { BleManager } from 'react-native-ble-plx';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  state = {
    message: "",
    location: {
      latitude: null,
      longitude: null,
      altitude: null,
    },
    devices: {}
  };

  constructor() {
    super();
    this.manager = new BleManager();
  }

  componentWillMount = () => {
    this.setState({message: "Mount"});

    navigator.geolocation.setRNConfiguration({skipPermissionRequests: true});
    navigator.geolocation.requestAuthorization();

    this.findCoordinates();

    let id = navigator.geolocation.watchPosition( (location) => {
      this.setState({ location });
    });

    const subscription = this.manager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        this.setState({message: "BLE connected"});
        subscription.remove();
      }
    }, true);

    this.manager.startDeviceScan(null, null, (error, d) => {
      if (error) {
        alert(error);
        return;
      }

      let device = {name: d.name, rssi: d.rssi, manufacturingData: d.manufacturerData };

      let devices = this.state.devices;
      devices[d.id] = device;

      this.setState({ devices })
    })
   
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.contentContainer}>

      <View style={styles.container}>
      <Text>Hello</Text>
        {this.state.message && <Text>Message: {'\r' + JSON.stringify(this.state.message, null, 4)}</Text>}
        {this.state.location && <Text>Location: {'\r' + JSON.stringify(this.state.location, null, 4)}</Text>}
        {this.state.devices && <Text>Devices: {'\r' + JSON.stringify(this.state.devices, null, 4)}</Text>}
      </View>

      </ScrollView>
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
  contentContainer: {
    paddingVertical: 20
  }
});
