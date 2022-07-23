
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Layout from "../components/layout/Layout";
import PostCategory from "../components/module/post/PostCategory";
import PostImage from "../components/module/post/PostImage";
import PostMeta from "../components/module/post/PostMeta";
import { db } from "../firebase-blog/firebase-config-blog";
import NotFoundPage from "./NotFoundPage";

import parse from 'html-react-parser';
import Author from "../components/author/Author";
import PostRelative from "../components/module/post/PostRelative";
import slugify from "slugify";
const PostDetailsPageStyles = styled.div`
  padding-bottom: 100px;
  
  .post {
    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 40px;
      margin: 40px 0;
    }
    &-feature {
      width: 100%;
      max-width: 640px;
      height: 466px;
      border-radius: 20px;
    }
    &-heading {
      font-weight: bold;
      font-size: 36px;
      margin-bottom: 16px;
      color: ${props => props.theme.green23B};
    }
    
    &-info {
      flex: 1;
    }
    &-content {
      max-width: 700px;
      margin: 80px auto;
    }
  }

  .author {
    margin-top: 40px;
    margin-bottom: 80px;
    display: flex;
    border-radius: 20px;
    background-color: ${(props) => props.theme.grayF3};
    height: 200px;
    overflow: hidden;
    &-image {
      width: 200px;
      height: 100%;
      flex-shrink: 0;
      border-radius: inherit;
    }
    &-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
    }
    &-content {
      flex: 1;
      padding: 20px;
    }
    &-name {
      font-weight: bold;
      margin-bottom: 10px;
      font-size: 20px;
      color: ${props => props.theme.green23B};

    }
    &-desc {
      font-size: 14px;
      line-height: 2;
    }
  }
  @media screen and (max-width: 1023.98px) {
    padding-bottom: 40px;
    .post {
      &-header {
        flex-direction: column;
      }
      &-feature {
        height: auto;
      }
      &-heading {
        font-size: 26px;
      }
      &-content {
        margin: 40px 0;
      }
    }
    .author {
      flex-direction: column;
      &-image {
        width: 100%;
        height: auto;
      }
    }
  }
`;

const PostDetailsPage = () => {
  const { slug } = useParams()
  const [postInfo, setPostInfo] = useState({})
 
  const date = postInfo?.createdAt?.seconds
  ? new Date(postInfo?.createdAt?.seconds * 1000)
  : new Date()
const fomatDate = new Date(date).toLocaleDateString("vi-VI")

  useEffect(() => {
    async function fetchData() {
      if (!slug) return
      const colRef = query(collection(db, "posts"), where("slug", "==", slug))
      onSnapshot(colRef, snapshot => {
        snapshot.forEach(doc => {
          //nếu có doc.data thì set
          doc.data() && setPostInfo(doc.data())
        })
      })
    }
    fetchData()
  }, [slug])

  //khi click bào bài viết liên quan chạy lên trên
  useEffect(() => {
    document.body.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [slug])

  if (!slug) return <NotFoundPage></NotFoundPage>
  if (!postInfo.title) return null
  const { users } = postInfo


  return (
    <PostDetailsPageStyles>
      <Layout>
        <div className="container">
          <div className="post-header">
            <PostImage
              url={postInfo.image}
              className="post-feature"
            ></PostImage>
            <div className="post-info">
              <PostCategory
                to={postInfo.category?.slug}
                className="mb-6"
              >
                {postInfo.category?.name}
              </PostCategory>
              <h1 className="post-heading">
                {postInfo.title}
              </h1>
              <PostMeta
                to={slugify(postInfo.users?.fullname || "", { lower: true })}
                authorName={postInfo.users?.fullname}
                date={fomatDate || ''}
              ></PostMeta>
            </div>
          </div>

          <div className="post-content">
            <div className="entry-content"> {parse(postInfo.content || "")}
            </div>
            <Author userId={users.id}></Author>
          </div>
          <PostRelative categoryId={postInfo.category?.id}></PostRelative>
        </div>
      </Layout>
    </PostDetailsPageStyles>
  );
};

export default PostDetailsPage;
