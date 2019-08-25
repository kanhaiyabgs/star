import React, { Component } from 'react';
import { StyleSheet, Platform, Image, ScrollView, Text, View, Button, Alert, ToastAndroid } from 'react-native';
import { app, auth, database, storage } from './../../src/config';
//import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';
import { conditionalExpression } from '@babel/types';
//import * as RNFS from 'react-native-fs';
//import { ScrollView } from 'react-native-gesture-handler';
//import console = require('console');

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { data: '', loading: false, userid: '', photo: null, imageId: this.uniqueId(), imageSelected: false, uploading: false, progress: 0 };
    }

    s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    uniqueId = () => {
        return (
            this.s4() + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4()
        );
    };


    uploadPhoto = async () => {
        var that = this;
        //var videoPath = '';
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
            mediaType: "photo",
        }).then((image) => {
            const imagePath = image.path;
            that.setState({
                imageSelected: true,
                imageId: this.uniqueId(),
                uri: imagePath
            });
            that.uploadImage(imagePath);
        });

    }



    uploadImage = async (uri) => {
        var that = this;
        ToastAndroid.show(app.auth().currentUser.uid.toString(), ToastAndroid.SHORT);
        var userid = app.auth().currentUser.uid;

        ToastAndroid.show(auth.currentUser.uid.toString(), ToastAndroid.SHORT);

        that.setState({ userid: userid });
        var imageId = that.state.imageId;

        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(uri)[1];
        this.setState({
            currentFileType: ext,
            uploading: true
        });
        var FilePath = imageId + '.' + that.state.currentFileType;
        const response = await fetch(uri);
        const blob = await response.blob();
        var uploadTask = storage.ref('star/' + userid + '/image').child(FilePath).put(blob);

        uploadTask.on('state_changed', (snapshot) => {
            var progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
            that.setState({
                progress: progress,
            });
        }, (error) => Alert.alert('error with upload - ' + error),
            () => {
                that.setState({ progress: 100 });
                uploadTask.snapshot.ref.getDownloadURL().then((downloadUrl) => {
                    that.processUpload(downloadUrl);
                });

            });
    }

    processUpload = (imageUrl) => {

        //database.ref('star').child(this.state.userid).child('public').set({ url:imageUrl});

        database.ref('star').child(this.state.userid).child('public').child('avtar').set({ url: imageUrl });
        Alert.alert('Image uploaded!');
        this.props.navigation.navigate('IntroVideo');
    }

    render() {

        return (
            <  View style={styles.container}>

                <Button
                    title="Choose photo"
                    onPress={this.uploadPhoto}>

                </Button>

                {this.state.uploading == true ? (
                    <View>
                        <Text>{this.state.progress}%</Text>
                    </View>

                ) : (
                        <Text>Not uploading </Text>


                    )


                }
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
});