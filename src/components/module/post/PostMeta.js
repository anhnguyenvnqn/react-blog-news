import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const PostMetaStyle = styled.div`
    display: flex;
    align-items: center;
    margin-left: auto;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
    color: inherit;
    opacity: 0.5;
    
    .meta_dot{
    width: 4px;
    height: 4px;
    border-radius: 50%;
    display: inline-block;
    background-color: currentColor;
    }
    
`
const PostMeta = ({date = '',authorName = 'Andiez Le', className='', to='/'}) => {
    return (
        <PostMetaStyle className={className}>
            <span className="meta_time">{date}</span>
            <span className="meta_dot"></span>
            <Link to={`/author/${to}`}>
            <span className="meta_author">{authorName}</span>
            </Link>
        </PostMetaStyle>
    );
};

export default PostMeta;