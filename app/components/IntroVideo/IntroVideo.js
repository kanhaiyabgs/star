import React, { Component } from 'react';
import { StyleSheet, Platform, Image,ScrollView, Text, View, Button, Alert, ToastAndroid } from 'react-native';
import { app, auth, database, storage } from './../../src/config';
//import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';
import Video from 'react-native-video';

export default class introVideo extends Component {
    constructor(props) {
        super(props);
        this.state = { url:'',userid: '', vidoeId:'', imageSelected: false, uploading: true, progress: 0, done:false };
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
            Blob.build(RNFetchBlob.wrap(video.path), { type : video.mime})
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
                    uploading: true
                });
                var FilePath = videoId + '.' + ext;
                var uploadTask = storage.ref('star/' + userid + '/introVideo').child(FilePath).put(blob, {contentType:video.mime});

                uploadTask.on('state_changed', (snapshot) => {
                    ToastAndroid.show(JSON.stringify(snapshot.bytesTransferred), ToastAndroid.SHORT);
                    ToastAndroid.show(JSON.stringify(snapshot.totalBytes), ToastAndroid.SHORT);

                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
            });
        });
    }
    processUpload = (videoUrl) => {

        //database.ref('star').child(this.state.userid).child('public').set({ url:imageUrl});

        database.ref('star').child(this.state.userid).child('public').child('introVideo').set({ url: videoUrl });
        this.setState({url: videoUrl});
        Alert.alert('Video uploaded!');
        this.setState({done:true, uploading: false});
        //this.props.navigation.navigate('ProfileDetails');

    }
                        

    render() {

        return (
            <  View style={styles.container}>
                <View style ={{flex:1, backgroundColor: 'black'}}> 
                        <Video 
                            source={{ uri: this.state.url}}
                            resizeMode={'stretch'}
                            rate={1} volume={1} muted={false}
                            repeat={true}
                            style={{ position:'absolute',flex: 1,  height: '80%', width: '100%', top:0, left: 0 }}
                        />
                        <Button
                            title="Choose Intro video"
                            onPress={this.uploadVideo}
                            style={{ position:'absolute', bottom:'15%', left: 0 }}>

                        </Button>

                        <Text>{this.state.progress}%</Text>
                    </View>

                
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});