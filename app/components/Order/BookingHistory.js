import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    ToastAndroid,
    Animated,
    ScrollView,
    FlatList,
    Image,
    Dimensions,
    Alert
} from "react-native";
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
            xTabThree: 0,
            xTabFour: 0,
            translateX: new Animated.Value(0),
            translateXTabOne: new Animated.Value(0),
            translateXTabTwo: new Animated.Value(width),
            translateXTabThree: new Animated.Value(2 * width),
            translateXTabFour: new Animated.Value(3 * width),
            // setting y translation to the height of flat list
            translateAccepted:0,
            translateCompleted:0,
            translatePending:0,
            //all the flat list data begins here
            dataPending: [],
            dataAccepted: [],
            dataCompleted: [],
            dataDeclined: [],
            imageData: {},
            dataPendingRefresh: false
        };

    }
    componentDidMount() {
        this.getInfo().then(() => {
            //ToastAndroid.show(JSON.stringify(this.state.dataco), ToastAndroid.LONG);
            this.getPic().then(() => {
                //ToastAndroid.show(JSON.stringify(this.state.imageData), ToastAndroid.LONG);
            });

        })
    }

    handleSlide = type => {
        let {
            active,
            xTabOne,
            xTabTwo,
            xTabThree,
            xTabFour,
            translateX,
            translateXTabOne,
            translateXTabTwo,
            translateXTabThree,
            translateXTabFour,
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
                Animated.spring(translateXTabThree, {
                    toValue: 2 * width,
                    duration: 100
                }).start(),
                Animated.spring(translateXTabFour, {
                    toValue: 3 * width,
                    duration: 100
                }).start()
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
                Animated.spring(translateXTabThree, {
                    toValue: width,
                    duration: 100
                }).start(),
                Animated.spring(translateXTabFour, {
                    toValue: 2 * width,
                    duration: 100
                }).start()
            ]);
        }
        else if (active === 2) {
            Animated.parallel([
                Animated.spring(translateXTabOne, {
                    toValue: -2 * width,
                    duration: 100
                }).start(),
                Animated.spring(translateXTabTwo, {
                    toValue: -width,
                    duration: 100
                }).start(),
                Animated.spring(translateXTabThree, {
                    toValue: 0,
                    duration: 100
                }).start(),
                Animated.spring(translateXTabFour, {
                    toValue: width,
                    duration: 100
                }).start()
            ]);
        } else {
            Animated.parallel([
                Animated.spring(translateXTabOne, {
                    toValue: -3 * width,
                    duration: 100
                }).start(),
                Animated.spring(translateXTabTwo, {
                    toValue: -2 * width,
                    duration: 100
                }).start(),
                Animated.spring(translateXTabThree, {
                    toValue: -width,
                    duration: 100
                }).start(),
                Animated.spring(translateXTabFour, {
                    toValue: 0,
                    duration: 100
                }).start()
            ]);
        }
    };

    getPic = async () => {
        var that = this;
        var promises = [];
        Object.entries(this.state.imageData).map(([key, value]) => {
            let promise = database.ref('star').child(key).child('public').child('avtar').once('value', (snap) => {
                const newObj = Object.assign({}, that.state.imageData);
                newObj[val['starId']] = snap.val().url;
                that.setState({ imageData: newObj });

                //ToastAndroid.show(snap.val().url, ToastAndroid.LONG);
            });

            promises.push(promise);

        });
        await Promise.all(promises);
        this.setState({ dataPendingRefresh: false });

    }

    getInfo = async () => {
        var that = this;
        var userId = app.auth().currentUser.uid;
        this.setState({ userId: userId });

        await database.ref('reservation').child('booking_fan').child(userId).once('value', (snap) => {
            that.setState({ dataPendingRefresh: true });
            Object.entries(snap.val()).map(([key, value]) => {
                data = {};
                val = value['info'];
                //ToastAndroid.show(JSON.stringify(key), ToastAndroid.LONG);

                data['starId'] = val['starId'];
                data['for'] = val['for'];
                data['from'] = val['from'];
                data['message'] = val['message'];
                data['video'] = val['videoUrl'];
                data['status'] = value['status'];

                // write code for removing duplicate keys and values in dictionary

                const newObj = Object.assign({}, that.state.imageData);
                newObj[val['starId']] = '';
                that.setState({ imageData: newObj });

                //data['imageUrl'] = that.getPic(val['starId']);
                //ToastAndroid.show(JSON.stringify(data), ToastAndroid.LONG);

                if (value['status'] == 0) {
                    that.state.dataPending.push(data);
                }
                else if (value['status'] == 1) {
                    that.state.dataAccepted.push(data);
                }
                else if (value['status'] == 2) {
                    that.state.dataCompleted.push(data);
                }
                else {
                    that.state.dataDeclined.push(data);
                }
            });

        });

        // plese set dataCompletedRefresh and dataAcceptedRefresh as well 
        that.setState({ dataPendingRefresh: true });

    }

    extraInfo = async (item) => {
        Alert.alert(item.message + item.video);

    }

    _keyExtractor = (item, index) => item.id;

    // this thing works fantastic . But its only for android . So please also write the code for ios also 

    downloadVideo = async (item) => {
        ToastAndroid.show(JSON.stringify(item), ToastAndroid.LONG);
        var url = item.video;

        //const Blob = RNFetchBlob.polyfill.Blob;
        //window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
        //window.Blob = Blob;

        let dirs = RNFetchBlob.fs.dirs;
        RNFetchBlob
            .config({
                fileCache: true,
                addAndroidDownloads: {
                    useDownloadManager: true,
                    notification: true,
                    path: dirs.DownloadDir + '/' + 'abc.mp4',
                // response data will be saved to this path if it has access right.
                // you are only going for android , change here for ios as well 
                //path: dirs.DownloadDir
                }
            })
            .fetch('GET', url, {
                //some headers ..
            })
            .then((res) => {
                // the path should be dirs.DocumentDir + 'path-to-file.anything'
                ToastAndroid.show(JSON.stringify(res), ToastAndroid.LONG);
            })

    }

    _renderItem = ({ item }) => (

        <View style={{ margin: 10, flexDirection: "row" }} >
            <Image source={{ uri: this.state.imageData[item.starId] }} style={{ width: 100, height: 100 }}></Image>
            <View style={{ marginLeft: 20, flexDirection: 'column' }}>
                <Text>{'For : ' + item.for}</Text>
                <Text>{'From  : ' + item.from}</Text>
            </View>
            <TouchableHighlight
                onPress={() => { this.extraInfo(item) }}><Text>Message</Text>
            </TouchableHighlight>
            {item.status == 2 && <TouchableHighlight
                onPress={() => { this.downloadVideo(item) }}><Text>Download</Text>
            </TouchableHighlight>}

        </View>
    );

    // work properly with translateY thing. Its really putting things up and down 

    render() {
        let {
            active,
            xTabOne,
            xTabTwo,
            xTabThree,
            xTabFour,
            translateX,
            translateY,
            translateXTabOne,
            translateXTabTwo,
            translateXTabThree,
            translateXTabFour
        } = this.state;

        return (
            <View style={{ flex: 1, width: "100%" }}>
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
                                Accepted
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
                                    xTabThree: event.nativeEvent.layout.x
                                })
                            }
                            onPress={() =>
                                this.setState({ active: 2 }, () =>
                                    this.handleSlide(xTabThree)
                                )
                            }
                        >
                            <Text
                                style={{
                                    color: active === 2 ? "#fff" : "#007aff"
                                }}
                            >
                                Completed
                            </Text>
                        </TouchableOpacity>
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
                                    xTabFour: event.nativeEvent.layout.x
                                })
                            }
                            onPress={() =>
                                this.setState({ active: 3 }, () =>
                                    this.handleSlide(xTabFour)
                                )
                            }
                        >
                            <Text
                                style={{
                                    color: active === 3 ? "#fff" : "#007aff"
                                }}
                            >
                                Declined
                            </Text>
                        </TouchableOpacity>
                    </View>
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
                                    translatePending: event.nativeEvent.layout.height
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
                                        translateY: -this.state.translatePending
                                    }
                                ]
                            }}
                            onLayout={event =>
                                this.setState({
                                    translateAccepted: event.nativeEvent.layout.height
                                })
                            }
                        >
                            <FlatList
                                data={this.state.dataAccepted}
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
                                        translateX: translateXTabThree
                                    },
                                    {
                                        translateY: -(this.state.translatePending + this.state.translateAccepted)
                                    }
                                ]
                            }}
                            onLayout={event =>
                                this.setState({
                                    translateCompleted: event.nativeEvent.layout.height
                                })
                            }
                        >
                            <FlatList
                                data={this.state.dataCompleted}
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
                                        translateX: translateXTabFour
                                    },
                                    {
                                        translateY: -(this.state.translateAccepted+ this.state.translatePending+ this.state.translateCompleted)
                                    }
                                ]
                            }}
                        >
                            <FlatList
                                data={this.state.dataDeclined}
                                refreshing={this.state.dataPendingRefresh}
                                renderItem={item => this._renderItem(item)}
                            ></FlatList>
                        </Animated.View>
                    
            </View>
        );
    }
}