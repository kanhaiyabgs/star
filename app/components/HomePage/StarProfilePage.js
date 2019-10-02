import React, { Component } from 'react';

import { Dimensions, TouchableOpacity, ScrollView, ToastAndroid, FlatList, StyleSheet, Text, View, Image, Alert, Button } from 'react-native';
import { database, storage, auth, app } from '../../src/config'
import Video from 'react-native-video';
export default class StarProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            muted: true,
            refreshing: false,
            loading: false,
            lastVisible: null,
            starId: '',
            introVideoUrl: '',
            cost: '',
            name: '',
            domainMix: []
        }
    }


    componentDidMount() {
        //ToastAndroid.show(JSON.stringify(this.props.navigation.state.params.id), ToastAndroid.LONG);
        this.getInfo();
        //this.retrieveVideo();
    }

    retrieveVideo = async () => {
        var that = this;
        try {
            // Set State: Loading
            this.setState({
                loading: true,
            });
            var data = this.state.data;
            //console.log('Retrieving Data');
            // Cloud Firestore: Query
            await database.ref('videos').child(that.state.starId).orderByChild().limitToFirst(3).once('value', snap => {
                snap.forEach((child) => {
                    var obj = { 'videoUrl': child.key(), 'name': child.val() };
                    data.push(obj);
                })
            });

            //        this.setState({data: data});
            let lastVisible = data[data.length - 1].id;
            this.setState({ data: data, lastVisible: lastVisible, loading: false });
        }
        catch (error) {
            Alert.alert(error);
        }
    };


    retrieveMoreVideo = async () => {
        var that = this;
        try {
            // Set State: Refreshing
            this.setState({
                refreshing: true,
            });

            var data = this.state.data;
            //console.log('Retrieving Data');
            // Cloud Firestore: Query
            let initialQuery = await database.ref('videos').child(that.state.starId).orderByChild().startAt(this.state.lastVisible).limitToFirst(3).once('value', snap => {
                snap.forEach((child) => {
                    var obj = { 'videoUrl': child.key(), 'name': child.val() };
                    data.push(obj);
                });
            });
            let lastVisible = data[data.length - 1].id;
            this.setState({ data: data, lastVisible: lastVisible, refreshing: false });
        }
        catch (error) {
            Alert.alert(error);
        }
    };





    getInfo = async () => {
        var that = this;
        await database.ref('star').child(that.props.navigation.state.params.id).child('public').once('value', snap => {
            //ToastAndroid.show(JSON.stringify(snap.val()), ToastAndroid.LONG);
            that.setState({ starId: that.props.navigation.state.params.id });
            //var domains = [];
            let domains = new Set();
            domains.add(snap.val().domain);
            domains.add(snap.val().subDomain);

            that.setState({
                introVideoUrl: snap.val().introVideo['url'],
                name: snap.val().name,
                bio: snap.val().bio,
                cost: snap.val().cost,
                domainMix: domains
            });
        });

        //ToastAndroid.show(JSON.stringify(this.state), ToastAndroid.LONG);

    };

    getFanId = async () =>{
        var that = this;
        app.auth().onAuthStateChanged(function(user) {
            if (user) {
                ToastAndroid.show(user.uid, ToastAndroid.LONG);
                return user.uid;
              // User is signed in.
            } else {
                that.props.navigation.navigate('FirstPage');
              // No user is signed in.
            }
          });
    }
    capitalize_Words = (str) => {
        return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    };
    changeSound = () => {
        this.setState({muted: !this.state.muted});
    }


    render() {

        return (
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', flexDirection: 'column' }}
                    style={{ backgroundColor: 'white', paddingBottom: 20 }} scrollEnabled={true}>
                        <Video
                            source={{ uri: this.state.introVideoUrl }}
                            resizeMode={'cover'}
                            rate={1} volume={1} muted={this.state.muted}
                            repeat={true}
                            style={{ position: 'absolute', flex: 1, height: (Dimensions.get('window').height - Dimensions.get('window').height/3), width: '100%', top: 0, left: 0 }}
                        />
                        <Text  style={{ fontSize:20, marginTop: (Dimensions.get('window').height - Dimensions.get('window').height/3) + 2, marginBottom: 5, textAlign:'center', fontWeight: 'bold' }} onPress={() => { this.changeSound()}}  >Mute/Unmute</Text>
                        
                        
                    <Text style={{ fontSize:40, marginTop: (Dimensions.get('window').height - Dimensions.get('window').height/3) + 10, marginBottom: 5, textAlign:'center', fontWeight: 'bold' }} >{this.capitalize_Words(this.state.name)}</Text>
                    <Image source={{ uri: this.state.introVideoUrl}} style={{width: 200, height: 200}}></Image>
                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                        <Button title={"Book now for " + this.state.cost}  onPress={() => this.props.navigation.navigate('OrderRegistration', {fanId: app.auth().currentUser.uid, starId:this.state.starId, amount: this.state.cost})}> ></Button>
                    </View>
                </ScrollView>
        )
    }
}