import LoadingSkeleton from "components/loading/LoadingSkeleton";
import React from "react";
import slugify from "slugify";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostImage from "./PostImage";
import PostMeta from "./PostMeta";
import PostTitle from "./PostTitle";

const PostItemStyles = styled.div`
  display: flex;
  flex-direction: column;
 
  .post {
    &-image {
      height: 202px;
      margin-bottom: 20px;
      display: block;
      width: 100%;
      border-radius: 16px;
    }
    &-decs {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    } 
  }
  .post-decs-title {
    flex: 1;
    margin: 8px 0;
    padding: 0 8px;
  }
  &:hover img {
        border: 2px solid ${props => props.theme.purple};;;
    }
`;

const PostItem = ({ data }) => {
  if (!data) return null;
  const date = data?.createdAt?.seconds
    ? new Date(data?.createdAt?.seconds * 1000)
    : new Date();
  const fomatDate = new Date(date).toLocaleDateString("vi-VI");
  return (
    <PostItemStyles>
      <div className="post-image">
        <PostImage url={data.image} alt="" to={data?.slug}></PostImage>
      </div>
      <div className="post-decs">
        <PostCategory to={data.category?.slug}>
          {data.category?.name}
        </PostCategory>
        <div className="post-decs-title">
          <PostTitle to={data.slug}>{data.title}</PostTitle>
        </div>
        <PostMeta
          to={slugify(data.users?.username || "", { lower: true })}
          authorName={data.users?.fullname}
          date={fomatDate || ""}
        ></PostMeta>
      </div>
    </PostItemStyles>
  );
};

export default PostItem;
export const PostItemSkeleton = ()=> {
  return (
    <PostItemStyles>
       <div className="post-image overflow-hidden">
        <LoadingSkeleton width="100%" height="100%"></LoadingSkeleton>
      </div>
      <div className="post-decs">
       <LoadingSkeleton width="100px" height="14px"></LoadingSkeleton>
        <div className="post-decs-title">
        <LoadingSkeleton width="200px" height="14px"></LoadingSkeleton>
        </div>
        <LoadingSkeleton width="150px" height="14px"></LoadingSkeleton>
      </div>
    </PostItemStyles>
  )
}