import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import Home from './components/Home';
import Users from './pages/Users';

export default class App extends Component {
    render () {
        return (
            <Layout>
                <Route exact path='/' component={Home} />
                <Route path='/users' component={Users} />
            </Layout>
        );
    }
}


