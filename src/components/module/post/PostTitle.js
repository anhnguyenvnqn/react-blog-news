import React from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

const PostTitleStyles = styled.h3`
    font-weight: 600;
    line-height: 1.5;
    position: relative;
    
    a{
        display: block;
        
    }
    ${props => props.size === "nomal" && css`
        font-size: 16px;
    `};
    ${props => props.size === "big" && css`
        font-size: 18px; 
    `};
`
const PostTitle = ({ children, className = '', size = 'nomal', to='' }) => {
    return (
        <PostTitleStyles className={`post-title ${className}`} size={size}>
            <Link to={`/${to}`}>
                {children}
            </Link>
        </PostTitleStyles>
    );
};

export default PostTitle;