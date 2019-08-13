import React, { Component } from 'react';
import {ToastAndroid, StyleSheet, Text, TextInput, View, Button } from 'react-native';
import {auth, database} from './../../src/config';
import User from './../../modals/User'

export default class SignUp extends Component {
  constructor(props){
    super(props);
    this.handleSignUp = this.handleSignUp.bind(this);
  }
    state = { email: '', password: '', errorMessage: null, name:'', username: '', domain: '' };
    

    handleSignUp = async () => {
      const obj = {};
      obj.name = this.state.name;
      obj.username = this.state.username;
      obj.email = this.state.email;
      obj.domain = this.state.domain;
      flag = false;
      
        // TODO: Firebase stuff
        
        
        
      await auth.createUserWithEmailAndPassword(this.state.email, this.state.password).then( 
            auth.onAuthStateChanged(function(user) {
                if (user) {
                  const userid = user.uid;
                    //database.ref('users').set(obj);
                    //database.ref('user').child(userid).set('fsdajflask');
                  //database.ref('fan').child(userid).set({name: obj.name, username:obj.username, email:obj.email, domain: obj.domain});
                  database.ref(obj.domain).child(userid).set({name: obj.name, username:obj.username, email:obj.email});
                  
                  
                    //database.ref('star').child(userid).set(user);
                    
                  // User is signed in.
                } else {
                  // No user is signed in.
                }
              })).catch(error => this.setState({errorMessage: error.message}));
          this.props.navigation.navigate('Home');          
    };

    render() {
        return (
            <View style={styles.container}>
                <Text>SignUp</Text>
                <TextInput placeholder="Name goes here" autoCapitalize="none" style={styles.textInput} onChangeText={name => this.setState({name})} value={this.state.name}>
                </TextInput>
                <TextInput placeholder="User name goes here" autoCapitalize="none" style={styles.textInput} onChangeText={username => this.setState({username})} value={this.state.username}>
                </TextInput>
                
                {this.state.errorMessage && <Text style={{ color: 'red' }}>{this.state.errorMessage}</Text>}
                <TextInput placeholder="Email goes here" autoCapitalize="none" 
                  style={styles.textInput} onChangeText={email => this.setState({email})} value={this.state.email} ></TextInput>
                
                <TextInput secureTextEntry placeholder="Password goes here" autoCapitalize="none"
                  style={styles.textInput} onChangeText={password => this.setState({password})} 
                  value={this.state.password}>

                </TextInput>

                <TextInput placeholder="Actor, youtuber who you are" autoCapitalize="none" style={styles.textInput} onChangeText={domain => this.setState({domain})} value={this.state.domain}>
                </TextInput>

                <Button title="Sign Up" onPress={this.handleSignUp}></Button>
                <Button title="Already have an account? Login" onPress={ () => this.props.navigation.navigate('Login') }></Button>
            </View>

        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput: {
        height: 40,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 8,
    }
});