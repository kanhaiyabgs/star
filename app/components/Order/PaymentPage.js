import React from 'react';
import { Text, ToastAndroid, Alert } from 'react-native';
import axios from 'axios';
import { WebView } from 'react-native-webview';

export default class PaymentPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = { url: null, payment_request_id: null };
    }
    componentDidMount() {
        const { state } = this.props.navigation;
        var url = state.params.url;
        var payment_request_id = state.params.payment_request_id;
        this.setState({ url: url, payment_request_id: payment_request_id });
    }
    onNavigationChange(webViewState) {
        let hitUrl = webViewState.url;
        ToastAndroid.show(JSON.stringify(webViewState), ToastAndroid.LONG);
        
    }
    
    render() {

        return (
            <WebView
                ref="webview"
                source={{ uri: this.state.url }}
                onNavigationStateChange={this.onNavigationChange.bind(this)}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                // renderLoading={this.renderLoading.bind(this)}
                onMessage={(event) => console.log(event.nativeEvent.data)} />

        );
    }
}