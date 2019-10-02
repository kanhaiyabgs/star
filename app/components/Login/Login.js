import React,{Component} from 'react';
import {StyleSheet, TouchableOpacity, KeyboardAvoidingView,  ToastAndroid, Text, TextInput, View, Button } from 'react-native';
import {auth} from './../../src/config';
import { ScrollView } from 'react-native-gesture-handler';

export default class Login extends Component{
    state = {email:'', password:'', errorMessage:null};

    handleLogin = () => {
        
        // To do firebase stuff
        const {email, password} = this.state;
        try {
            auth.signInWithEmailAndPassword(email, password).then(() => this.props.navigation.navigate('HomeScreen')).catch(error => this.setState({errorMessage: error.message}));            
        } catch (error) {
            ToastAndroid.show('Log in failed. Please try again' + error);            
        }
        
    };

    render(){
        return(
            <ScrollView style={styles.container}>
                <Text style={{textAlign: 'center', fontSize:35, marginTop:'10%', color: 'black', fontWeight:'bold'}}>Login</Text>
                <KeyboardAvoidingView style={{marginTop:'15%',  marginLeft: 10, marginRight: 10 }}>
                

                <Text style={{ fontWeight: "bold", marginLeft:'15%', color:'black' }}>Email</Text>
                <TextInput style={styles.textInput} autoCapitalize="none"
                  placeholder="Email goes here" onChangeText={email => this.setState({email})}
                  value={this.state.email} onSubmitEditing={() => this.passwordInput.focus()}>
                </TextInput>

                <Text style={{ fontWeight: "bold", marginLeft:'15%', color:'black' }}>Password</Text>
                <TextInput secureTextEntry style={styles.textInput} autoCapitalize="none"
                  placeholder="Password goes here" onChangeText={password=>this.setState({password})}
                  value={this.state.password} ref={(input) => this.passwordInput = input}>
                </TextInput>

                <TouchableOpacity style={styles.buttonContainer} onPress={this.handleLogin}>
                    <Text style={styles.button}>Log In</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonContainer} onPress={() => this.props.navigation.navigate('FanSignUp')}>
                    <Text style={styles.button}>Don't have an account? Sign Up</Text>
                </TouchableOpacity>
                </KeyboardAvoidingView>

            </ScrollView>

        );
    }


}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      //justifyContent: 'center',
      //alignItems: 'center',
      backgroundColor:'yellow' //'#DCDCDC',
    },
    textInput: {
      marginTop: 10,
      width: '70%',
      color:'black',

      paddingTop: 5,
      paddingBottom: 9,
      marginBottom: 13,
      fontSize: 18,
      marginLeft: '15%',
      marginRight: '15%',
      backgroundColor: '#00BCD4',
      borderRadius: 10,
      borderWidth: 2,
      borderColor: 'black'
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