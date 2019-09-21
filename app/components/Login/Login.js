import React,{Component} from 'react';
import {StyleSheet, ToastAndroid, Text, TextInput, View, Button } from 'react-native';
import {auth} from './../../src/config';

export default class Login extends Component{
    state = {email:'', password:'', errorMessage:null};

    handleLogin = () => {
        
        // To do firebase stuff
        const {email, password} = this.state;
        auth.signInWithEmailAndPassword(email, password).then(() => this.props.navigation.navigate('HomeScreen')).catch(error => this.setState({errorMessage: error.message}));
    };

    render(){
        return(
            <View style={styles.container}>
                <Text>Login</Text>
                {this.state.errorMessage && <Text style={{color:'red'}}>{this.state.errorMessage}</Text>}

                <TextInput style={styles.textInput} autoCapitalize="none"
                  placeholder="Email goes here" onChangeText={email => this.setState({email})}
                  value={this.state.email}>
                </TextInput>

                <TextInput secureTextEntry style={styles.textInput} autoCapitalize="none"
                  placeholder="Password goes here" onChangeText={password=>this.setState({password})}
                  value={this.state.password}>
                </TextInput>

                <Button title="Login" onPress={this.handleLogin}></Button>
                <Button title="Don't have an account? Sign Up"
                  onPress={() => this.props.navigation.navigate('FanSignUp')}>
                </Button>
            </View>

        );
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