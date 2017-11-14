import React, {Component} from 'react';
import {Route,Router,Switch} from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import {SimilarityNetworkPage, ProgressArcPage, HierarchicalEdgePage } from './pages'
import Navigation from './pages/Navigation'
import Error from './pages/Error'

const history = createBrowserHistory()

class App extends Component {
  render() {
    return (
      <Router history={history}>
        <span>
          <Navigation/>
          <Switch>
            <Route exact path="/SimilarityNetwork" component={SimilarityNetworkPage} />
            <Route exact path="/ProgressArc" component={ProgressArcPage} />
            <Route exact path="/HierarchicalEdge" component={HierarchicalEdgePage} />
            <Route component={Error}/>
          </Switch>
        </span>
      </Router>)
  }
}
export default App
