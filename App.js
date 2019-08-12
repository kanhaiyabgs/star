/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';

import {createStackNavigator, createAppContainer} from 'react-navigation';

import HomeLoading from './app/components/HomeLoading/HomeLoading';
import SignUp from './app/components/SignUp/SignUp';
import Login from './app/components/Login/Login';

import Home from './app/components/Home/Home';
import { app } from 'firebase';
import HomeList from './app/components/HomeList/HomeList';

const AppNavigator = createStackNavigator(
  {
    
    HomeLoading,
    SignUp,
    Login,
    Home,
    HomeList
    
  },
  {
    initialRouteName:'HomeList',
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends Component{
  render(){
    return <AppContainer></AppContainer>;
  }
}
