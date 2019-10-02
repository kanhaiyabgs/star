import React, { Component } from 'react';
import { DatePickerAndroid, ToastAndroid, AsyncStorage, Platform, Picker, KeyboardAvoidingView, DatePickerIOS, ScrollView, Alert, TouchableOpacity, StyleSheet, Text, TextInput, View, Button } from 'react-native';
import { auth, database } from './../../src/config';

export default class FanSignUp extends Component {

    constructor(props) {
        super(props);
        this.state = { code: ''};
    }

    verifyCode = async () => {
        // **** This code needs to go to firebase function *****  
        var value = (parseInt(this.state.code) *25 + 99989)-78259 ;

        //ToastAndroid.show(this.state.code, ToastAndroid.LONG);
        //ToastAndroid.show(JSON.stringify(value), ToastAndroid.LONG);



        var ref = database.ref('authentication');
        //ToastAndroid.show(JSON.stringify(ref.child(value)), ToastAndroid.LONG);
        ref.child(value).once('value', (snapshot) => {
            if(snapshot.val() == null){
                Alert.alert('Wrong verification code')
            }
            else{
                this.props.navigation.navigate('StarSignUp');
            }
        });
    };

    render() {
        return (
            <View>
                <Text style={{ fontWeight: "bold" }}>Verification Code</Text>
                    <TextInput placeholder="Code goes here" keyboardType="numeric" autoCapitalize="none" style={styles.textInput} onChangeText={code => this.setState({ code })} value={this.state.code}>
                    </TextInput>

                    <TouchableOpacity style={styles.buttonContainer}  onPress={this.verifyCode}>
                        <Text style={styles.textStyle} >Submit </Text>
                    </TouchableOpacity>

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
    textStyle:{
        color:'#fff',
        textAlign:'center',
    },
    textInput: {
        height: 40,
        width: '90%',
        borderColor: '#00BCD4',
        borderWidth: 1,
        borderRadius:10,
        marginTop: 8,
        marginBottom:12
    },
    buttonContainer:{
        marginTop: 10,
        paddingTop: 15,
        paddingBottom: 15,
        marginLeft: 30,
        marginRight: 30,
        backgroundColor: '#00BCD4',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff'
    }
});