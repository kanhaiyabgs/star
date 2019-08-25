import React, { Component } from 'react';

import { AppRegistry,TouchableOpacity, ScrollView, ToastAndroid, FlatList, StyleSheet, Text, View, Image, Alert, Button } from 'react-native';
import { database, storage, auth, app } from '../../src/config'
export default class HomeList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            items: [],
            dataHash: {},
            loading: true,
            image: true,
            data: {},
            images:{},
        }
    }


    componentDidMount() {
        var ref2 = database.ref();
        var ref = storage.ref('images');
        this.getItems(ref2).then((items) => {
            //ToastAndroid.show(JSON.stringify(this.state.data), ToastAndroid.LONG);
            this.getResult(items).then((val) => {
                this.getActualData().then((finalArray) => {
                    this.setState({loading:false})
                    this.setState({dataSource:finalArray});
                    //ToastAndroid.show(JSON.stringify(this.state.dataSource), ToastAndroid.LONG);

                })
                 
                //ToastAndroid.show(JSON.stringify(this.getActualData()), ToastAndroid.LONG);
                //ToastAndroid.show(JSON.stringify(this.state.data), ToastAndroid.LONG);
                
                //ToastAndroid.show(JSON.stringify(this.state.data), ToastAndroid.SHORT);
            });
        });
        //this.getImages();

        
    }
    getActualData = async () => {
        var that = this;
        var promises = [];
        var finalArray ={};
        Object.entries(this.state.data).map(([key, value]) => {
            var result =[];
            finalArray[key] = [];
            for (const id of value) {
                
                
                
                let promise = database.ref('star').child(id).child('public').once('value', snap =>{
                    var data2 = {};               

                    
                    data2['name'] = snap.val().name;
                    data2['domain'] = snap.val().domain;
                    data2['subDomain'] = snap.val().subDomain;
                    data2['id'] = id;
                    var avtar = snap.val().avtar;
                    data2['url'] = avtar['url'];
                    //ToastAndroid.show(JSON.stringify(data2), ToastAndroid.SHORT);
                    result.push(data2);
                    finalArray[key].push(data2);
                    const newObj = Object.assign({}, that.state.dataSource);
                    newObj[key].push(data2);
                    that.setState({dataSource:newObj});
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

    getItems = async (ref2) => {
        var that = this;
        var items = [];
        var fina = {};
        await ref2.once('value', snap => {
            snap.forEach((child) => {
                if(child.key.toString() == 'star'){
                    return;
                }
                else if(child.key.toString() == 'name'){
                    return;
                }
                
                
                items.push(child.key);
                fina[child.key] = [];
            });
        });
        that.setState({data:fina});
        that.setState({dataSource:fina});

        //ToastAndroid.show(JSON.stringify(items), ToastAndroid.SHORT);
        return items;
    }
    getResult = async (items) => {
        //ToastAndroid.show(JSON.stringify(this.state.data), ToastAndroid.LONG);
        var finalArray = {};
        var that = this;

        for (const item of items) {
            ref = database.ref(item);
            var result = []
            await ref.once('value', snap => {

                snap.forEach((child) => {
                    //val.push(child.val());
                    var id = child.key;
                    result.push(id);
                    that.setState({[id]:" "});
                    //result.push({id:that.getStar(id)});
                });
            });
            //that.setState(dataHash[item]:result)
            // working
            const newObj = Object.assign({}, that.state.data);
            newObj[item] = result;
            that.setState({data:newObj});
            /*that.setState(prevState => {
                let hello = Object.assign({}, prevState.data[item]);
                data[item] = result;
                return {data};
            });
            */
            finalArray[item] = result;
        }
        //ToastAndroid.show(JSON.stringify(that.state.data), ToastAndroid.LONG);
        return finalArray;
    }

    getStar = async(id) =>{
        var data = {};
        
        await database.ref('star').child(id).child('public').once('value', snap =>{
            //ToastAndroid.show(JSON.stringify(snap), ToastAndroid.SHORT);
            data['name'] = snap.val().name;
            data['domain'] = snap.val().domain;
            data['subDomain'] = snap.val().subDomain;
        });
        //ToastAndroid.show(JSON.stringify(data), ToastAndroid.LONG);

        return data;
    }
    signOut = () => {
        //ToastAndroid.show(app.auth().currentUser.uid.toString(), ToastAndroid.SHORT);
        var that = this;
        app.auth().signOut().then(function() {
            //ToastAndroid.show(app.auth().currentUser.uid.toString(), ToastAndroid.SHORT);
            that.props.navigation.navigate('SignUp');

            // Sign-out successful.
          }).catch(function(error) {
              Alert.alert(error);
            // An error happened.
          });
    }
    detailsList = (key) => {
        this.props.navigation.navigate('ListDetails', {key}, );
    }
    //        //await ToastAndroid.show(JSON.stringify(result), ToastAndroid.SHORT);
    

    render() {
        
        //ToastAndroid.show(JSON.stringify(this.state.dataSource), ToastAndroid.SHORT);

        //const num = this.state.dataSource.length;
        return (
            <View style={{flex:1}}>
                <TouchableOpacity>
                    <Button title="Sign Out" onPress={this.signOut}></Button>
                </TouchableOpacity>


            <ScrollView style={{flex:1}} scrollEnabled={true} removeClippedSubviews={false}>
                {Object.entries(this.state.dataSource).map(([key, value]) => {
                    // missing of return was causing FLat List not to render
                  return <View style={{marginBottom: 10, marginTop: 10}}>
                
                      <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                      <Text>{key}</Text>
                      <Text onPress={ () => {this.detailsList(key)}}>View All</Text>
                      </View>
                      
                      <FlatList 
                        refreshing={this.state.loading}
                        data={value}
                        
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({item}) => 
                        
                        
                        <View>
                            <Text>{item['name']}</Text>
                            <Text>{item['domain']}</Text>                           
                            <Text>{item['subDomain']}</Text>
                            <Image source={{uri: item['url']}} style={{width: 100, height: 100}}></Image>

                           
                            
                            
                        </View>
                        }
                        keyExtractor={item => item['id']}>

                        </FlatList>

                  </View>  
                })}
            </ScrollView>
            </View>
        )
    }
}