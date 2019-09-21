import React, { Component } from 'react';

import { AppRegistry, TouchableHighlight, ScrollView, ToastAndroid, FlatList, StyleSheet, Text, View, Image, Alert, Button } from 'react-native';
import { database, storage, auth, app } from '../../src/config'
export default class SubDomainList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: [],
            domain: '',
            language: 'hindi'
        }
    }


    componentDidMount() {
        this.setState({domain: this.props.navigation.state.params.key},function(){

         this.getSubDomainList()});


    }
    getSubDomainList = async () => {
        var that = this;
        var list = [];
        var ref = database.ref('cluster/' + this.state.language + '/' + this.state.domain + '/subdomain');
        await ref.once('value', snap => {
            snap.forEach((child) => {
                list.push(child.key);
            });
        });
        this.setState({ data: list });
    }

    subDomainScreen = async (subdomain) => {
        this.props.navigation.navigate('SubDomainScreen', {domain: this.state.domain, subdomain: subdomain});
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
                            onPress={() => this.subDomainScreen(item)}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'white' }}>
                                <Text>{item}</Text>
                            </View>
                        </TouchableHighlight>
                    )}
                    
                    keyExtractor={item => item}>
                </FlatList>

            </View>
        )
    }
}