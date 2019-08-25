import React, { Component } from 'react';

import { AppRegistry, TouchableOpacity, ScrollView, ToastAndroid, FlatList, StyleSheet, Text, View, Image, Alert, Button } from 'react-native';
import { database, storage, auth, app } from '../../src/config'
export default class ListDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            items: [],
            dataHash: {},
            loading: true,
            image: true,
            data: [],
            images: {},
        }
    }


    componentDidMount() {
        var ref2 = database.ref(this.props.navigation.state.params.key);
        this.setState({dataSource:this.props.navigation.state.params.key})
        //var ref = storage.ref('images');
        this.getItems(ref2).then((items) => {
            //ToastAndroid.show(JSON.stringify(this.state.data), ToastAndroid.LONG);
            this.getResult(items).then((val) => {
                this.setState({ data: val });
            });

            //ToastAndroid.show(JSON.stringify(this.getActualData()), ToastAndroid.LONG);

        });
        //this.getImages();


    }
    getItems = async (ref2) => {
        var that = this;
        var items = [];
        var fina = {};
        await ref2.once('value', snap => {
            snap.forEach((child) => {
                items.push(child.key);
            });
        });

        //ToastAndroid.show(JSON.stringify(items), ToastAndroid.SHORT);
        return items;
    }
    getResult = async (items) => {
        //ToastAndroid.show(JSON.stringify(this.state.data), ToastAndroid.LONG);
        var finalArray = {};
        var result = [];
        var that = this;
        var promises = [];

        for (const id of items) {
            let promise = database.ref('star').child(id).child('public').once('value', snap => {
                var data2 = {};


                data2['name'] = snap.val().name;
                data2['domain'] = snap.val().domain;
                data2['subDomain'] = snap.val().subDomain;
                data2['id'] = id;
                var avtar = snap.val().avtar;
                data2['url'] = avtar['url'];
                //ToastAndroid.show(JSON.stringify(data2), ToastAndroid.SHORT);
                result.push(data2);

            });
            promises.push(promise);

        }
        await Promise.all(promises);
        return result
    }



    render() {

        //ToastAndroid.show(JSON.stringify(this.state.dataSource), ToastAndroid.SHORT);

        //const num = this.state.dataSource.length;
        return (
            <View style={{ flex: 1 }}>

                <FlatList
                    data={this.state.data}
                    renderItem={({ item }) =>


                        <View style={{flexDirection:'row'}}>
                            <Image source={{ uri: item['url'] }} style={{ width: 100, height: 100}}></Image>
                            <View style={{marginTop:20, marginLeft:20}}><Text>{item['name']}</Text>
                                <Text>{item['domain']}</Text>
                                <Text>{item['subDomain']}</Text>
                            </View>

                        </View>
                    }
                    keyExtractor={item => item['id']}>

                </FlatList>

            </View>
        )
    }
}