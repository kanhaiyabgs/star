import React, { Component } from 'react';

import { AppRegistry, TouchableHighlight, ScrollView, ToastAndroid, FlatList, StyleSheet, Text, View, Image, Alert, Button } from 'react-native';
import { database, storage, auth, app } from '../../src/config'
export default class ListDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            domain: '',
            subdomain: '',
            dataSource: [],
            items: [],
            dataHash: {},
            loading: true,
            image: true,
            data: [],
            images: {},
            language:'hindi'
        }
    }


    componentDidMount() {
        var ref2 = database.ref(this.props.navigation.state.params.key);
        this.setState({ domain: this.props.navigation.state.params.domain });
        this.setState({ subdomain: this.props.navigation.state.params.subdomain }, function(){
            this.getResult().then((result) => {
                this.getActualData(result);
                //ToastAndroid.show(JSON.stringify(result), ToastAndroid.LONG);
            })    

        });

        
    }


    getActualData = async (value) => {
        var that = this;
        var finalArray = [];
        var promises = []
        for (const id of value) {
            let promise = database.ref('star').child(id).child('public').once('value', snap => {
                var data2 = {};


                data2['name'] = snap.val().name;
                data2['domain'] = snap.val().domain;
                data2['subDomain'] = snap.val().subDomain;
                data2['id'] = id;
                var avtar = snap.val().avtar;
                data2['url'] = avtar['url'];
                //ToastAndroid.show(JSON.stringify(data2), ToastAndroid.SHORT);
                //result.push(data2);
                finalArray.push(data2);

                //that.setState({dataSource:finalArray});
                //that.setState({loading:true})
            });
            promises.push(promise);

        }
        await Promise.all(promises);
        this.setState({ data: finalArray });


        //return finalArray;               
    }

    getResult = async () => {
        //ToastAndroid.show(JSON.stringify(this.state.data), ToastAndroid.LONG);

        //var language = AsyncStorage.getItem('language');
        var result = [];
        await database.ref('cluster/' + this.state.language + '/' + this.state.domain + '/' + this.state.subdomain).once('value', snap => {
            snap.forEach((child) => {
                //ToastAndroid.show(JSON.stringify(child.key), ToastAndroid.LONG);
                var id = child.key;
                result.push(id);

                //result.push({id:that.getStar(id)});
            });
            ToastAndroid.show(JSON.stringify(result), ToastAndroid.LONG);
        });
        return result;
        //ToastAndroid.show(JSON.stringify(that.state.data), ToastAndroid.LONG);
    }



    render() {

        //ToastAndroid.show(JSON.stringify(this.state.dataSource), ToastAndroid.SHORT);

        //const num = this.state.dataSource.length;
        return (
            <View style={{ flex: 1 }}>

                <FlatList
                    data={this.state.data}
                    renderItem={({ item, index }) => (
                        <TouchableHighlight
                            onPress={() => this.props.navigation.navigate('StarProfilePage', {id: item['id']})}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'white' }}>
                                <Image source={{ uri: item['url'] }} style={{ width: 100, height: 100 }}></Image>
                                <View style={{ marginTop: 20, marginLeft: 20 }}><Text>{item['name']}</Text>
                                    <Text>{item['domain']}</Text>
                                    <Text>{item['subDomain']}</Text>
                                </View>
                            </View>
                        </TouchableHighlight>
                    )}

                    keyExtractor={item => item}>
                </FlatList>

                <FlatList
                    data={this.state.data}
                    renderItem={({ item }) =>


                        <View style={{ flexDirection: 'row' }}>

                        </View>
                    }
                    keyExtractor={item => item}>

                </FlatList>

            </View>
        )
    }
}