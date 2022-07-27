import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../../../firebase-blog/firebase-config-blog";
import Heading from "../../layout/Heading";
import PostFeatureItem, { PostFeatureItemSkeleton } from "../post/PostFeatureItem";

const HomeFeatureStyles = styled.div`
  margin-top: 20px;
`;

const HomeFeature = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const colRef = collection(db, "posts");
    const querys = query(colRef, where("hot", "==", true), limit(4));
    onSnapshot(querys, (snapshot) => {
      const results = [];
      snapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setPosts(results);
    });
  }, []);

  if (posts.length < 0) return null;
  return (
    <HomeFeatureStyles className="home-block">
      <div className="container">
        <Heading>Bài viết nổi bật</Heading>   
        {posts.length === 0 &&
        <div className="grid-layout">
          <PostFeatureItemSkeleton></PostFeatureItemSkeleton>
          <PostFeatureItemSkeleton></PostFeatureItemSkeleton>
          <PostFeatureItemSkeleton></PostFeatureItemSkeleton>
        </div>
        }

        <div className="grid-layout">
          {posts.map((post) => (
            <PostFeatureItem key={post.id} data={post}></PostFeatureItem>
          ))}
        </div>
      </div>
    </HomeFeatureStyles>
  );
};

export default HomeFeature;
