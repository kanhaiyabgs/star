import React, { Component } from 'react';
import { YellowBox ,DatePickerAndroid, ToastAndroid, AsyncStorage, Picker, KeyboardAvoidingView, DatePickerIOS, ScrollView, Alert, TouchableOpacity, StyleSheet, Text, TextInput, View, Button } from 'react-native';
import { app, auth, functions, database } from './../../src/config';

export default class StarSignUp extends Component {

    constructor(props) {
        super(props);
        this.state = { myself:'someoneelse', language: 'india',fan_for: '', email: '', password: '', errorMessage: null, name: '', username: '', bio: '', cost: '', domain: '', subdomain: '' };
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


    handleBooking = async () => {
        //  ToastAndroid.show('hello tsfajsljfals', ToastAndroid.LONG);
        var that = this;

        var bookingId = this.uniqueId();
        //    ToastAndroid.show(bookingId, ToastAndroid.LONG);

        var fanId = that.props.navigation.state.params.fanId;
        var starId = that.props.navigation.state.params.starId;
        var amount = that.props.navigation.state.params.amount;
        //        ToastAndroid.show(fanId, ToastAndroid.LONG);
        ToastAndroid.show(fanId, ToastAndroid.LONG);

        // videoUrl can't be empty in set in database , this was giving error , so had to set it to 0
        ToastAndroid.show(starId + that.state.fan_for + that.state.fan_by + that.state.message, ToastAndroid.LONG);

        YellowBox.ignoreWarnings(['Require cycle:']);

        // some optimization in database storing can be done so that less data needs to be read 
        // don't forget to set region of function calling. You were stuck here 
        var payment_request_instamojo_market_place = app.functions('asia-east2').httpsCallable('payment_request_instamojo_market_place_v2');
        await payment_request_instamojo_market_place({
            uuid: starId,
            amount: amount,
            purpose: bookingId,  // booking id is further used by payment webhook so sending this
            buyer_name: that.state.fan_by
        }).then((result) => {
            var data = result.data;
            if (data['status'] == 'success') {
                database.ref('reservation').child('booking_fan').child(fanId).child(bookingId).child('status').set(0);
                database.ref('reservation').child('booking_fan').child(fanId).child(bookingId).child('info').set({ starId: starId, for: that.state.fan_for, from: that.state.fan_by, message: that.state.message, amount: amount, videoUrl: '' });

                // creating data in database for payment info
                database.ref('instamojo_payment').child(bookingId).child('info').set({ starId: starId, fanId: fanId });
                database.ref('instamojo_payment').child(bookingId).child('status').set(0);
                database.ref('instamojo_payment').child(bookingId).child('videoUrl').set('');
                database.ref('instamojo_payment').child(bookingId).child('amount').set(amount);


                // this videoUrl child may cause error . please go through this again 
                //      database.ref('reservation').child('booking_fan').child(fanId).child(bookingId).child('info').child('videoUrl').set('');
                database.ref('reservation').child('booking_star').child(starId).child(bookingId).child('status').set(0);
                database.ref('reservation').child('booking_star').child(starId).child(bookingId).child('info').set({ fanId: fanId, for: that.state.fan_for, from: that.state.fan_by, message: that.state.message, amount: amount, videoUrl: '' });


                database.ref('reservation').child('booking_fan').child(fanId).child(bookingId).child('payment').child('payment_request_id').set(data['payment_request_id']);
                //ToastAndroid.show(data['url'], ToastAndroid.LONG);
                that.props.navigation.navigate('PaymentPage', { payment_request_id: data['payment_request_id'], url: data['url'] });

            }
            else {
                ToastAndroid.show('Payment link generation failed', ToastAndroid.LONG);
            }

        })
            .catch((error) => {
                ToastAndroid.show(error.message + error.code + error.details, ToastAndroid.LONG);
            })

        //Alert.alert('Booked with booking id - '+ bookingId);

    };

    render() {
        return (
            <View style={{ marginLeft: 10, marginRight: 10 }}>
                <Text style={{ textAlign: 'center', fontWeight: "bold", height: 40, width: '90%', marginTop: 8, marginBottom: 12, fontSize: 28, color: '#00BCD4' }}>Order</Text>
                <Text style={{ fontWeight: "bold", height: 20, width: '90%', marginTop: 15, marginBottom: 12, fontSize: 12, color: '#00BCD4' }}>This Video is for </Text>


                <Picker
                        style={{ height: 50, width: 200 }}
                        selectedValue={this.state.myself}
                        onValueChange={(itemValue, itemIndex) => this.setState({ myself: itemValue })}
                    >

                        <Picker.Item label="SomeoneElse" value="someoneelse" />
                        <Picker.Item label="Myself" value="myself" />
                    </Picker>
                <KeyboardAvoidingView style={{ marginLeft: 10, marginRight: 10 }}>
                {(this.state.myself == 'someoneelse') ? (
                    <View>
                        <Text style={{ fontWeight: "bold" }}>Their name is </Text>
                        <TextInput placeholder="For" autoCapitalize="none" style={styles.textInput} onChangeText={fan_for => this.setState({ fan_for })} value={this.state.fan_for}
                            onSubmitEditing={() => this.fan_by_input.focus()}>
                        </TextInput>
                        </View>

                    ) : (
                        <Text></Text>
                    )}
                    
                    
                    <Text style={{ fontWeight: "bold" }}>My name is </Text>
                    <TextInput placeholder="From" autoCapitalize="none" style={styles.textInput} onChangeText={fan_by => this.setState({ fan_by })} value={this.state.fan_by}
                        ref={(input) => this.fan_by_input = input} onSubmitEditing={() => this.message_input.focus()}>
                    </TextInput>
                    <Text style={{ fontWeight: "bold" }}>Message</Text>
                    <TextInput placeholder="Message goes here" autoCapitalize="none" multiline={true}
                        style={styles.textInput} onChangeText={message => this.setState({ message })} value={this.state.message}
                        ref={(input) => this.message_input = input}></TextInput>
                </KeyboardAvoidingView>

                <TouchableOpacity style={styles.buttonContainer}>
                    <Text style={styles.textStyle} onPress={this.handleBooking}>Book</Text>
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