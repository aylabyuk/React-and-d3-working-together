import React, {Component} from 'react'
import Perf from 'react-addons-perf'
import { Router, Route } from 'react-router'

// redux
import { createBrowserHistory } from 'history';
import reduxThunk from 'redux-thunk'
import rootReducer from './reducers/index'
import { applyMiddleware, createStore } from 'redux';

//apollo client
import ApolloClient from 'apollo-client'
import { createBatchNetworkInterface } from 'apollo-upload-client'
import { ApolloProvider } from 'react-apollo'


//subscription client
import {SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';

import App from './App'

export let PORT
export let ip

window.Perf = Perf

if(window.location.port == '8080'){
  PORT=4040
  ip="localhost:"
} else {
  PORT=4000
  ip="192.168.1.200:"
}

// Create regular NetworkInterface by using apollo-client's API: 
const networkInterface = createBatchNetworkInterface({
  opts: {
    credentials: "same-origin",
  },
  batchInterval: 20,
  uri: "http://" + ip + PORT + "/graphql",
});

// connect to web-socket for subscription
const wsClient = new SubscriptionClient("ws://" + ip + PORT + "/", {
    reconnect: true,
    connectionParams: {
        // Pass any arguments for initialization 
    }
});

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
    networkInterface,
    wsClient
);


// create apollo client with subscription
export const apolloClient = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
  connectToDevTools: true,
  addTypename: false
});


const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore)
const store = createStoreWithMiddleware(rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());


class primary extends Component {
  render() {
    return (
     <ApolloProvider client={apolloClient} store={store} >
      <App routes={this.props.routes()}/>
    </ApolloProvider>
    );
  }
}

export default primary;