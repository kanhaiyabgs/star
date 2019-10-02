import React, { Component } from 'react';
import { ToastAndroid, ScrollView, Alert, TouchableOpacity, StyleSheet, Text, TextInput, View, Button } from 'react-native';
import { app, functions, auth, database } from '../../src/config';

export default class FirstPage extends Component {

  constructor(props) {
    super(props);
  }
  logOut = () => {
    app.auth().signOut().then(function() {
      ToastAndroid.show('log out succesfull ' , ToastAndroid.SHORT);
      // Sign-out successful.
    }, function(error) {
      ToastAndroid.show('log out nhi hu a  ' , ToastAndroid.SHORT);
      // An error happened.
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => this.props.navigation.navigate('Login')}>
          <Text style={styles.button} >Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => this.props.navigation.navigate('FanSignUp')}>
          <Text style={styles.button}  >Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => this.logOut()}>
          <Text style={styles.button}  >Log Out</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => this.props.navigation.navigate('EnrollTalent')}>
          <Text style={styles.button}  >Enroll as a Star</Text>
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
    backgroundColor:'yellow' //'#DCDCDC',
  },
  buttonContainer: {
    marginTop: 15,
    width: '70%',
    paddingTop: 13,
    paddingBottom: 13,
    marginBottom: 15,
    marginLeft: '15%',
    marginRight: '15%',
    backgroundColor: '#696969',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black'
  },
  button: {
    //justifyContent:'center',
    //alignItems: 'center',
    textAlign: 'center',
    color: 'white',

  }
});