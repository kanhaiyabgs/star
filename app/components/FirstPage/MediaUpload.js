import React, { Component } from 'react';
import { StyleSheet, Platform, Image, ScrollView, Text, View, Button, TouchableOpacity, Alert, ToastAndroid } from 'react-native';
import { app, auth, database, storage } from './../../src/config';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';

export default class MediaUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Iloading: false, userid: '', imageId: this.uniqueId(), imageSelected: false, Iuploading: false, Iprogress: 0,
            Vloading: false, userid: '', videoId: this.uniqueId(), videoSelected: false, Vuploading: false, Vprogress: 0
        };
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
                Iprogress: progress,
            });
        }, (error) => Alert.alert('error with upload - ' + error),
            () => {
                that.setState({ Iprogress: 100 });
                uploadTask.snapshot.ref.getDownloadURL().then((downloadUrl) => {
                    that.processImageUpload(downloadUrl);
                });

            });
    }

    processImageUpload = (imageUrl) => {
        database.ref('star').child(this.state.userid).child('public').child('avtar').set({ url: imageUrl });
        Alert.alert('Image uploaded!');
    }



    // VIDEO UPLOAD SECTION 


    uploadVideo = async () => {
        var that = this;
        const Blob = RNFetchBlob.polyfill.Blob;
        window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
        window.Blob = Blob;
        //var videoPath = '';
        ImagePicker.openPicker({
            mediaType: "video",
        }).then((video) => {
            ToastAndroid.show(JSON.stringify(video), ToastAndroid.LONG);
            Blob.build(RNFetchBlob.wrap(video.path), { type: video.mime })
                .then((blob) => {

                    var userid = app.auth().currentUser.uid;
                    ToastAndroid.show(userid, ToastAndroid.LONG);
                    that.setState({ userid: userid });
                    var videoId = this.uniqueId();
                    var re = /(?:\/)([a-zA-z0-9]+)$/;
                    var ext = re.exec(video.mime)[1];
                    this.setState({
                        videoId: videoId,
                        currentFileType: ext,
                        Vuploading: true
                    });
                    var FilePath = videoId + '.' + ext;
                    var uploadTask = storage.ref('star/' + userid + '/introVideo').child(FilePath).put(blob, { contentType: video.mime });

                    uploadTask.on('state_changed', (snapshot) => {
                        ToastAndroid.show(JSON.stringify(snapshot.bytesTransferred), ToastAndroid.SHORT);
                        ToastAndroid.show(JSON.stringify(snapshot.totalBytes), ToastAndroid.SHORT);

                        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        that.setState({
                            Vprogress: progress,
                        });
                    }, (error) => Alert.alert('error with upload - ' + error),
                        () => {

                            that.setState({ Vprogress: 100 });
                            uploadTask.snapshot.ref.getDownloadURL().then((downloadUrl) => {
                                that.processVideoUpload(downloadUrl);
                            });

                        });
                });
        });
    }

    processVideoUpload = (videoUrl) => {

        database.ref('star').child(this.state.userid).child('public').child('introVideo').set({ url: videoUrl });
        Alert.alert('Video uploaded!');
        this.setState({ Vdone: true, Vuploading: false });

    }

    render() {

        return (
            <  View style={styles.container}>
                <TouchableOpacity style={styles.buttonContainer}>
                    <Text style={styles.textStyle} onPress={this.uploadPhoto}>Choose photo</Text>
                </TouchableOpacity>
                <Text style={styles.textStyle} >{this.state.Iprogress}%</Text>

                <TouchableOpacity style={styles.buttonContainer}>
                    <Text style={styles.textStyle} onPress={this.uploadVideo}>Choose Intro Video</Text>
                </TouchableOpacity>
                <Text style={styles.textStyle}>{this.state.Vprogress}%</Text>
                <TouchableOpacity style={styles.buttonContainer}>
                    <Text style={styles.textStyle} onPress={() => this.props.navigation.navigate('HomeScreen')}>Done</Text>
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
    textStyle: {
        color: '#fff',
        textAlign: 'center',
    },
    textInput: {
        height: 40,
        width: '90%',
        borderColor: '#00BCD4',
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 8,
        marginBottom: 12
    },
    buttonContainer: {
        marginTop: 10,
        paddingTop: 15,
        width: '50%',
        paddingBottom: 15,
        marginLeft: 30,
        marginRight: 30,
        backgroundColor: '#00BCD4',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff'
    }
});