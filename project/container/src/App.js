import React from 'react';
import MarketingApp from './component/MarketingApp';
import Header from './component/Header';
import { BrowserRouter } from 'react-router-dom';

export default () => {
    return (
    <BrowserRouter>
        <div>
            <Header />
            <MarketingApp />
        </div>
    </BrowserRouter>
    )
}