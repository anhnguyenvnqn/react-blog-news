import React from 'react';
import { Link} from 'react-router-dom';
import styled from 'styled-components';


const PostImageStyle = styled.div`
img {
    width: 100%;
    height: 100%;
    border-radius: inherit;
  
}
`
const PostImage = ({ className = '', url = '', alt = '', to = '' }) => {
    //hình đôi khi cũng là 1 link
    if (to) return (
        <Link to={`/${to}`}>
            <PostImageStyle className={`post-image ${className}`}>
                <img src={url} alt={alt} loading="lazy"></img>
            </PostImageStyle>
        </Link>
    )
    return ( 
        <PostImageStyle className={`post-image ${className}`}>
            {/* Loading=lazy của chrome support, giúp cho ảnh ko load tất cả khi vào trang wed, tới hình nào thì load hình đó */}
            <img src={url} alt={alt} loading="lazy"></img>;
        </PostImageStyle>
    );
}; 

export default PostImage;