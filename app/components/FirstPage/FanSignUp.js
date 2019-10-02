import React, { Component } from 'react';
import { DatePickerAndroid, ToastAndroid, AsyncStorage, Platform, Picker, KeyboardAvoidingView, DatePickerIOS, ScrollView, Alert, TouchableOpacity, StyleSheet, Text, TextInput, View, Button } from 'react-native';
import { auth, database } from './../../src/config';

export default class FanSignUp extends Component {

    constructor(props) {
        super(props);
        this.state = { language: 'select language', email: '', password: '', errorMessage: null, name: '', username: '', date: 'Select date' };
    }

    handleSignUp = async () => {
        var that = this;

        await auth.createUserWithEmailAndPassword(this.state.email, this.state.password).then(() => {
            auth.onAuthStateChanged(function (user) {
                if (user) {
                    // If user is successfully created in authentication page
                    const userid = user.uid;
                    database.ref('fan').child(userid).child('public').set({ name: that.state.name.toLowerCase() });
                    database.ref('fan').child(userid).child('private').set({ email: that.state.email, username: that.state.username.toLowerCase(), birthday: that.state.date });
                    database.ref('star_or_fan_check').child(userid).set({check: 'fan'});
                    try{
                        AsyncStorage.setItem('language', that.state.language);                        
                    }
                    catch (error){
                        Alert.alert(error.message);
                    }


                } else {
                    Alert.alert('User creation failed');
                }
                //ToastAndroid.show(AsyncStorage.getItem('language'));
                that.props.navigation.navigate('HomeScreen');
            })
        })
            .catch(error => this.setState({ errorMessage: error.message }));

    };

    setDateAndroid = async () => {
        try {
            const {
                action, year, month, day,
            } = await DatePickerAndroid.open({
                date: new Date(),
           });
            if (action !== DatePickerAndroid.dismissedAction) {
                this.setState({ date: `${day}/${month + 1}/${year}` });
            }
        } catch ({ code, message }) {
            console.warn('Cannot open date picker', message);
        }
    };

    render() {
        return (
            <ScrollView style={styles.container}
                scrollEnabled={true}  showsVerticalScrollIndicator={false}>
                <Text style={{textAlign: 'center', fontSize:35, marginTop:'5%', color: 'black', fontWeight:'bold'}}>SignUp</Text>
                <KeyboardAvoidingView style={{ marginTop:'15%',marginLeft: 10, marginRight: 10 }}>
                    <Text style={{fontWeight: "bold", marginLeft:'15%', color:'black'}}>Full Name</Text>
                    <TextInput placeholder="Full Name" autoCapitalize="none" style={styles.textInput} onChangeText={name => this.setState({ name })} value={this.state.name}
                        onSubmitEditing={() => this.usernameInput.focus()}>
                    </TextInput>
                    <Text style={{ fontWeight: "bold", marginLeft:'15%', color:'black'}}>Username</Text>
                    <TextInput placeholder="User name" autoCapitalize="none" style={styles.textInput} onChangeText={username => this.setState({ username })} value={this.state.username}
                        ref={(input) => this.usernameInput = input} onSubmitEditing={() => this.emailInput.focus()}>
                    </TextInput>
                    <Text style={{fontWeight: "bold", marginLeft:'15%', color:'black'}}>Email</Text>
                    <TextInput placeholder="Email goes here" autoCapitalize="none"
                        style={styles.textInput} onChangeText={email => this.setState({ email })} value={this.state.email} 
                        ref={(input) => this.emailInput = input} onSubmitEditing={() => this.passwordInput.focus()}></TextInput>
                    <Text style={{fontWeight: "bold", marginLeft:'15%', color:'black'}}>Password</Text>
                    <TextInput secureTextEntry placeholder="Password goes here" autoCapitalize="none"
                        style={styles.textInput} onChangeText={password => this.setState({ password })}
                        value={this.state.password}
                        ref={(input) => this.passwordInput = input}>
                    </TextInput>

                    <Text style={{fontWeight: "bold", marginLeft:'15%', marginBottom:10, color:'black'}}>Birthday Date</Text>
                    {
                        Platform.OS == 'ios' ? (
                            <DatePickerIOS
                                date={this.state.date}
                                onDateChange={this.setDate}
                            />

                        ) :
                            (
                                <TouchableOpacity onPress={() => this.setDateAndroid()}>
                                    <View >
                                        <Text style={{fontWeight: "bold", marginLeft:'15%', color:'black'}}>
                                            {this.state.date}
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                            )
                    }

                    <Picker
                        style={{fontWeight: "bold", marginLeft:'15%', marginBottom:10, color:'black'}}
                        // height: 50, width: 200
                        selectedValue={this.state.language}
                        onValueChange={(itemValue, itemIndex) => this.setState({ language: itemValue })}
                    >
                        <Picker.Item label="Hindi" value="Hindi" />
                        <Picker.Item label="Marathi" value="Marathi" />
                        <Picker.Item label="Telgu" value="Telgu" />
                        <Picker.Item label="Kannad" value="Kannad" />
                        <Picker.Item label="Tamil" value="Tamil" />
                        <Picker.Item label="Malyalam" value="Malyalam" />
                        <Picker.Item label="Bengali" value="Bengali" />
                        <Picker.Item label="Gujrati" value="Gujrati" />
                        <Picker.Item label="Panjabi" value="Punjabi" />
                        <Picker.Item label="Bhojpuri" value="Bhojpuri" />
                        <Picker.Item label="Oriya" value="Oriya" />
                    </Picker>

                </KeyboardAvoidingView>

                <TouchableOpacity style={styles.buttonContainer}>
                    <Text style={styles.button} onPress={this.handleSignUp}>SignUp </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonContainer}>
                    <Text style={styles.button} onPress={() => this.props.navigation.navigate('Login')}>Already have an account? Login</Text>
                </TouchableOpacity>
            </ScrollView>

        )
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
