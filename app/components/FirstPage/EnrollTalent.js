import React, { Component } from 'react';
import { DatePickerAndroid, Linking, ToastAndroid, AsyncStorage, Platform, Picker, KeyboardAvoidingView, DatePickerIOS, ScrollView, Alert, TouchableOpacity, StyleSheet, Text, TextInput, View, Button } from 'react-native';
import { auth, database } from './../../src/config';
import axios from 'axios';
//import mailgun from 'mailgun.js'

export default class EnrollTalent extends Component {

    constructor(props) {
        super(props);
        this.state = { social_media: 'select', email: '', number: '', errorMessage: null, name: '', social_media_handle: '' };
    }

    handleRegistration = async () => {
        var that = this;
        var body = {
            name: this.state.name,
            social_media: this.state.social_media,
            social_media_handle: this.state.social_media_handle,
            email: this.state.email,
            number: this.state.number
        }
        try {
            // https://github.com/axios/axios/issues/2235
            // can'find varibale btoa in axios version greater tha 0.18.0 so installed 0.18.0
            axios({
                method: 'post',
                url: 'https://api.mailgun.net/v3/sandboxdbf73cd344c5447c972a33bba8be7610.mailgun.org/messages',
                auth: {
                    username: 'api',
                    password: '9aa46dba2dca67af7eea7b79b97629f2-19f318b0-4f808cfd'
                },
                params: {
                    from: this.state.name + '@sandboxdbf73cd344c5447c972a33bba8be7610.mailgun.org',
                    to: 'kanhaiyabgs002@gmail.com',
                    subject: 'New registration',
                    text: JSON.stringify(body)
                }
            }, {
                'Content-type': 'multipart/form-data'
            }).then(respinse => {
                Alert.alert('Form Submitted, will get back to you')
                //            ToastAndroid.show(JSON.stringify(respinse), ToastAndroid.LONG);
            })



        } catch (error) {
            ToastAndroid.show('Registration failed ' + error);

        }


    };

    render() {
        return (
            <ScrollView style={{ marginLeft: 10, marginRight: 10 }}
                scrollEnabled={true}>
                <Text style={{ textAlign: 'center', fontWeight: "bold", height: 40, width: '90%', marginTop: 8, marginBottom: 12, fontSize: 28, color: '#00BCD4' }}>SignUp</Text>
                <KeyboardAvoidingView style={{ marginLeft: 10, marginRight: 10 }}>
                    <Text style={{ fontWeight: "bold" }}>Full Name</Text>
                    <TextInput placeholder="Full Name" autoCapitalize="none" style={styles.textInput} onChangeText={name => this.setState({ name })} value={this.state.name}
                        onSubmitEditing={() => this.emailInput.focus()}>
                    </TextInput>
                    <Text style={{ fontWeight: "bold" }}>Email</Text>
                    <TextInput placeholder="Email goes here" autoCapitalize="none"
                        style={styles.textInput} onChangeText={email => this.setState({ email })} value={this.state.email}
                        ref={(input) => this.emailInput = input} onSubmitEditing={() => this.phoneNumberInput.focus()}></TextInput>
                    <Text style={{ fontWeight: "bold" }}>Phone number(NEVER SHARED)</Text>
                    <TextInput placeholder="number" keyboardType="numeric" autoCapitalize="none" style={styles.textInput} onChangeText={number => this.setState({ number })} value={this.state.number}
                        ref={(input) => this.phoneNumberInput = input}>
                    </TextInput>
                    <Text style={{ fontWeight: "bold", marginTop: 8, marginBottom: 4 }}> Where to find you?</Text>
                    <Picker
                        style={{ height: 50, width: 200 }}
                        selectedValue={this.state.social_media}
                        onValueChange={(itemValue, itemIndex) => this.setState({ social_media: itemValue })}
                    >
                        <Picker.Item label="Select" value="" />
                        <Picker.Item label="Twitter" value="Twitter" />
                        <Picker.Item label="Instagram" value="Instagram" />
                        <Picker.Item label="YouTube" value="YouTube" />
                        <Picker.Item label="Facebook" value="Facebook" />
                        <Picker.Item label="Twitch" value="Twitch" />
                        <Picker.Item label="TikTok" value="TikTok" />
                    </Picker>
                    <Text style={{ fontWeight: "bold" }}>Your handle</Text>
                    <TextInput placeholder="@kumarbgs" autoCapitalize="none" style={styles.textInput} onChangeText={social_media_handle => this.setState({ social_media_handle })} value={this.state.social_media_handle}
                        ref={(input) => this.social_media_handle = input}>
                    </TextInput>

                </KeyboardAvoidingView>

                <TouchableOpacity style={styles.buttonContainer} onPress={this.handleRegistration}>
                    <Text style={styles.textStyle} >Submit </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonContainer} onPress={() => this.props.navigation.navigate('OTPverification')}>
                    <Text style={styles.textStyle} >Already verified ? Complete Registration </Text>
                </TouchableOpacity>
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