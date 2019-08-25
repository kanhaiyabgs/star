import React, { Component } from 'react';

import { AppRegistry, TouchableOpacity, ScrollView, ToastAndroid, FlatList, StyleSheet, Text, View, Image, Alert, Button } from 'react-native';
import { database, storage, auth, app } from '../../src/config'
export default class ProfileDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data : [],
            refreshing: false,
            loading: false,
            lastVisible: null,
            userId: '',
            introVideoUrl: '',
            cost: '',
            name: '',
            domainMix : []
        }
    }


    componentDidMount() {
        this.getInfo();
        this.retrieveVideo();
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
                var obj = {'id': child.key(), 'name': child.val().name, 'videoUrl':child.val().videoUrl['url']};
                data.push(obj);
            })
        });

//        this.setState({data: data});
        let lastVisible = data[data.length -1].id;
        this.setState({data:data, lastVisible:lastVisible, loading:false});
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
                  var obj = {'name': child.val().name, 'id':child.key(), 'videoUrl':child.val().videoUrl['url']};
                  data.push(obj);
               });
            });
            let lastVisible = data[data.length -1].id;
            this.setState({data:data, lastVisible:lastVisible, refreshing:false});
        }
        catch (error) {
            Alert.alert(error);
        }
    };





    getInfo = async () => {
        var that = this;
        await database.ref('star').child(that.state.userId).child('public').once('value', snap => {
            var domains = [];
            domains.push(snap.val().domain);
            domains.push(snap.val().subDomain);

            that.setState({
                introVideoUrl: snap.val().videoUrl['url'],
                name: snap.val().name,
                cost: snap.val().cost,
                domainMix: domains 
            });
        });

    }

    render() {

        //ToastAndroid.show(JSON.stringify(this.state.dataSource), ToastAndroid.SHORT);

        //const num = this.state.dataSource.length;
        return (
            <View >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', flexDirection: 'column' }}
                    style={{ backgroundColor: 'white', paddingBottom: 20 }}>
                    <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                        <Video
                            source={{ uri: this.state.introVideoUrl }}
                            resizeMode={'stretch'}
                            rate={1} volume={1} muted={false}
                            repeat={true}
                            style={{ position: 'absolute', flex: 1, height: '80%', width: '100%', top: 0, left: 0 }}
                        />
                        <Text>{this.state.name}</Text>
                        <FlatList
                            data={this.state.data}
                            renderItem={({ item }) =>


                                <View >
                                    <Text>For{item.name}</Text>
                                    <Video
                                        source={{ uri: item.videoUrl }}
                                        resizeMode={'stretch'}
                                        rate={1} volume={1} muted={false}
                                        repeat={true}
                                        style={{ position: 'absolute', flex: 1, height: '80%', width: '100%', top: 0, left: 0 }}
                                    />
                                </View>
                            }
                            keyExtractor={(item, index) => index.toString()}
                            onEndReached={this.retrieveMoreVideo()}
                            onEndReachedThreshold={0}
                            refreshing={this.state.refreshing}

                            >

                        </FlatList>

                    </View>
                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                        <Button title={"Book now for " + this.state.cost} ></Button>
                    </View>
                </ScrollView>

            </View>
        )
    }
}