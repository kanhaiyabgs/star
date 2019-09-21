import React, { Component } from 'react';
import { DatePickerAndroid, ToastAndroid, AsyncStorage,  Picker, KeyboardAvoidingView, DatePickerIOS, ScrollView, Alert, TouchableOpacity, StyleSheet, Text, TextInput, View, Button } from 'react-native';
import { auth, database } from './../../src/config';

export default class StarSignUp extends Component {

    constructor(props) {
        super(props);
        this.state = { language: 'india', email: '', password: '', errorMessage: null, name: '', username: '', bio:'', cost:'', domain:'', subdomain:'' };
    }

    handleSignUp = async () => {
        var that = this;

        await auth.createUserWithEmailAndPassword(this.state.email, this.state.password).then(() => {
            auth.onAuthStateChanged(function (user) {
                if (user) {
                    // If user is successfully created in authentication page
                    const userid = user.uid;
                    database.ref('star').child(userid).child('public').set({ name: that.state.name.toLowerCase(), username: that.state.username.toLowerCase(), domain: that.state.domain.toLowerCase(), subDomain: that.state.subdomain.toLowerCase(), bio: that.state.bio, cost: that.state.cost });
                    database.ref('star').child(userid).child('private').set({ email: that.state.email});
                    database.ref('cluster').child(that.state.language.toLowerCase()).child(that.state.domain.toLowerCase()).child('featured').child('count').once('value', (snap) => {
                        if(snap.val() < 4){
                            database.ref('cluster').child(that.state.language.toLowerCase()).child(that.state.domain.toLowerCase()).child('featured').child(userid).set(1);
                            database.ref('cluster').child(that.state.language.toLowerCase()).child(that.state.domain.toLowerCase()).child('featured').child('count').set(snap.val()+ 1);
                        }

                    })
                    database.ref('cluster').child(that.state.language.toLowerCase()).child(that.state.domain.toLowerCase()).child(that.state.subdomain.toLowerCase()).child(userid).set(1);
                    database.ref('cluster').child(that.state.language.toLowerCase()).child(that.state.domain.toLowerCase()).child('subdomain').child(that.state.subdomain.toLowerCase()).set(1);
                    database.ref('name').child(that.state.name.toLowerCase()).child(userid).set(1);
                    database.ref('star_or_fan_check').child(userid).set({check: 'star'});
                    try{
                        AsyncStorage.setItem('language', that.state.language);                        
                    }
                    catch (error){
                        Alert.alert(error.message);
                    }

                    that.props.navigation.navigate('MediaUpload');


                } else {
                    Alert.alert('User creation failed');
                }
            })
        })
            .catch(error => this.setState({ errorMessage: error.message }));

    };
    
    render() {
        return (
            <ScrollView style={{ marginLeft: 10, marginRight: 10 }}
                scrollEnabled={true}>
                <Text style={{ textAlign:'center', fontWeight: "bold", height: 40,  width: '90%', marginTop: 8, marginBottom:12, fontSize:28, color: '#00BCD4' }}>Welcome</Text>
                <KeyboardAvoidingView style={{ marginLeft: 10, marginRight: 10 }}>
                    <Text style={{ fontWeight: "bold" }}>Full Name</Text>
                    <TextInput placeholder="Full Name" autoCapitalize="none" style={styles.textInput} onChangeText={name => this.setState({ name })} value={this.state.name}
                        onSubmitEditing={() => this.usernameInput.focus()}>
                    </TextInput>
                    <Text style={{ fontWeight: "bold" }}>Username</Text>
                    <TextInput placeholder="User name" autoCapitalize="none" style={styles.textInput} onChangeText={username => this.setState({ username })} value={this.state.username}
                        ref={(input) => this.usernameInput = input} onSubmitEditing={() => this.emailInput.focus()}>
                    </TextInput>
                    <Text style={{ fontWeight: "bold" }}>Email</Text>
                    <TextInput placeholder="Email goes here" autoCapitalize="none"
                        style={styles.textInput} onChangeText={email => this.setState({ email })} value={this.state.email} 
                        ref={(input) => this.emailInput = input} onSubmitEditing={() => this.passwordInput.focus()}></TextInput>
                    <Text style={{ fontWeight: "bold" }}>Password</Text>
                    <TextInput secureTextEntry placeholder="Password goes here" autoCapitalize="none"
                        style={styles.textInput} onChangeText={password => this.setState({ password })}
                        value={this.state.password}
                        ref={(input) => this.passwordInput = input} onSubmitEditing={() => this.bioInput.focus()}>
                    </TextInput>
                    <Text style={{ fontWeight: "bold" }}>Bio</Text>
                    <TextInput placeholder="Bio goes here" autoCapitalize="none" style={styles.textInput} onChangeText={bio => this.setState({ bio })} value={this.state.bio}
                        ref={(input) => this.bioInput = input} onSubmitEditing={() => this.chargeInput.focus()}>
                    </TextInput>
                    <Text style={{ fontWeight: "bold" }}>Charge</Text>
                    <TextInput placeholder="charge goes here" keyboardType="numeric" autoCapitalize="none" style={styles.textInput} onChangeText={cost => this.setState({ cost })} value={this.state.cost}
                        ref={(input) => this.chargeInput = input} onSubmitEditing={() => this.domainInput.focus()}>
                    </TextInput>
                    <Text style={{ fontWeight: "bold" }}>Domain</Text>
                    <TextInput placeholder="Athelete, musician," autoCapitalize="none" style={styles.textInput} onChangeText={domain => this.setState({ domain })} value={this.state.domain}
                        ref={(input) => this.domainInput = input} onSubmitEditing={() => this.subDomainInput.focus()}>
                    </TextInput>
                    <Text style={{ fontWeight: "bold" }}>SubDomain</Text>
                    <TextInput placeholder="cricket, singer" autoCapitalize="none" style={styles.textInput} onChangeText={subdomain => this.setState({ subdomain })} value={this.state.subdomain}
                        ref={(input) => this.subDomainInput = input}>
                    </TextInput>
                    <Text style={{ fontWeight: "bold" }}>Any specific language</Text>
                    
                    <Picker
                        style={{ height: 50, width: 200 }}
                        selectedValue={this.state.language}
                        onValueChange={(itemValue, itemIndex) => this.setState({ language: itemValue })}
                    >
                        <Picker.Item label="Not required" value="India" />
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
                    <Text style={styles.textStyle} onPress={this.handleSignUp}>Submit</Text>
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