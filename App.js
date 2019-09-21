/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {ToastAndroid} from 'react-native';

import {createStackNavigator, createAppContainer, createBottomTabNavigator} from 'react-navigation';

import {app} from './app/src/config';

import SignUp from './app/components/SignUp/SignUp';
import Login from './app/components/Login/Login';
import PaymentPage from './app/components/Order/PaymentPage';


import FirstPage from './app/components/FirstPage/FirstPage';
import FanSignUp from './app/components/FirstPage/FanSignUp';
import EnrollTalent from './app/components/FirstPage/EnrollTalent';
import OTPverification from './app/components/FirstPage/OTPverification';
import StarSignUp from './app/components/FirstPage/StarSignUp';
import MediaUpload from './app/components/FirstPage/MediaUpload';
import HomeScreen from './app/components/HomePage/HomeScreen';
import SubDomainList from './app/components/HomePage/SubDomainList';
import SubDomainScreen from './app/components/HomePage/SubDomainScreen';
import StarProfilePage from './app/components/HomePage/StarProfilePage';
import BookingHistory from './app/components/Order/BookingHistory';
import IncomingRequests from './app/components/Order/IncomingRequests';
import OrderRegistration from './app/components/Order/OrderRegistration';
import ProfilePage from './app/components/Profile/ProfilePage';


const HomeStack = createStackNavigator(
  {
    SignUp ,
    Login,
    FirstPage ,
    FanSignUp,
    EnrollTalent,
    OTPverification,
    StarSignUp,
    MediaUpload,
    HomeScreen,
    SubDomainList,
    SubDomainScreen,
    StarProfilePage,
    OrderRegistration,
    PaymentPage
    
  },
  {
    initialRouteName:'FirstPage',
  }
);

/*HomeStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = false;
  //ToastAndroid.show(JSON.stringify(navigation.state), ToastAndroid.LONG);
  var routeArray = navigation.state.routes;
  for( const route of routeArray){
    if(route.routeName == 'HomeScreen'){
      tabBarVisible = true;
    }
    else if(route.routeName == 'SubDomainList'){
      tabBarVisible = true;
    }
    else if(route.routeName == 'StarProfilePage'){
      tabBarVisible = true;
    }
    else if(route.routeName == 'OrderRegistration'){
      tabBarVisible = true;
    } 
  }

  return {
    tabBarVisible,
  }
}
*/



const ProfileStack = createStackNavigator(
  {
    ProfilePage,
    BookingHistory,
    IncomingRequests,
    FirstPage    
  },
  {
    initialRouteName:'ProfilePage',
  }
);

/*
 ProfileStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = false;
  ToastAndroid.show(JSON.stringify(navigation.state), ToastAndroid.LONG);
  var routeArray = navigation.state.routes;
  for( const route of routeArray){
    if(route.routeName == 'HomeScreen'){
      tabBarVisible = true;
    }
    else if(route.routeName == 'SubDomainList'){
      tabBarVisible = true;
    }
    else if(route.routeName == 'StarProfilePage'){
      tabBarVisible = true;
    }
    else if(route.routeName == 'OrderRegistration'){
      tabBarVisible = true;
    } 
  }

  return {
    tabBarVisible,
  }
}

*/
const AppContainer = createAppContainer(
  createBottomTabNavigator(
    {
      //Login: LoginStack,
      Home: HomeStack,
      Profile: ProfileStack,
    },
    
  )
);

export default class App extends Component{
  constructor(props) {
    super(props);
  }

  render(){
    return <AppContainer></AppContainer>;
  }
}
