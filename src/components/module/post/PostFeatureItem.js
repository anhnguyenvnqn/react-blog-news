import PostCategory from "./PostCategory";
import PostImage from "./PostImage";
import PostMeta from "./PostMeta";
import PostTitle from "./PostTitle";
import React from "react";
import slugify from "slugify";
import styled from "styled-components";
import LoadingSkeleton from "components/loading/LoadingSkeleton";

const PostFeatureItemStyles = styled.div`
  width: 100%;
  border-radius: 16px;
  position: relative;
  &:hover img {
    border: 2px solid ${(props) => props.theme.purple};
  }
  .post {
    &-image {
      width: 100%;
      height: 100%;
      border-radius: 16px;
      
    }
    &-overlay {
      position: absolute;
      inset: 0;
      border-radius: 16px;
      opacity: 0.6;
      background: linear-gradient(
        179.77deg,
        #6b6b6b 36.45%,
        rgba(163, 163, 163, 0.622265) 63.98%,
        rgba(255, 255, 255, 0) 99.8%
      );
      mix-blend-mode: multiply;
    }
    &-content {
      padding: 20px;
      color: white;
      position: absolute;
      inset: 0;
      z-index: 10;
    }
    &-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
  }
  @media screen and (min-width: 1024px) {
    height: 272px;
  }
`;

const PostFeatureItem = ({ data }) => {
  
  if (!data || !data.id) return null;
  const date = new Date(data?.createdAt?.seconds * 1000);
  const fomatDate = new Date(date).toLocaleDateString("vi-VI");
  const { category, users } = data;
  
  return (
    <PostFeatureItemStyles>
    
          <PostImage
            url={data.image}
            alt="unsplash"
            to={category.slug}
          ></PostImage>
          {/* dùng overlay để trường hợp hình trắng chữ vẫn nổi lên  */}
          <div className="post-overlay"></div>
          <div className="post-content">
            <div className="post-top">
              {category?.name && (
                <PostCategory to={category.slug}>{category?.name}</PostCategory>
              )}
              <PostMeta
                to={slugify(users?.username || "", { lower: true })}
                authorName={users?.fullname}
                date={fomatDate || ""}
              ></PostMeta>
            </div>
            <PostTitle to={data.slug} size="big">
              {data.title}
            </PostTitle>
          </div>
        
  
    </PostFeatureItemStyles>
  );
};

export default PostFeatureItem;
export const PostFeatureItemSkeleton = () => {
  return (
    <PostFeatureItemStyles>
      <div className="post-image overflow-hidden">
        <LoadingSkeleton width="100%" height="100%" borderRadius="16px"></LoadingSkeleton>
      </div>
      <div className="post-content">
        <div className="post-top">
          <LoadingSkeleton width="40px" height="14px" ></LoadingSkeleton>
          <LoadingSkeleton width="100px" height="14px"></LoadingSkeleton>
        </div>
        <LoadingSkeleton width="200px" height="14px"></LoadingSkeleton>
      </div>
    </PostFeatureItemStyles>

    
  );
};
