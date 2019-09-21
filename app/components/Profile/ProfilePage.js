import React, { Component } from 'react';

import { AppRegistry, TouchableOpacity, ScrollView, ToastAndroid, FlatList, StyleSheet, Text, View, Image, Alert, Button } from 'react-native';
import { database, storage, auth, app } from '../../src/config'
export default class ProfileDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refreshing: false,
            loading: false,
            lastVisible: null,
            userId: '',
            introVideoUrl: '',
            cost: '',
            name: '',
            domainMix: []
        }
    }


    componentDidMount() {
        var that = this; 
   
        app.auth().onAuthStateChanged((user) => {
            if (user) {
                that.setState({userId: user.uid}, function(){
                    this.getInfo();
                });
                ToastAndroid.show('profile me logged in hai ' + user.uid, ToastAndroid.LONG);
            }
            else{
                ToastAndroid.show('profile me logged in nhi hai ', ToastAndroid.LONG);
            }
         });
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
            await database.ref('videos').child(that.state.userId).orderByChild().limitToFirst(3).once('value', snap => {
                snap.forEach((child) => {
                    var obj = { 'id': child.key(), 'name': child.val().name, 'videoUrl': child.val().videoUrl['url'] };
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
            let initialQuery = await database.ref('videos').child(that.state.userId).orderByChild().startAt(this.state.lastVisible).limitToFirst(3).once('value', snap => {
                snap.forEach((child) => {
                    var obj = { 'name': child.val().name, 'id': child.key(), 'videoUrl': child.val().videoUrl['url'] };
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
        var userId = this.state.userId;

        
        ToastAndroid.show('yaha to dikh rha hai ' + this.state.userId + 'kya hai ', ToastAndroid.LONG)
        

        database.ref('star_or_fan_check').child(userId).once('value', (snap) => {
            ToastAndroid.show(JSON.stringify(snap.val()), ToastAndroid.SHORT);
            var snap_dict = snap.val();
            if (snap_dict['check'] == 'star') {
                that.setState({ user: 'star' });
                database.ref('star').child(userId).child('public').once('value', (snap_data) => {
                    that.setState({ name: snap_data.val().name });
                    that.setState({ imageUrl: snap_data.val().avtar.url })

                });
            }
            else if (snap_dict['check'] == 'fan') {
                that.setState({ user: 'fan' });
                database.ref('fan').child(userId).child('public').once('value', (snap_data) => {
                    ToastAndroid.show(JSON.stringify(snap_data.val()), ToastAndroid.SHORT);
                    that.setState({ name: snap_data.val().name });
                    //that.setState({ imageUrl: snap_data.val().avtar.url })
                });
            }
        })
    }

    logOut = async () => {
        try {
            await app.auth().signOut();
            this.props.navigation.navigate('FirstPage');
        } catch (e) {
            Alert.alert('Log out failed ');
        }
    }

    render() {

        //ToastAndroid.show(JSON.stringify(this.state.dataSource), ToastAndroid.SHORT);

        //const num = this.state.dataSource.length;
        return (

            <ScrollView style={{ flex: 1 }} scrollEnabled={true} removeClippedSubviews={false}>
                <Image source={{ uri: this.state.imageUrl }} style={{ width: 100, height: 100 }}></Image>
                <Text>{this.state.name}</Text>
                <TouchableOpacity style={styles.buttonContainer}>
                    <Text style={styles.textStyle} >Payment Method </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonContainer}>
                    <Text style={styles.textStyle} onPress={() => this.props.navigation.navigate('BookingHistory', {fanId: this.state.userId})}>Booking History</Text>
                </TouchableOpacity>
                
                {this.state.user == 'star' ? (
                    <TouchableOpacity style={styles.buttonContainer}>
                        <Text style={styles.textStyle} onPress={() => this.props.navigation.navigate('IncomingRequests', {starId: this.state.userId})}>Incoming Requests</Text>
                    </TouchableOpacity>

                ) : (
                        <Text></Text>
                    )
                }
                <TouchableOpacity style={styles.buttonContainer}>
                    <Text style={styles.textStyle} onPress= {() => {this.logOut }}>LogOut</Text>
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