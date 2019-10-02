import React, { Component } from 'react';

import { AppRegistry, BackHandler, KeyboardAvoidingView, TouchableOpacity, TextInput, TouchableHighlight, ScrollView, ToastAndroid, FlatList, AsyncStorage, StyleSheet, Text, View, Image, Alert, Button } from 'react-native';
import { database, storage, auth, app } from '../../src/config'
export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            language: 'hindi',
            domain_first: ['actors', 'atheletes', 'musicians', 'tv star'],
            first_done: false,
            first_set_data: {},
            domain_second: ['youtubers', 'comedians', 'tiktok'],
            second_done: false,
            second_set_data: {},
            domain_third: ['media', 'models', 'politics', 'foreign friend'],
            third_done: false,
            third_set_data: {},
            count: 0
        }
    }


    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

        this.getFirstSetData(0).then((data) => {
            this.setState({ first_set_data: data, first_done: false, count: 1 });


        });
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    // adding code for exiting the app 

    handleBackButton = () => {
        Alert.alert(
            'Exit App',
            'Exiting the application?', [{
                text: 'Cancel',
                style: 'cancel'
            }, {
                text: 'OK',
                onPress: () => BackHandler.exitApp()
            },], {
            cancelable: false
        }
        )
        return true;
    }



    getFirstSetData = async (set) => {
        var domain;
        if (set == 0) {
            domain = this.state.domain_first;
            this.setState({ first_done: true });
        }
        else if (set == 1) {
            domain = this.state.domain_second;
            this.setState({ second_done: true });
        }
        else if (set == 2) {
            domain = this.state.domain_third;
            this.setState({ third_done: true });
        }
        var data = {};
        for (const item of domain) {
            var data_array = [];
            var language = this.state.language;
            if (item == 'atheletes' || item == 'foreign friend' || item == 'models') {
                language = 'core';
            }
            //ToastAndroid.show(JSON.stringify(item), ToastAndroid.LONG);
            await database.ref('cluster/' + language + '/' + item).limitToFirst(10).once('value', snap => {
                snap.forEach((child) => {
                    var data_actual = child.val();
                    data_actual['id'] = child.key; 
                    data_array.push(data_actual);
                });
            });
            data[item] = data_array;
        }
//        ToastAndroid.show(JSON.stringify(data), ToastAndroid.LONG);
        return data;

    }

    detailsList = (key) => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        //ToastAndroid.show(key, ToastAndroid.LONG);
        this.props.navigation.navigate('DomainScreen', { key });
    }
    starProfile = (id) => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        this.props.navigation.navigate('StarProfilePage', { id });

    }

    capitalize_Words = (str) => {
        return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    }
    //        //await ToastAndroid.show(JSON.stringify(result), ToastAndroid.SHORT);

    isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        //ToastAndroid.show( '' + layoutMeasurement.height +  ' -- ' + contentOffset.y + ' -- ' +
          //  contentSize.height + ' -- ' +  paddingToBottom, ToastAndroid.LONG);
        const paddingToBottom = 5;
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
    };

    getMoreData = () => {
        var count = this.state.count;
        if (count == 1) {
            this.getFirstSetData(1).then((data) => {
                this.setState({ second_set_data: data, second_done: false, count: 2 });
            });
        }
        else if (count == 2) {
            this.getFirstSetData(2).then((data) => {
                this.setState({ third_set_data: data, third_done: false, count: 3 });
            });

        }
    }


    render() {

        //ToastAndroid.show(JSON.stringify(this.state.dataSource), ToastAndroid.SHORT);

        //const num = this.state.dataSource.length;
        return (
            <View style={{ flex: 1 }}>
                <KeyboardAvoidingView style={{ marginLeft: 10, marginRight: 10 }} onPress={() => this.props.navigation.navigate('SearchScreen')} >
                    <Text style={{ fontWeight: "bold" }}>Search Bar</Text>
                    <TextInput placeholder="Search " autoCapitalize="none" style={{
                        height: 40,
                        width: '90%',
                        borderColor: '#00BCD4',
                        borderWidth: 1,
                        borderRadius: 10,
                        marginTop: 8,
                        marginBottom: 12
                    }} onFocus={() => this.props.navigation.navigate('SearchScreen')} >
                    </TextInput>

                </KeyboardAvoidingView>


                <ScrollView scrollEnabled={true} removeClippedSubviews={true}
                    onScroll={({ nativeEvent }) => {
                        if (this.isCloseToBottom(nativeEvent)) {
                            this.getMoreData();
                        }
                    }}
                    scrollEventThrottle={16}>
                    {Object.entries(this.state.first_set_data).map(([key, value]) => {
                        // missing of return was causing FLat List not to render
                        return <View style={{ marginBottom: 10, marginTop: 10 }}>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ marginTop: 5, marginBottom: 5, fontWeight: 'bold' }} >{this.capitalize_Words(key)}</Text>
                                <Text style={{ marginTop: 5, marginBottom: 5, fontWeight: 'bold' }} onPress={() => { this.detailsList(key) }}>View All</Text>
                            </View>

                            <FlatList
                                refreshing={this.state.first_done}
                                data={value}

                                horizontal={true}
                                showsHorizontalScrollIndicator={false}

                                renderItem={({ item, index }) => (
                                    <TouchableHighlight
                                        onPress={() => { this.starProfile(item['id']) }}>
                                        <View style={{ marginLeft: 20, marginBottom: 10, marginTop: 10, flexDirection: 'column', backgroundColor: 'white' }}>
                                            <Image source={{ uri: item['avtar'] }} style={{ overflow: 'visible', borderRadius: 10, width: 110, height: 110 }}></Image>
                                            <Text style={{ marginTop: 5, marginBottom: 5, fontWeight: 'bold' }}>{this.capitalize_Words(item['name'])}</Text>
                                            <Text style={{ marginTop: 5, marginBottom: 1 }} >{this.capitalize_Words(item['tag1'])}</Text>
                                            <Text style={{ marginTop: 1, marginBottom: 1 }} >{this.capitalize_Words(item['tag2'])} </Text>
                                            <Text style={{ marginTop: 1, marginBottom: 1 }} >{this.capitalize_Words(item['tag3'])} </Text>

                                        </View>



                                    </TouchableHighlight>
                                )}

                                keyExtractor={(item, index) => item.key}>

                            </FlatList>

                        </View>
                    })}

                    {Object.entries(this.state.second_set_data).map(([key, value]) => {
                        // missing of return was causing FLat List not to render
                        return <View style={{ marginBottom: 10, marginTop: 10 }}>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ marginTop: 5, marginBottom: 5, fontWeight: 'bold' }} >{this.capitalize_Words(key)}</Text>
                                <Text style={{ marginTop: 5, marginBottom: 5, fontWeight: 'bold' }} onPress={() => { this.detailsList(key) }}>View All</Text>
                            </View>

                            <FlatList
                                refreshing={this.state.second_done}
                                data={value}

                                horizontal={true}
                                showsHorizontalScrollIndicator={false}

                                renderItem={({ item, index }) => (
                                    <TouchableHighlight
                                        onPress={() => { this.starProfile(item['id']) }}>
                                        <View style={{ marginLeft: 20, marginBottom: 10, marginTop: 10, flexDirection: 'column', backgroundColor: 'white' }}>
                                            <Image source={{ uri: item['avtar'] }} style={{ overflow: 'visible', borderRadius: 10, width: 110, height: 110 }}></Image>
                                            <Text style={{ marginTop: 5, marginBottom: 5, fontWeight: 'bold' }}>{this.capitalize_Words(item['name'])}</Text>
                                            <Text style={{ marginTop: 5, marginBottom: 1 }} >{this.capitalize_Words(item['tag1'])}</Text>
                                            <Text style={{ marginTop: 1, marginBottom: 1 }} >{this.capitalize_Words(item['tag2'])} </Text>
                                            <Text style={{ marginTop: 1, marginBottom: 1 }} >{this.capitalize_Words(item['tag3'])} </Text>

                                        </View>



                                    </TouchableHighlight>
                                )}

                                keyExtractor={(item, index) => item.key}>

                            </FlatList>

                        </View>
                    })}



                    {Object.entries(this.state.third_set_data).map(([key, value]) => {
                        // missing of return was causing FLat List not to render
                        return <View style={{ marginBottom: 10, marginTop: 10 }}>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ marginTop: 5, marginBottom: 5, fontWeight: 'bold' }} >{this.capitalize_Words(key)}</Text>
                                <Text style={{ marginTop: 5, marginBottom: 5, fontWeight: 'bold' }} onPress={() => { this.detailsList(key) }}>View All</Text>
                            </View>

                            <FlatList
                                refreshing={this.state.third_done}
                                data={value}

                                horizontal={true}
                                showsHorizontalScrollIndicator={false}

                                renderItem={({ item, index }) => (
                                    <TouchableHighlight
                                        onPress={() => { this.starProfile(item['id']) }}>
                                        <View style={{ marginLeft: 20, marginBottom: 10, marginTop: 10, flexDirection: 'column', backgroundColor: 'white' }}>
                                            <Image source={{ uri: item['avtar'] }} style={{ overflow: 'visible', borderRadius: 10, width: 110, height: 110 }}></Image>
                                            <Text style={{ marginTop: 5, marginBottom: 5, fontWeight: 'bold' }}>{this.capitalize_Words(item['name'])}</Text>
                                            <Text style={{ marginTop: 5, marginBottom: 1 }} >{this.capitalize_Words(item['tag1'])}</Text>
                                            <Text style={{ marginTop: 1, marginBottom: 1 }} >{this.capitalize_Words(item['tag2'])} </Text>
                                            <Text style={{ marginTop: 1, marginBottom: 1 }} >{this.capitalize_Words(item['tag3'])} </Text>

                                        </View>



                                    </TouchableHighlight>
                                )}

                                keyExtractor={(item, index) => item.key}>

                            </FlatList>

                        </View>
                    })}


                </ScrollView>
            </View>
        )
    }
}