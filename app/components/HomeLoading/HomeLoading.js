import React, {Component} from 'react';
import { View, AppRegistry, Text, ActivityIndicator, StyleSheet} from 'react-native';
import {auth} from './../../src/config'
export default class HomeLoading extends Component{
    render(){
        return(
            <View style={styles.container}>
                <Text>Loading</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
    }
})