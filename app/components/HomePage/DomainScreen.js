import React, { Component } from 'react';

import { AppRegistry, TouchableHighlight, ScrollView, ActivityIndicator, ToastAndroid, FlatList, StyleSheet, Text, View, Image, Alert, Button } from 'react-native';
import { database, storage, auth, app } from '../../src/config'
export default class DomainScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            domain: '',
            loading: true,
            data: [],
            language: 'hindi',
            lastVisible: '',
            list_end: false,
            fetch_more_data_state: false
        }

    }


    componentDidMount() {
        this.setState({ domain: this.props.navigation.state.params.key }, function () {
            //Alert.alert(this.state.domain);

            this.getInfo();
        });


    }

    getInfo = async () => {
        var that = this;

        try {
            // Set State: Loading

            var data_array = this.state.data;
            var language = this.state.language;
            if (this.state.domain == 'atheletes' || this.state.domain == 'foreign friend' || this.state.domain == 'models') {
                language = 'core';
            }
            //Alert.alert(language);
            //console.log('Retrieving Data');
            // Cloud Firestore: Query
            var key;
            var length;
            await database.ref('cluster/' + language + '/' + this.state.domain).orderByKey().limitToFirst(10).once('value', snap => {
                //ToastAndroid.show(JSON.stringify(snap), ToastAndroid.LONG);
                length = Object.keys(snap).length;

                var count = 1;
                snap.forEach((child) => {
                    if (length == 1) {
                        key = child.key;
                        var data_actual = child.val();
                        data_actual['id'] = child.key;
                        data_array.push(data_actual);
                        this.setState({ list_end: true, lastVisible: '' });

                    }
                    else if (count != length - 1) {

                        key = child.key;
                        var data_actual = child.val();
                        data_actual['id'] = child.key;
                        data_array.push(data_actual);
                    }
                    else {
                        if (length < 10) {
                            key = child.key;
                            var data_actual = child.val();
                            data_actual['id'] = child.key;
                            data_array.push(data_actual);

                        }
                        else{
                            key = child.key;
                            }
                        

                    }
                    count += 1;


                });
            });

            //        this.setState({data: data});
            let lastVisible = key;
            if (length < 10) {
                this.setState({ data: data_array, lastVisible: '', loading: false, fetch_more_data_state: false });

            }
            else {
                this.setState({ data: data_array, lastVisible: lastVisible, loading: false, fetch_more_data_state: true });
            }


            //ToastAndroid.show(JSON.stringify(data_array), ToastAndroid.LONG);

        }
        catch (error) {
            Alert.alert(error);
        }
    };

    fetchMoreData = async () => {
        var that = this;
        if (this.state.list_end == true) {
            return;
        }
        if (this.state.fetch_more_data_state == false) {

            return;
        }
        try {
            ToastAndroid.show('hey fetching more data' + this.state.fetch_more_data_state, ToastAndroid.LONG);

            // Set State: Refreshing

            //var data_array = this.state.data;
            var language = this.state.language;
            if (this.state.domain == 'atheletes' || this.state.domain == 'foreign friend' || this.state.domain == 'models') {
                language = 'core';
            }
            //console.log('Retrieving Data');
            // Cloud Firestore: Query
            var key;
            //console.log('Retrieving Data');
            // Cloud Firestore: Query
            //ToastAndroid.show('hey fetching more data' + this.state.lastVisible, ToastAndroid.LONG);
            await database.ref('cluster/' + language + '/' + this.state.domain).orderByKey().startAt(this.state.lastVisible).limitToFirst(10).once('value', snap => {
                var length = Object.keys(snap).length;
                //ToastAndroid.show(JSON.stringify(snap), ToastAndroid.SHORT);
                var count = 1;
                snap.forEach((child, index) => {
                    if (length == 1) {
                        key = child.key;
                        var data_actual = child.val();
                        data_actual['id'] = child.key;
                        this.state.data.push(data_actual);
                        this.setState({ list_end: true, lastVisible: '' });

                    }
                    else if (count != length - 1) {

                        key = child.key;
                        var data_actual = child.val();
                        data_actual['id'] = child.key;
                        this.state.data.push(data_actual);
                    }
                    else {
                        key = child.key;
                    }

                    count += 1;


                });
            });


            let lastVisible = key;
            this.setState({ lastVisible: lastVisible });
        }
        catch (error) {
            Alert.alert(error);
        }

    }


    capitalize_Words = (str) => {
        return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    };




    render() {

        //ToastAndroid.show(JSON.stringify(this.state.dataSource), ToastAndroid.SHORT);

        //const num = this.state.dataSource.length;
        return (
            <View style={{ flex: 1 }}>
                <Text style={{ marginTop: 5, marginBottom: 5, fontWeight: 'bold' }} >{this.capitalize_Words(this.state.domain)}</Text>

                <FlatList
                    data={this.state.data}
                    extraData={this.state}
                    refreshing={this.state.loading}
                    onEndReached={this.fetchMoreData}
                    onEndReachedThreshold={0.5}

                    ListEmptyComponent={() => {
                        return <ActivityIndicator size="large" color="#00BCD4"></ActivityIndicator>

                    }}


                    renderItem={({ item, index }) => (
                        <TouchableHighlight
                            onPress={() => this.props.navigation.navigate('StarProfilePage', { id: item['id'] })}>
                            <View style={{ marginLeft: 20, marginBottom: 10, marginTop: 10, flexDirection: 'row', backgroundColor: 'white' }}>
                                <Image source={{ uri: item['avtar'] }} style={{ overflow: 'visible', borderRadius: 10, width: 70, height: 70 }}></Image>
                                <View style={{ marginLeft: 20, marginRight: 20, flexDirection: 'column', backgroundColor: 'white' }}>
                                    <Text style={{ marginTop: 5, marginBottom: 5, fontWeight: 'bold' }} >{item['name']}</Text>
                                    <Text style={{ marginTop: 5, marginBottom: 5 }} >{'' + item['tag1'] + '  -  ' + item['tag2'] + '  -  ' + item['tag3']} </Text>
                                </View>

                            </View>

                        </TouchableHighlight>
                    )}

                    keyExtractor={(item, index) => item.key}>
                </FlatList>




            </View>
        )
    }
}