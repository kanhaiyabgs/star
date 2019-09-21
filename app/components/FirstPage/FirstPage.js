import React, { Component } from 'react';
import { ToastAndroid, ScrollView, Alert, TouchableOpacity, StyleSheet, Text, TextInput, View, Button } from 'react-native';
import { app,functions, auth, database } from '../../src/config';

export default class FirstPage extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={StyleSheet.buttonContainer}>
          <Button style={StyleSheet.button} title="Log In" onPress={() => this.props.navigation.navigate('Login')}></Button>
        </TouchableOpacity>
        <TouchableOpacity style={StyleSheet.buttonContainer}>
          <Button style={StyleSheet.button} title="Sign Up" onPress={() => this.props.navigation.navigate('FanSignUp')}></Button>
        </TouchableOpacity>
        <TouchableOpacity style={StyleSheet.buttonContainer}>
          <Button style={StyleSheet.button} title="Enroll as a Star" onPress={() => this.props.navigation.navigate('EnrollTalent')}></Button>
        </TouchableOpacity>
      </View>

    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#f5f6fa',
  },
  buttonContainer: {
    //width: 100,
    paddingTop: 20,
    paddingBottom: 20,
  },
  button: {
    width: 100,
    paddingTop: 10,
    paddingBottom: 20,
    borderColor: 'black',
    //backgroundColor:'#D3D3D3',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 25
  }
});