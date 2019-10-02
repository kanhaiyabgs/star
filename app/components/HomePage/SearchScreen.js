import React, { Component } from 'react';
import { YellowBox, FlatList, Image, ActivityIndicator, DatePickerAndroid, TouchableHighlight, Modal, CheckBox, ToastAndroid, AsyncStorage, Picker, KeyboardAvoidingView, DatePickerIOS, ScrollView, Alert, TouchableOpacity, StyleSheet, Text, TextInput, View, Button } from 'react-native';
import { app, auth, database } from './../../src/config';
import axios from 'axios';

export default class SearchScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            val: '', listLoading: false, data: ''
        };
        this.goForSearch = this.goForSearch.bind(this);
        YellowBox.ignoreWarnings(['Require cycle:']);
    }

    goForSearch = (search_text) => {
        //ToastAndroid.show(search_text, ToastAndroid.SHORT);
        this.setState({ val: search_text });
        //const val = evt.  evt.target.value;


        if (this._timeout) { //if there is already a timeout in process cancel it
            clearTimeout(this._timeout);
        }

        this._timeout = setTimeout(async () => {
            this.setState({listLoading:true});
            this._timeout = null;
            var actual_elastic_search = app.functions('asia-east2').httpsCallable('actual_elastic_search_v1');
            await actual_elastic_search({
                search_text: this.state.val
            }).then((result) => {
                //var data = result.data;
                //ToastAndroid.show(JSON.stringify(result.data), ToastAndroid.SHORT);
                this.setState({data: result.data, listLoading:false});


            })
                .catch((error) => {
                    ToastAndroid.show(error.message + error.code + error.details, ToastAndroid.LONG);
                })

        }, 1000);
    }

    starProfile = (id) => {
        this.props.navigation.navigate('StarProfilePage', { id });

    }


    render() {
        return (
            <ScrollView style={{ marginLeft: 10, marginRight: 10 }}
                scrollEnabled={true}>
                <Text style={{ textAlign: 'center', fontWeight: "bold", height: 40, width: '90%', marginTop: 8, marginBottom: 12, fontSize: 28, color: '#00BCD4' }}>Welcome</Text>
                <KeyboardAvoidingView style={{ marginLeft: 10, marginRight: 10 }}>
                    <Text style={{ fontWeight: "bold" }}>Search Bar</Text>
                    <TextInput placeholder="Search " autoCapitalize="none" autoFocus={true} style={styles.textInput} onChangeText={this.goForSearch}
                        value={this.state.val} >
                    </TextInput>

                </KeyboardAvoidingView>

                <FlatList
                                refreshing={this.state.listLoading}
                                data={this.state.data}
                                ListEmptyComponent= {() => {
                                    return <ActivityIndicator size="small" color="#00BCD4"></ActivityIndicator>

                                }} 

                                renderItem={({ item, index }) => (
                                    <TouchableHighlight
                                    onPress={() => {this.starProfile(item['_source']['userId']) }}>
                                        <View style={{ marginLeft:20, marginBottom: 10, marginTop: 10,  flexDirection: 'row', backgroundColor: 'white' }}>
                                            <Image source={{ uri: item['_source']['avtar'] }} style={{ overflow:'visible', borderRadius:10, width: 70, height: 70 }}></Image>
                                            <View style={{ marginLeft: 20, marginRight: 20, flexDirection: 'column', backgroundColor: 'white' }}>
                                                <Text style={{marginTop: 5, marginBottom: 5, fontWeight:'bold' }} >{item['_source']['name']}</Text>
                                                <Text style={{marginTop: 5, marginBottom: 5 }} >{'' + item['_source']['tag1'] + '  -  ' + item['_source']['tag2'] + '  -  ' + item['_source']['tag3']} </Text>                                        
                                            </View>

                                        </View>
                                    </TouchableHighlight>
                                )}

                                keyExtractor={(item, index) => item.key}>

                            </FlatList>

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