import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const AuthenticationPageStyle = styled.div`
    min-height: 100vh;
    padding: 40px;

    .logo {
        margin: 0 auto 20px;
    }
    .heading {
        text-align: center;
        color: ${props => props.theme.primary};
        font-weight: bold;
        font-size: 40px;
        margin-bottom: 60px ;
    }
    .form { 
        max-width: 600px;
        margin: auto;
    }
    .have-account {
        margin-bottom: 20px;
        a {
            display: inline-block ;
            color: ${props => props.theme.primary};
            font-weight: 500;
        }
    }
`
const AuthenticationPage = ({ children }) => {
    return (
        <AuthenticationPageStyle>
            <NavLink to="/">
                <img srcSet='/logo.png 2x' alt='monkey-blogging' className='logo'></img>
            </NavLink>
            <h1 className='heading'>Blogging</h1>
            {children}
        </AuthenticationPageStyle>
    );
};

export default AuthenticationPage;