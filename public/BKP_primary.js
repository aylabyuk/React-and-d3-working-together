/* eslint-disable */

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import reduxThunk from 'redux-thunk'
import rootReducer from './reducers/index'
import App from './App'
import { Router, Route,  } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import { BrowserRouter  } from 'react-router-dom'

//React Components
import NotFoundPage from './comp/NotFoundPage'
import _LogSheet from './comp/logsheet/_LogSheet'
import _Staff from './comp/staff/_Staff'
import LogSheetViewer from './comp/logsheetViewer/LogsheetViewer'
import _Sites from './comp/sites/_Sites'

//apollo client
import ApolloClient, { createBatchingNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'

//subscription client
import {SubscriptionClient, addGraphQLSubscriptions} from 'subscriptions-transport-ws';

// Create regular NetworkInterface by using apollo-client's API: 
const networkInterface = createBatchingNetworkInterface({
  opts: {
    credentials: "same-origin",
  },
  batchInterval: 20,
  uri: "http://192.168.1.16:4000/graphql",
});

// connect to web-socket for subscription
const wsClient = new SubscriptionClient(`ws://192.168.1.16:4000/`, {
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


const history = syncHistoryWithStore(BrowserRouter, store);

//hot reload for reducer
if(module.hot) {
    module.hot.accept('./reducers/', () => {
        const nextRootReducer = require('./reducers/index').default;
        store.replaceReducer(nextRootReducer);
    })
}

const routes = (
    <Route exact path="/" component={App}>
        <Route component={_LogSheet} />
        <Route path="/logsheets" component={LogSheetViewer} />
        <Route path="/staff" component={_Staff} />
        <Route path="/sites" component={_Sites} />

        <Route path="*" component={NotFoundPage} />
    </Route>
)

const primary = () => (
    <ApolloProvider client={apolloClient} store={store}>
        <Router history={history}>
            {routes}
        </Router>
    </ApolloProvider >
)

export default primary;