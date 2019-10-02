import React, { Component } from 'react';
import { YellowBox ,DatePickerAndroid, ToastAndroid, AsyncStorage, Picker, KeyboardAvoidingView, DatePickerIOS, ScrollView, Alert, TouchableOpacity, StyleSheet, Text, TextInput, View, Button } from 'react-native';
import { app, auth, functions, database } from './../../src/config';

export default class BankDetails extends Component {

    constructor(props) {
        super(props);
        this.state = { name: '', account_number: '', ifsc_code: ''};
    }

    s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    uniqueId = () => {
        return (
            this.s4() + this.s4() + this.s4() + this.s4() + this.s4()
        );
    };


    submit_bank_details = async () => {
        //  ToastAndroid.show('hello tsfajsljfals', ToastAndroid.LONG);
        var that = this;

        YellowBox.ignoreWarnings(['Require cycle:']);

        // some optimization in database storing can be done so that less data needs to be read 
        // don't forget to set region of function calling. You were stuck here 
        var bank_details_upload_instamojo =app.functions('asia-east2').httpsCallable('bank_details_upload_instamojo_v1');
        await bank_details_upload_instamojo({
            name: that.state.name,
            account_number: that.state.account_number,
            ifsc_code: that.state.ifsc_code,
            uuid: app.auth().currentUser.uid
        }).then((result) => {
                //ToastAndroid.show('Bank details updation successful', ToastAndroid.SHORT);
                that.props.navigation.navigate('HomeScreen');

        })
            .catch((error) => {
                //ToastAndroid.show(error.message + error.code + error.details, ToastAndroid.LONG);
                Alert.alert('error updating bank details');
            })

        //Alert.alert('Booked with booking id - '+ bookingId);

    };

    render() {
        return (
            <ScrollView style={{ marginLeft: 10, marginRight: 10 }}
            scrollEnabled={true}>
            <Text style={{ textAlign:'center', fontWeight: "bold", height: 40,  width: '90%', marginTop: 8, marginBottom:12, fontSize:28, color: '#00BCD4' }}>Bank Details</Text>
            <KeyboardAvoidingView style={{ marginLeft: 10, marginRight: 10 }}>
                
                    <Text style={{ fontWeight: "bold" }}>Account Holder Name</Text>
                    <TextInput placeholder="For" autoCapitalize="none" style={styles.textInput} onChangeText={name => this.setState({ name })} value={this.state.name}
                        onSubmitEditing={() => this.fan_by_input.focus()}>
                    </TextInput>
                    <Text style={{ fontWeight: "bold" }}>Account Number</Text>
                    <TextInput placeholder="From" autoCapitalize="none" style={styles.textInput} onChangeText={account_number => this.setState({ account_number })} value={this.state.account_number}
                        ref={(input) => this.fan_by_input = input} onSubmitEditing={() => this.message_input.focus()}>
                    </TextInput>
                    <Text style={{ fontWeight: "bold" }}>IFSC code</Text>
                    <TextInput placeholder="Message goes here" autoCapitalize="none"
                        style={styles.textInput} onChangeText={ ifsc_code => this.setState({ ifsc_code })} value={this.state.ifsc_code}
                        ref={(input) => this.message_input = input}></TextInput>
                

                <TouchableOpacity style={styles.buttonContainer}>
                    <Text style={styles.textStyle} onPress={this.submit_bank_details}>Submit</Text>
                </TouchableOpacity>
                </KeyboardAvoidingView>
                </ScrollView>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textStyle: {
        color: '#fff',
        textAlign: 'center',
    },
    textInput: {
        height: 40,
        width: '90%',
        borderColor: '#00BCD4',
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 8,
        marginBottom: 12
    },
    buttonContainer: {
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