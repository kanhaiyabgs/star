import React, { Component } from 'react';
import { YellowBox, DatePickerAndroid, TouchableHighlight, Modal, CheckBox, ToastAndroid, AsyncStorage, Picker, KeyboardAvoidingView, DatePickerIOS, ScrollView, Alert, TouchableOpacity, StyleSheet, Text, TextInput, View, Button } from 'react-native';
import { app, auth, database } from './../../src/config';

export default class StarSignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user_id: '', popupVisible: false, language: '', email: '', password: '', errorMessage: null, name: '', username: '', bio: '', cost: '', domain: 'actors',
            hindi: false, marathi: false, telgu: false, kannad: false, tamil: false, malyalam: false,
            bengali: false, gujrati: false, punjabi: false, bhojpuri: false, oriya: false,
            tag1: '', tag2: '', tag3: ''
        };
    }

    handleSignUp = async () => {

        // show some spinner or waiting guesture here 
        var that = this;
        try {
            await auth.signOut();
            ToastAndroid.show('logi out successfull', ToastAndroid.SHORT);
            
        } catch (error) {
            ToastAndroid.show('log out not done bro ', ToastAndroid.SHORT);
            
        }
        

        await auth.createUserWithEmailAndPassword(this.state.email, this.state.password).then(() => {
            auth.onAuthStateChanged(function (user) {
                if (user) {

                    // If user is successfully created in authentication page
                    const userid = user.uid;
                    ToastAndroid.show('user created '+ userid, ToastAndroid.SHORT);
                    that.setState({ user_id: userid });
                    database.ref('star').child(userid).child('public').set({ name: that.state.name.toLowerCase(), username: that.state.username.toLowerCase(), domain: that.state.domain.toLowerCase(), bio: that.state.bio, cost: that.state.cost });
                    database.ref('star').child(userid).child('private').set({ email: that.state.email });
                    var language = that.state.language;
                    if (that.state.domain == 'atheletes' || that.state.domain == 'foreign friend' || that.state.domain == 'models') {
                        database.ref('cluster').child('core').child(that.state.domain.toLowerCase()).child(userid).set({ name: that.state.name.toLowerCase(), tag1: that.state.tag1.toLowerCase(), tag2: that.state.tag2.toLowerCase(), tag3: that.state.tag3.toLowerCase(), avtar: '' });
                    }
                    else {
                        for (var i = 0; i < that.state.language.length; i++) {
                            database.ref('cluster').child(language[i]).child(that.state.domain.toLowerCase()).child(userid).set({ name: that.state.name.toLowerCase(), tag1: that.state.tag1.toLowerCase(), tag2: that.state.tag2.toLowerCase(), tag3: that.state.tag3.toLowerCase(), avtar: '' });
                        }
                    }
                    database.ref('search').child(userid).set({ name: that.state.name.toLowerCase(), tag1: that.state.tag1.toLowerCase(), tag2: that.state.tag2.toLowerCase(), tag3: that.state.tag3.toLowerCase(), userId: userid, avtar: '' });
                    database.ref('star_or_fan_check').child(userid).set({ check: 'star' });
                    try {
                        AsyncStorage.setItem('language', 'hindi');
                    }
                    catch (error) {
                        Alert.alert(error.message);
                    }

                } else {
                    Alert.alert('User creation failed');
                }
            })
        })
            .catch(error => this.setState({ errorMessage: error.message }));

        // here the code goes for  firebase function call to create and update details of a user on instamojo 

        YellowBox.ignoreWarnings(['Require cycle:']);

        // some optimization in database storing can be done so that less data needs to be read 
        // don't forget to set region of function calling. You were stuck here 
        var names = that.state.name.split(' ');
        var user_creation_instamojo = app.functions('asia-east2').httpsCallable('user_creation_instamojo_v2');
        await user_creation_instamojo({
            uuid: that.state.user_id,
            email: that.state.email,
            password: that.state.password,
            phone: that.state.phone,
            first_name: names[0],
            last_name: names[1],
        }).then((result) => {
            var data = result.data;
            if (data['status'] == 'success') {
                ToastAndroid.show('user creation successfull', ToastAndroid.SHORT);
                that.props.navigation.navigate('MediaUpload');

            }
            else {
                ToastAndroid.show('user creation failed' + error.message + error.code + error.details, ToastAndroid.SHORT);
            }

        })
            .catch((error) => {
                ToastAndroid.show(error.message + error.code + error.details, ToastAndroid.LONG);
            })
        that.props.navigation.navigate('MediaUpload', { language: that.state.language, domain: that.state.domain});


    };

    selectLanguage = () => {
        this.setState({ popupVisible: false });
        var language_array = [];

        if (this.state.hindi == true) {
            language_array.push('hindi');
        }
        if (this.state.marathi == true) {
            language_array.push('marathi');
        }
        if (this.state.telgu == true) {
            language_array.push('telgu');
        }
        if (this.state.kannad == true) {
            language_array.push('kannad');
        }
        if (this.state.tamil == true) {
            language_array.push('tamil');
        }
        if (this.state.malyalam == true) {
            language_array.push('malyalam');
        }
        if (this.state.bengali == true) {
            language_array.push('bengali');
        }
        if (this.state.gujrati == true) {
            language_array.push('gujrati');
        }
        if (this.state.punjabi == true) {
            language_array.push('punjabi');
        }
        if (this.state.bhojpuri == true) {
            language_array.push('bhojpuri');
        }
        if (this.state.oriya == true) {
            language_array.push('oriya');
        }
        this.setState({ language: language_array });

    }

    render() {
        return (
            <ScrollView style={{ marginLeft: 10, marginRight: 10 }}
                scrollEnabled={true}>
                <Text style={{ textAlign: 'center', fontWeight: "bold", height: 40, width: '90%', marginTop: 8, marginBottom: 12, fontSize: 28, color: '#00BCD4' }}>Welcome</Text>
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
                        ref={(input) => this.chargeInput = input} onSubmitEditing={() => this.phonInput.focus()}>
                    </TextInput>
                    <Text style={{ fontWeight: "bold" }}>Phone</Text>
                    <TextInput placeholder="Phone goes here" keyboardType="numeric" autoCapitalize="none" style={styles.textInput} onChangeText={phone => this.setState({ phone })} value={this.state.phone}
                        ref={(input) => this.phonInput = input}>
                    </TextInput>
                    <Text style={{ fontWeight: "bold" }}>Domain</Text>

                    <Picker
                        style={{ height: 50, width: 200 }}
                        selectedValue={this.state.domain}
                        onValueChange={(itemValue, itemIndex) => this.setState({ domain: itemValue })}
                    >
                        <Picker.Item label="Actors" value="actors" />
                        <Picker.Item label="Atheletes" value="atheletes" />
                        <Picker.Item label="Musicians" value="musicians" />
                        <Picker.Item label="TV star" value="TV star" />
                        <Picker.Item label="Youtubers" value="youtubers" />
                        <Picker.Item label="Comedians" value="comedians" />
                        <Picker.Item label="TikTok" value="tiktok" />
                        <Picker.Item label="Media" value="media" />
                        <Picker.Item label="Politics" value="politics" />
                        <Picker.Item label="Foreign Friend" value="foreign friend" />
                        <Picker.Item label="Models" value="models" />
                    </Picker>
                    <Text style={{ fontWeight: 'bold' }}>Tags</Text>
                    <TextInput placeholder="cricket" autoCapitalize="none" style={styles.textInput} onChangeText={tag1 => this.setState({ tag1 })} value={this.state.tag1}
                    >
                    </TextInput>
                    <TextInput placeholder="ipl" autoCapitalize="none" style={styles.textInput} onChangeText={tag2 => this.setState({ tag2 })} value={this.state.tag2}
                    >
                    </TextInput>
                    <TextInput placeholder="can be left empty if you want" autoCapitalize="none" style={styles.textInput} onChangeText={tag3 => this.setState({ tag3 })} value={this.state.tag3}
                    >
                    </TextInput>

                    {(this.state.domain == 'atheletes' || this.state.domain == 'foreign friend' || this.state.domain == 'models') ? (
                        <Text>Language selction not required</Text>

                    ) : (
                            <View>
                                <TouchableOpacity style={styles.buttonContainer} onPress={() => this.setState({ popupVisible: true })}>
                                    <Text style={styles.textStyle} >Select audience language(max up to 2)</Text>
                                </TouchableOpacity>


                                <Modal
                                    animationType="slide"
                                    transparent={false}
                                    visible={this.state.popupVisible}
                                    onRequestClose={() => {
                                        this.setState({popupVisible: false});
                                        Alert.alert('Language selected successfully.');
                                    }}>
                                    <View style={{ marginTop: 22 }}>

                                        <View style={{ flexDirection: 'row' }}>
                                            <CheckBox
                                                value={this.state.hindi}
                                                onValueChange={() => this.setState({ hindi: !this.state.hindi })}
                                            />
                                            <Text>Hindi</Text>

                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <CheckBox
                                                value={this.state.marathi}
                                                onValueChange={() => this.setState({ marathi: !this.state.marathi })}
                                            />
                                            <Text>Marathi</Text>

                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <CheckBox
                                                value={this.state.telgu}
                                                onValueChange={() => this.setState({ telgu: !this.state.telgu })}
                                            />
                                            <Text>Telgu</Text>

                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <CheckBox
                                                value={this.state.kannad}
                                                onValueChange={() => this.setState({ kannad: !this.state.kannad })}
                                            />
                                            <Text>Kannad</Text>

                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <CheckBox
                                                value={this.state.tamil}
                                                onValueChange={() => this.setState({ tamil: !this.state.tamil })}
                                            />
                                            <Text>Tamil</Text>

                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <CheckBox
                                                value={this.state.malyalam}
                                                onValueChange={() => this.setState({ malyalam: !this.state.malyalam })}
                                            />
                                            <Text>Malyalam</Text>

                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <CheckBox
                                                value={this.state.bengali}
                                                onValueChange={() => this.setState({ bengali: !this.state.bengali })}
                                            />
                                            <Text>Bengali</Text>

                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <CheckBox
                                                value={this.state.gujrati}
                                                onValueChange={() => this.setState({ gujrati: !this.state.gujrati })}
                                            />
                                            <Text>Gujrati</Text>

                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <CheckBox
                                                value={this.state.punjabi}
                                                onValueChange={() => this.setState({ punjabi: !this.state.punjabi })}
                                            />
                                            <Text>Punjabi</Text>

                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <CheckBox
                                                value={this.state.bhojpuri}
                                                onValueChange={() => this.setState({ bhojpuri: !this.state.bhojpuri })}
                                            />
                                            <Text>Bhojpuri</Text>

                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <CheckBox
                                                value={this.state.oriya}
                                                onValueChange={() => this.setState({ oriya: !this.state.oriya })}
                                            />
                                            <Text>Oriya</Text>

                                        </View>


                                        <TouchableHighlight
                                            onPress={() => {
                                                this.selectLanguage();
                                            }}>
                                            <Text>Submit</Text>
                                        </TouchableHighlight>
                                    </View>
                                </Modal>
                            </View>
                        )
                    }

                </KeyboardAvoidingView>

                <TouchableOpacity style={styles.buttonContainer} onPress={this.handleSignUp}>
                    <Text style={styles.textStyle} >Submit</Text>
                </TouchableOpacity>
            </ScrollView >

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