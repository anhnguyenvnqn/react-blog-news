import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';


const NotFoundPageStyles = styled.div`
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .logo {
        display: inline-block;
        margin-bottom: 40px;

    }
    .heading {
        font-size: 60px;
        font-weight: bold;
        margin-bottom: 40px;
    }
    .back {
        display: inline-block;
        color: white;
        padding: 15px 30px;
        border-radius: 8px;
        font-weight: 500;
        background-color: ${props => props.theme.primary};;
    }
`
const NotFoundPage = () => {
    return (
        <NotFoundPageStyles>
            <NavLink to="/" className={"logo"}>
                <img srcSet='../logo.png' alt='monkey-blogging'></img> 
            </NavLink>
            <h1 className='heading'>Oops ! Page not found</h1>
            <NavLink to="/" className={"back"}>Back to home</NavLink>
        </NotFoundPageStyles>
    );
};

export default NotFoundPage;