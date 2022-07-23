import LoadingSkeleton from "components/loading/LoadingSkeleton";
import React from "react";
import slugify from "slugify";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostImage from "./PostImage";
import PostMeta from "./PostMeta";
import PostTitle from "./PostTitle";

const PostNewestLargeStyles = styled.div`
  &:hover img {
    border: 2px solid ${(props) => props.theme.accent};
  }
  .post {
    &-image {
      display: block;
      height: 433px;
      margin-bottom: 16px;
      border-radius: 16px;
    }
    &-category {
      margin-bottom: 10px;
    }
    &-title {
      margin-bottom: 10px;
    }
  }
`;

const PostNewestLarge = ({ data }) => {
  if (!data) return null;
  const date = data?.createdAt?.seconds
    ? new Date(data?.createdAt?.seconds * 1000)
    : new Date();
  const fomatDate = new Date(date).toLocaleDateString("vi-VI");
  return (
    <PostNewestLargeStyles>
      <PostImage url={data.image} alt="" to={data.slug}></PostImage>

      <PostCategory classNamme="post-category" to={data.category?.slug}>
        {data.category?.name}
      </PostCategory>

      <PostTitle size="big">{data.title}</PostTitle>
      <PostMeta
        to={slugify(data.users?.username || "", { lower: true })}
        authorName={data.users?.fullname}
        date={fomatDate || ""}
      ></PostMeta>
    </PostNewestLargeStyles>
  );
};

export default PostNewestLarge;

export const PostNewestLargeSkeleton = () => {
  return (
    <PostNewestLargeStyles>
      <div className="post-image overflow-hidden">
        <LoadingSkeleton width="100%" height="100%"></LoadingSkeleton>
      </div>
      <div className="post-category">
        <LoadingSkeleton width="100px" height="16px"></LoadingSkeleton>
      </div>
      <div className="post-title">
        <LoadingSkeleton width="500px" height="22px"></LoadingSkeleton>
      </div>
      <LoadingSkeleton width="100px" height="16px"></LoadingSkeleton>
    </PostNewestLargeStyles>
  );
};
