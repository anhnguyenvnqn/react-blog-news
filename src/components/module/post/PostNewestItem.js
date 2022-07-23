import LoadingSkeleton from "components/loading/LoadingSkeleton";
import React from "react";
import slugify from "slugify";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostImage from "./PostImage";
import PostMeta from "./PostMeta";
import PostTitle from "./PostTitle";
const PostNewestItemStyles = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 28px;
  padding-bottom: 28px;
  border-bottom: 1px solid #ccc;
  &:hover img {
        border: 2px solid ${props => props.theme.purple};;;
    }
  &:last-child {
    padding-bottom: 0;
    margin-bottom: 0;
    border-bottom: 0;
  }
  .post {
    &-image {
      display: block;
      width: 180px;
      height: 130px;
      border-radius: 12px;
      flex-shrink: 0;
    }
    &-category {
      margin-bottom: 8px;
    }
    &-title {
      margin-bottom: 8px;
    }
  }
`;
const PostNewestItem = ({ data }) => {
  if (!data) return null
  const date = data?.createdAt?.seconds
    ? new Date(data?.createdAt?.seconds * 1000)
    : new Date()
  const fomatDate = new Date(date).toLocaleDateString("vi-VI")

  return (
    <PostNewestItemStyles>
      <PostImage
        url={data.image}
        alt=""
        to={data.slug}
      ></PostImage>

      <div className="post-content">
        <PostCategory
          classNamme="post-category"
          type="secondary"
          to={data.category?.slug}

        >{data.category?.name}</PostCategory>

        <PostTitle>{data.title} </PostTitle>
        
        <PostMeta
          to={slugify(data.users?.username || "", { lower: true })}
          authorName={data.users?.fullname}
          date={fomatDate || ''}
        ></PostMeta>
      </div>
    </PostNewestItemStyles>
  );
};

export default PostNewestItem;
export const PostNewestItemSkeleton = () => {
  return (
    <PostNewestItemStyles>
      <div className="post-image overflow-hidden">
        <LoadingSkeleton width="100%" height="100%" borderRadius="16px"></LoadingSkeleton>
      </div>
      <div className="post-content">
        <div className="post-category">
          <LoadingSkeleton width="100px" height="14px" ></LoadingSkeleton>
        </div>
        <div className="post-title">
          <LoadingSkeleton width="300px" height="28px"></LoadingSkeleton>
        </div>
        <LoadingSkeleton width="200px" height="14px"></LoadingSkeleton>
      </div>
    </PostNewestItemStyles>

    
  );
};
