import React from 'react';
import MarketingApp from './component/MarketingApp';
import Header from './component/Header';
import { BrowserRouter } from 'react-router-dom';
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles';

const generateClassName = createGenerateClassName({
    productionPrefix: 'co'
})
export default () => {
    return (
    <BrowserRouter>
        <StylesProvider generateClassName={generateClassName}>   
            <div>
                <Header />
                <MarketingApp />
            </div>
        </StylesProvider>
    </BrowserRouter>
    )
}