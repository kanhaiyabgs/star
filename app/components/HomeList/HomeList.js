import React, { Component } from 'react';

import { AppRegistry, ToastAndroid, FlatList, StyleSheet, Text, View, Image, Alert, ListRenderItem } from 'react-native';
import { horizontalFlatListData } from '../../data/horizontalFlatListData';
import { database, storage, auth } from '../../src/config'
export default class HomeList extends Component {
    constructor() {
        super();
        this.state = {
            dataSource: [],
            items: [],
            loading: false
        }
    }
    renderItem = ({ item }) => {
        return (
            <View>
                <Image style={{ width: 100, height: 50 }} source={{ uri: item.image }}>

                </Image>
                <View>
                    <Text>{item.domain}</Text>
                    <Text>{item.name}</Text>
                </View>
            </View>
        )

    }
    componentDidMount() {
        var ref2 = database.ref();
        this.getItems(ref2).then((items) => {
            this.getResult(items).then((val) => {
                this.setState({dataSource:val});
                //ToastAndroid.show(JSON.stringify(this.state.dataSource), ToastAndroid.SHORT);
            });
        });
    }

    getItems = async (ref2) => {
        var items = [];
        await ref2.once('value', snap => {
            snap.forEach((child) => {
                items.push(child.key);
            });
        });

        //ToastAndroid.show(JSON.stringify(items), ToastAndroid.SHORT);
        return items;
    }
    getResult = async (items) => {
        var result = [];
        var finalArray = {};

        for (const item of items) {
            ref = database.ref(item);
            var result = []
            await ref.once('value', snap => {

                snap.forEach((child) => {
                    //val.push(child.val());
                    var id = child.key;
                    var data = {
                        username: child.val().username,
                        email: child.val().email,
                        name: child.val().name,
                        domain: item
                    };
                    result.push({ [id]: data });
                    
                });
            });
            finalArray[item] = '';

        }
        //ToastAndroid.show(JSON.stringify(result), ToastAndroid.SHORT);
        return result;
    }
    //        //await ToastAndroid.show(JSON.stringify(result), ToastAndroid.SHORT);
    

    render() {
        //ToastAndroid.show(JSON.stringify(this.state.dataSource), ToastAndroid.SHORT);

        //const num = this.state.dataSource.length;
        return (
            <View
                style={{ flex: 1, flexDirection: 'column' }}>
                <View>
                    <FlatList 
                        data={this.state.dataSource}
                        renderItem={({item}) => 
                        <View>
                            <Text>{item[Object.keys(item)].email}</Text>
                            <Text>{item[Object.keys(item)].username}</Text>
                            <Text>{item[Object.keys(item)].name}</Text>
                            <Text>{item[Object.keys(item)].domain}</Text>
                        </View>
                        }
                        keyExtractor={item => Object.keys(item).toString()}>

                        </FlatList>


                </View>

            </View>
        )
    }
}