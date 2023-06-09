import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles';
import Progress from './component/Progress';
import Header from './component/Header';
import { createBrowserHistory } from 'history';

const MarketingLazy = lazy(() => import('./component/MarketingApp'));

const AuthLazy = lazy(() => import('./component/AuthApp.js'));

const DashboardLazy = lazy(() => import('./component/DashboardApp'));

const generateClassName = createGenerateClassName({
    productionPrefix: 'co'
})

const history = createBrowserHistory();

export default () => {
    const [isSignedIn, setIsSignedIn] = useState(false);

    useEffect(() => {
        if(isSignedIn){
            history.push('/dashboard')
        }
    }, [isSignedIn])
    return (
    <Router history={history}>
        <StylesProvider generateClassName={generateClassName}>   
            <div>
                <Header isSignedIn={isSignedIn} onSignOut={() => {
                    setIsSignedIn(false)
                }} />
                <Suspense fallback={<Progress/>}>
                    <Switch>
                        <Route path="/auth" >
                            <AuthLazy onSignIn={() => {setIsSignedIn(true)}}/>
                        </Route>
                        <Route path="/dashboard">
                            {!isSignedIn && <Redirect to="/"/>}
                            <DashboardLazy/>
                        </Route>
                        <Route path="/" component={MarketingLazy}/>
                    </Switch>
                </Suspense> 
            </div>
        </StylesProvider>
    </Router>
    )
}