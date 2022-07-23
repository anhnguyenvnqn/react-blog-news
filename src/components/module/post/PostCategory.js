import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';

const PostCategoryStyle = styled.div`
    display: inline-block;
    padding: 4px 10px;
    border-radius: 10px;
    color: #6b6b6b;
    font-size: 14px;
    font-weight: 600;
    a{
        display: inline-block;
    }
    white-space: nowrap;

    ${props => props.type === "primary" && css`
    background-color: ${props => props.theme.grayF3};
    `};
    ${props => props.type === "secondary" && css`
    background-color: white;
    `};
    
    text-overflow: ellipsis;
    max-width: max-content;
`
const PostCategory = ({ children, type = "primary", classNamme = "", to = '' }) => {
    return (
        <PostCategoryStyle type={type} className={classNamme}>
            <Link to={`/category/${to}`}>
                {children}
            </Link>
        </PostCategoryStyle>
    );
};

export default PostCategory;