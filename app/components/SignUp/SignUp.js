import React, { Component } from 'react';
import { ToastAndroid, ScrollView,Alert, TouchableOpacity, StyleSheet, Text, TextInput, View, Button } from 'react-native';
import { auth, database } from './../../src/config';
import User from './../../modals/User'

export default class SignUp extends Component {

  constructor(props) {
    super(props);
    this.state = { email: '', password: '', errorMessage: null, name: '', username: '', domain: '', subDomain: '', bio: '', cost: '' };
  }

  handleSignUp = async () => {
    var that = this;

    await auth.createUserWithEmailAndPassword(this.state.email, this.state.password).then( () => {
      auth.onAuthStateChanged(function (user) {
        if (user) {
          // If user is successfully created in authentication page
          const userid = user.uid;
          database.ref('star').child(userid).child('public').set({ name: that.state.name, username: that.state.username, domain: that.state.domain, subDomain: that.state.subDomain, bio: that.state.bio, cost: that.state.cost });
          database.ref('star').child(userid).child('private').set({ email: that.state.email});
          database.ref('domain').child(that.state.domain.toLocaleLowerCase()).child(userid).set({present:'yes'});
          database.ref('name').child(that.state.name).child(userid).set({present:'yes'});
          database.ref('subDomain').child(that.state.subDomain.toLowerCase()).child(userid).set({present:'yes'});
          
          

        } else {
          Alert.alert('User creation failed');
        }
        that.props.navigation.navigate('Home');
    })})
    .catch(error => this.setState({ errorMessage: error.message }));
    
  };
  
  render() {
    return (
      <View style={styles.container}>
        <Text>SignUp</Text>
        <ScrollView style={{marginLeft:10, marginRight:10}}
          scrollEnabled={true}>
        <Text style={{fontWeight: "bold"}}>Name</Text>
        <TextInput placeholder="Name goes here" autoCapitalize="none" style={styles.textInput} onChangeText={name => this.setState({ name })} value={this.state.name}>
        </TextInput>
        <Text style={{fontWeight: "bold"}}>Username</Text>
        <TextInput placeholder="User name goes here" autoCapitalize="none" style={styles.textInput} onChangeText={username => this.setState({ username })} value={this.state.username}>
        </TextInput>

        {this.state.errorMessage && <Text style={{ color: 'red' }}>{this.state.errorMessage}</Text>}
        <Text style={{fontWeight: "bold"}}>Email</Text>
        <TextInput placeholder="Email goes here" autoCapitalize="none"
          style={styles.textInput} onChangeText={email => this.setState({ email })} value={this.state.email} ></TextInput>
     
        <Text style={{fontWeight: "bold"}}>Password</Text>
        <TextInput secureTextEntry placeholder="Password goes here" autoCapitalize="none"
          style={styles.textInput} onChangeText={password => this.setState({ password })}
          value={this.state.password}>

        </TextInput>
        <Text style={{fontWeight: "bold"}}>Domain</Text>
        <TextInput placeholder="Actor, youtuber who you are" autoCapitalize="none" style={styles.textInput} onChangeText={domain => this.setState({ domain })} value={this.state.domain}>
        </TextInput>
        <TextInput placeholder="any specifice shows, movies, type of music, specific sport" autoCapitalize="none" style={styles.textInput} onChangeText={subDomain => this.setState({ subDomain })} value={this.state.subDomain}>
        </TextInput>
        <Text style={{fontWeight: "bold"}}>Cost</Text>
        <TextInput placeholder="Cost charged by you" autoCapitalize="none" style={styles.textInput} onChangeText={cost => this.setState({ cost })} value={this.state.cost}>
        </TextInput>
        <Text style={{fontWeight: "bold"}}>Bio</Text>
        <TextInput placeholder="Bio or short introduction about you" autoCapitalize="none" style={styles.textInput} onChangeText={bio => this.setState({ bio })} value={this.state.bio}>
        </TextInput>
        </ScrollView>

        <TouchableOpacity>
          <Button title="Sign Up" onPress={this.handleSignUp}></Button>
        </TouchableOpacity>
        <TouchableOpacity>
          <Button title="Already have an account? Login" onPress={() => this.props.navigation.navigate('Login')}></Button>
        </TouchableOpacity>
      </View>

    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8,
  }
});