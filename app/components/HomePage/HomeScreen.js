import React, { Component } from 'react';

import { AppRegistry, BackHandler, TouchableOpacity, TouchableHighlight, ScrollView, ToastAndroid, FlatList, AsyncStorage, StyleSheet, Text, View, Image, Alert, Button } from 'react-native';
import { database, storage, auth, app } from '../../src/config'
export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: {},
            items: [],
            dataHash: {},
            loading: true,
            image: true,
            data: {},
            images: {},
            language: 'hindi',
            domain: ['actors', 'athletes', 'musicians', 'tv', 'youtubers', 'comedians', 'tiktok', 'media', 'models', 'authors', 'politics', 'foreign friends', 'voice artists'],
            domain_india: ['athletes', 'models', 'foreign friend'],
        }
    }


    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        this.getResult().then(() => {
            //ToastAndroid.show(JSON.stringify(this.state.data), ToastAndroid.LONG);
            this.getActualData().then((finalArray) => {
                // setting state in async function really causing problem
                this.setState({ loading: false })
                this.setState({ dataSource: finalArray });
                //ToastAndroid.show(JSON.stringify(this.state.dataSource), ToastAndroid.LONG);

            });

            //ToastAndroid.show(JSON.stringify(this.getActualData()), ToastAndroid.LONG);
            //ToastAndroid.show(JSON.stringify(this.state.data), ToastAndroid.LONG);

            //ToastAndroid.show(JSON.stringify(this.state.data), ToastAndroid.SHORT);
        });
        //this.getImages();


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
            }, ], {
                cancelable: false
            }
         )
         return true;
       } 



    getActualData = async () => {
        var that = this;
        var promises = [];
        var finalArray = {};
        Object.entries(this.state.data).map(([key, value]) => {
            //ToastAndroid.show(JSON.stringify(key), ToastAndroid.SHORT);
            //ToastAndroid.show(JSON.stringify(value), ToastAndroid.SHORT);
            //var result =[];
            finalArray[key] = [];
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
                    finalArray[key].push(data2);
                    const newObj = Object.assign({}, that.state.dataSource);
                    newObj[key].push(data2);
                    that.setState({ dataSource: newObj });
                    //ToastAndroid.show(JSON.stringify(that.state.dataSource), ToastAndroid.LONG);

                    //that.setState({dataSource:finalArray});
                    //that.setState({loading:true})
                });
                promises.push(promise);

            }

            //finalArray[key] = result;
        });
        await Promise.all(promises);

        //ToastAndroid.show(JSON.stringify(this.state.dataSource), ToastAndroid.LONG);
        return this.state.dataSource;


        //return finalArray;               
    }

    getResult = async () => {
        //ToastAndroid.show(JSON.stringify(this.state.data), ToastAndroid.LONG);
        var finalArray = {};
        var that = this;

        //var language = AsyncStorage.getItem('language');
        //this.setState({language: 'hindi'});
        ToastAndroid.show(JSON.stringify(this.state.language), ToastAndroid.LONG);


        for (const item of this.state.domain) {
            var result = [];
            finalArray[item] = []
            //ToastAndroid.show(JSON.stringify(item), ToastAndroid.LONG);
            await database.ref('cluster/' + this.state.language + '/' + item + '/featured').limitToFirst(10).once('value', snap => {
                snap.forEach((child) => {
                    //ToastAndroid.show(JSON.stringify(child.key), ToastAndroid.LONG);
                    if (child.key != 'count') {
                        //val.push(child.val());
                        var id = child.key;
                        result.push(id);
                    }
                    //result.push({id:that.getStar(id)});
                });
            });
            //that.setState(dataHash[item]:result)
            // working
            //ToastAndroid.show(JSON.stringify(result), ToastAndroid.LONG);
            const newObj = Object.assign({}, that.state.data);
            newObj[item] = result;
            that.setState({ data: newObj });
            /*that.setState(prevState => {
                let hello = Object.assign({}, prevState.data[item]);
                data[item] = result;
                return {data};
            });
            */
            //ToastAndroid.show(JSON.stringify(that.state.data), ToastAndroid.LONG);
        }
        //ToastAndroid.show(JSON.stringify(that.state.data), ToastAndroid.LONG);



        // language independent query  
        for (const item of this.state.domain_india) {
            var result = [];
            finalArray[item] = []
            await database.ref('cluster/india/' + item + '/featured').limitToFirst(10).once('value', snap => {
                snap.forEach((child) => {
                    if (child.key != 'count') {
                        //val.push(child.val());
                        var id = child.key;
                        result.push(id);
                    }
                    //result.push({id:that.getStar(id)});
                });
            });
            //that.setState(dataHash[item]:result)
            // working
            const newObj = Object.assign({}, that.state.data);
            newObj[item] = result;
            that.setState({ data: newObj });
            /*that.setState(prevState => {
                let hello = Object.assign({}, prevState.data[item]);
                data[item] = result;
                return {data};
            });
            */
            //ToastAndroid.show(JSON.stringify(that.state.data), ToastAndroid.LONG);
        }

        // this is reaslly important . You missed this last time don't miss it again
        this.setState({ dataSource: finalArray });

        //ToastAndroid.show(JSON.stringify(that.state.data), ToastAndroid.LONG);
    }

    getStar = async (id) => {
        var data = {};

        await database.ref('star').child(id).child('public').once('value', snap => {
            //ToastAndroid.show(JSON.stringify(snap), ToastAndroid.SHORT);
            data['name'] = snap.val().name;
            data['domain'] = snap.val().domain;
            data['subDomain'] = snap.val().subDomain;
        });
        //ToastAndroid.show(JSON.stringify(data), ToastAndroid.LONG);

        return data;
    }
    detailsList = (key) => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        this.props.navigation.navigate('SubDomainList', { key });
    }
    starProfile = (id) => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        this.props.navigation.navigate('StarProfilePage', { id });

    }
    //        //await ToastAndroid.show(JSON.stringify(result), ToastAndroid.SHORT);


    render() {

        //ToastAndroid.show(JSON.stringify(this.state.dataSource), ToastAndroid.SHORT);

        //const num = this.state.dataSource.length;
        return (
            <View style={{ flex: 1 }}>
                
                <ScrollView style={{ flex: 1 }} scrollEnabled={true} removeClippedSubviews={false}>
                    {Object.entries(this.state.dataSource).map(([key, value]) => {
                        // missing of return was causing FLat List not to render
                        return <View style={{ marginBottom: 10, marginTop: 10 }}>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text>{key}</Text>
                                <Text onPress={() => { this.detailsList(key) }}>View All</Text>
                            </View>

                            <FlatList
                                refreshing={this.state.loading}
                                data={value}

                                horizontal={true}
                                showsHorizontalScrollIndicator={false}

                                renderItem={({ item, index }) => (
                                    <TouchableHighlight
                                    onPress={() => {this.starProfile(item['id']) }}>
                                        <View style={{ flexDirection: 'row', backgroundColor: 'white' }}>
                                            <Image source={{ uri: item['url'] }} style={{ width: 100, height: 100 }}></Image>
                                            <Text>{item['subDomain']}</Text>
                                            <Text>{item['name']}</Text>                                        

                                        </View>
                                    </TouchableHighlight>
                                )}

                                keyExtractor={(item, index) => index}>

                            </FlatList>

                        </View>
                    })}
                </ScrollView>
            </View>
        )
    }
}