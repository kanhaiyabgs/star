import React , {Component} from 'react';
import {StyleSheet, Platform, Image, Text, View, Button, Alert} from 'react-native';
import {auth, storage} from './../../src/config';
import ImagePicker from 'react-native-image-picker';

export default class Home extends Component{
    state = {currentUser:null, photo: null};
    uploadPhoto = () => {
        const options = {
            noData: true
        };

        ImagePicker.showImagePicker(options, (response) => {
            this.setState({photo: response});
            this.uploadImage(response.uri, "test-image").then(()=>{
                Alert.alert("success");
            })
            .catch((error) => {
                Alert.alert(error);
            });
            //var blob = new Blob(this.state.photo.uri, {type:"image/jpeg"});
            //storage.ref('image').child(auth.currentUser.uid).put(blob);

        });
        
        
    }
    uploadImage = async (uri, imageNmae) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        var ref = storage.ref('images').child(auth.currentUser.uid);
        return ref.put(blob);
    }  
    componentDidMount(){
        const {currentUser} = auth;
        this.setState({currentUser});
    }

    render(){
        const currentUser = this.state.currentUser;
        const  photo = this.state.photo;

        return(
            <View style={styles.container}>
                {photo && (
                    <Image source={{uri: photo.uri}}
                           style={{width: 300, height: 300}}>

                           </Image>
                )}
                <Button
                  title="Choose photo"
                  onPress={this.uploadPhoto}></Button>

                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
});