import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    ScrollView,
    ToastAndroid,
    StyleSheet,
    FlatList,
    Image,
    Dimensions,
    Alert
} from "react-native";
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';
import { database, storage, auth, app } from '../../src/config';

const { width } = Dimensions.get("window");

export default class BookingHistory extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            active: 0,
            xTabOne: 0,
            xTabTwo: 0,
            translateX: new Animated.Value(0),
            translateXTabOne: new Animated.Value(0),
            translateXTabTwo: new Animated.Value(width),
            translateY: -1000,
            //all the flat list data begins here
            dataPending: [],
            dataAccepted: [],
            dataCompleted: [],
            dataDeclined: []
        };
    }

    
    componentDidMount() {
        this.getInfo().then(() => {
            ToastAndroid.show(JSON.stringify(this.state.dataPending), ToastAndroid.LONG);
            ToastAndroid.show(JSON.stringify(this.state.dataCompleted), ToastAndroid.LONG);
        }) 
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



    handleSlide = type => {
        let {
            active,
            xTabOne,
            xTabTwo,
            translateX,
            translateXTabOne,
            translateXTabTwo,
            translateY
        } = this.state;
        Animated.spring(translateX, {
            toValue: type,
            duration: 100
        }).start();
        if (active === 0) {
            Animated.parallel([
                Animated.spring(translateXTabOne, {
                    toValue: 0,
                    duration: 100
                }).start(),
                Animated.spring(translateXTabTwo, {
                    toValue: width,
                    duration: 100
                }).start(),
            ]);
        }
        else if (active === 1) {
            Animated.parallel([
                Animated.spring(translateXTabOne, {
                    toValue: -width,
                    duration: 100
                }).start(),
                Animated.spring(translateXTabTwo, {
                    toValue: 0,
                    duration: 100
                }).start(),
            ]);
        }
    };

    getPic = async (id) => {
        database.ref('star').child(userid).child('public').child('avtar').once('value', (snap) => {
            return snap.val().url
        })
    }

    getInfo = async () => {
        var that = this;
        var userId = app.auth().currentUser.uid;
        this.setState({ userId: userId });
        
        await database.ref('reservation').child('booking_star').child(userId).once('value', (snap) => {
            that.setState({ dataPendingRefresh: true });
            Object.entries(snap.val()).map(([key, value]) => {
                data = {};
                val = value['info'];
                data['bookingId'] = key;
                //ToastAndroid.show(JSON.stringify(key), ToastAndroid.LONG);

                data['fanId'] = val['fanId'];
                data['for'] = val['for'];
                data['from'] = val['from'];
                data['message'] = val['message'];
                data['video'] = value['videoUrl'];
                data['status'] = value['status'];

                // write code for removing duplicate keys and values in dictionary

                if (value['status'] == 0) {
                    that.state.dataPending.push(data);
                }
                else if (value['status'] == 1) {
                    that.state.dataPending.push(data);
                }
                else if (value['status'] == 2) {
                    that.state.dataCompleted.push(data);
                }
            });

        });

        // plese set dataCompletedRefresh and dataAcceptedRefresh as well 
        that.setState({ dataPendingRefresh: false });

    }

    extraInfo = async (item) => {
        Alert.alert(item.message + item.video);

    }

    _keyExtractor = (item, index) => item.id;

    processRequest = (item, result) => {
        var that = this;
        
        database.ref('reservation').child('booking_fan').child(item.fanId).child(item.bookingId).child('status').set(result);
        database.ref('reservation').child('booking_star').child(app.auth().currentUser.uid).child(item.bookingId).child('status').set(result);
        this.setState({dataPendingRefresh: true});
        this.setState({dataPending: [], dataCompleted: []});
        this.getInfo().then(() => {
            this.setState({dataPendingRefresh:false});
        })

    }

    uploadVideo = async (item) => {
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
                    var videoId = this.uniqueId();
                    var re = /(?:\/)([a-zA-z0-9]+)$/;
                    var ext = re.exec(video.mime)[1];
                    this.setState({
                        videoId: videoId,
                        currentFileType: ext,
                        Vuploading: true
                    });
                    var FilePath = videoId + '.' + ext;


                    var uploadTask = storage.ref('reservation/star' + this.state.userId + '/fan/' +  item['fanId'] + '/' + item['bookingId']).child(FilePath).put(blob, { contentType: video.mime });

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
                                that.processVideoUpload(item, downloadUrl);
                            });

                        });
                });
        });
    }

    processVideoUpload = (item, videoUrl) => {
        database.ref('reservation').child('booking_fan').child(item['fanId']).child(item['bookingId']).child('status').set(2);
        database.ref('reservation').child('booking_fan').child(item['fanId']).child(item['bookingId']).child('info').child('videoUrl').set(videoUrl);
        database.ref('reservation').child('booking_star').child(this.state.userId).child(item['bookingId']).child('status').set(2);
        database.ref('reservation').child('booking_star').child(this.state.userId).child(item['bookingId']).child('info').child('videoUrl').set(videoUrl);

        database.ref('star').child(this.state.userId).child('public').child('bookedVideo').child(item['for']).set({url : videoUrl});
        Alert.alert('Video uploaded!');

        // check this uploading stuff ;
        this.setState({refresh: true});
    }


    //// set refreshing of flat list here so as to show real time change of these buttons

    render_buttons = (item) => {
        if(item.status == 0){
            // set refreshing of flat list here so as to show real time change of these buttons
            return <View style={{margin:10, flexDirection: 'column'}}>
                <TouchableOpacity style={styles.buttonContainer}>
                        <Text style={styles.textStyle} onPress={() => this.processRequest(item, 1)}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonContainer}>
                        <Text style={styles.textStyle} onPress={() => this.processRequest(item, 3)}>Decline</Text>
                </TouchableOpacity>


            </View>
        }
        else if(item.status == 1){
            return <TouchableOpacity style={styles.buttonContainer}>
                        <Text style={styles.textStyle} onPress={() => this.uploadVideo(item)}>Upload Video</Text>
                </TouchableOpacity>

        }
    }

    _renderItem = ({ item }) => (
        <View style={{ margin: 10, flexDirection: "column" }}>
                <Text>{'For : ' + item.for}</Text>
                <Text>{'From  : ' + item.from}</Text>
                <TouchableOpacity style={styles.buttonContainer}>
                        <Text style={styles.textStyle} onPress={() => Alert.alert(item.message)}>Message</Text>
                </TouchableOpacity>
                {this.render_buttons(item)}
        </View>
    );

    render() {
        let {
            active,
            xTabOne,
            xTabTwo,
            translateX,
            translateY,
            translateXTabOne,
            translateXTabTwo,
        } = this.state;

        return (
            <View style={{ flex: 1 }}>
                <View
                    style={{
                        width: "100%",
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            marginTop: 0,
                            marginBottom: 20,
                            height: 36,
                            position: "relative"
                        }}
                    >
                        <Animated.View
                            style={{
                                position: "absolute",
                                width: "25%",
                                height: "100%",
                                top: 0,
                                left: 0,
                                backgroundColor: "#007aff",
                                borderRadius: 4,
                                transform: [
                                    {
                                        translateX
                                    }
                                ]
                            }}
                        />
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                                borderWidth: 1,
                                borderColor: "#007aff",
                                borderRadius: 4,
                                borderRightWidth: 0,
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0
                            }}
                            onLayout={event =>
                                this.setState({
                                    xTabOne: event.nativeEvent.layout.x
                                })
                            }
                            onPress={() =>
                                this.setState({ active: 0 }, () =>
                                    this.handleSlide(xTabOne)
                                )
                            }
                        >
                            <Text
                                style={{
                                    color: active === 0 ? "#fff" : "#007aff"
                                }}
                            >
                                Pending
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                                borderWidth: 1,
                                borderColor: "#007aff",
                            }}
                            onLayout={event =>
                                this.setState({
                                    xTabTwo: event.nativeEvent.layout.x
                                })
                            }
                            onPress={() =>
                                this.setState({ active: 1 }, () =>
                                    this.handleSlide(xTabTwo)
                                )
                            }
                        >
                            <Text
                                style={{
                                    color: active === 1 ? "#fff" : "#007aff"
                                }}
                            >
                                Completed
                            </Text>
                        </TouchableOpacity>
                    
                    </View>

                    <ScrollView>
                        <Animated.View
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                transform: [
                                    {
                                        translateX: translateXTabOne
                                    }
                                ]
                            }}
                            onLayout={event =>
                                this.setState({
                                    translateY: event.nativeEvent.layout.height
                                })
                            }
                        >
                            <FlatList
                                data={this.state.dataPending}
                                refreshing={this.state.dataPendingRefresh}
                                renderItem={item => this._renderItem(item)}
                            ></FlatList>
                        </Animated.View>

                        <Animated.View
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                transform: [
                                    {
                                        translateX: translateXTabTwo
                                    },
                                    {
                                        translateY: -translateY
                                    }
                                ]
                            }}
                        >
                            <FlatList
                                data={this.state.dataCompleted}
                                refreshing={this.state.dataPendingRefresh}
                                renderItem={item => this._renderItem(item)}
                            ></FlatList>
                        </Animated.View>
                        
                    </ScrollView>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textStyle:{
        color:'#fff',
        textAlign:'center',
    },
    textInput: {
        height: 40,
        width: '90%',
        borderColor: '#00BCD4',
        borderWidth: 1,
        borderRadius:10,
        marginTop: 8,
        marginBottom:12
    },
    buttonContainer:{
        marginTop: 10,
        paddingTop: 15,
        paddingBottom: 15,
        marginLeft: 30,
        marginRight: 30,
        backgroundColor: '#00BCD4',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff'
    }
});