import React from 'react';
import { connect } from 'react-redux';
import { Router, Switch, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Home from './Home';
import Reply from './Reply';
import Header from './Header';
import Meeting from './Meeting';
import Search from './Search';
import GAListener from './GAListener';

const history = createBrowserHistory();

const App = () => (
  <div>
    <Header history={history} />
    <GAListener history={history}>
      <Router history={history}>
        <Switch>
          <Route exact path="/reply/:replyKey/" component={Reply} />
          <Route exact path="/meeting/:year/:bureau/" component={Meeting} />
          <Route exact path="/search/:keyword" component={Search} />
          <Route exact path="/" component={Home} />
        </Switch>
      </Router>
    </GAListener>
  </div>
);

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(App);
