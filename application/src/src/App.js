import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Users from './pages/Users';
import Projects from './pages/Projects';

export default class App extends Component {
    render () {
        return (
            <Layout>
                <Route exact path='/' component={Home} />
                <Route path='/users' component={Users} />
                <Route path='/projects' component={Projects} />
            </Layout>
        );
    }
}


