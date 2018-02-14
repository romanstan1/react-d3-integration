import React, {Component} from 'react';
import {Route,Router,Switch} from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import Index from './components'
import Terrain from './components/Terrain/Terrain'

const history = createBrowserHistory()

class App extends Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path="/terrain" component={Terrain}/>
          <Route component={Index}/>
        </Switch>
      </Router>)
  }
}
export default App
