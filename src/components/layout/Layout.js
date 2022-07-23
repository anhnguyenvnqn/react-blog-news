import React, { Fragment } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';


const Layout = ({ children }) => {
    return (
        <Fragment>
            <Header></Header>
            {children}
            
        </Fragment>
    );
};

export default Layout; 