import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { postStatus } from "utils/constants";
import { v4 } from "uuid";
import { db } from "../../../firebase-blog/firebase-config-blog";
import Heading from "../../layout/Heading";
import PostItem, { PostItemSkeleton } from "../post/PostItem";

const HomeListStyle = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 16px;
  @media screen and (max-width: 1024px) {
    grid-template-columns:1fr 1fr;
    gap:28px;
      }
 
`;

const HomeList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const colRef = collection(db, "posts");
    const querys = query(colRef, where("status", "==", postStatus.OTHER), limit(4));
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
    <div className="container">
     <Heading>Tin tức khác </Heading>
      <HomeListStyle>
        {posts.length === 0 && 
        <>
          <PostItemSkeleton></PostItemSkeleton>
          <PostItemSkeleton></PostItemSkeleton>
          <PostItemSkeleton></PostItemSkeleton>
          <PostItemSkeleton></PostItemSkeleton>
        </>
        }
        {posts.length > 0 &&
          posts.map((post) => <PostItem data={post} key={v4()}></PostItem>)}
      </HomeListStyle>
    </div>
  );
};

export default HomeList;
