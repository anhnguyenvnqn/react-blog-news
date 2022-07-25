import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase-blog/firebase-config-blog";
import { v4 } from "uuid";
import Heading from "../../layout/Heading";
import PostNewestItem, { PostNewestItemSkeleton } from "../post/PostNewestItem";
import PostNewestLarge, {
  PostNewestLargeSkeleton,
} from "../post/PostNewestLarge";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { postStatus } from "utils/constants";

const HomeNewestStyles = styled.div`
  .layout {
    display: grid;
    align-items: start;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-gap: 28px;
    @media screen and (max-width: 768px) {
      grid-template-columns:1fr;
  }
  }
  .sidebar {
    padding: 28px 20px;
    border-radius: 16px;
    background-color: #f3edff;
  }
`;

const HomeNewest = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const colRef = collection(db, "posts");
    const querys = query(
      colRef,
      where("status", "==", postStatus.NEW),
      limit(4)
    );
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
  const [first, ...other] = posts;

  if (posts.length < 0) return null;
  return (
    <HomeNewestStyles className="home-block">
      <div className="container">
        <Heading>Tin tức mới nhất</Heading>
        {posts.length === 0 && (
          <div className="layout">
            <PostNewestLargeSkeleton></PostNewestLargeSkeleton>
            <div className="sidebar">
              <PostNewestItemSkeleton></PostNewestItemSkeleton>
              <PostNewestItemSkeleton></PostNewestItemSkeleton>
              <PostNewestItemSkeleton></PostNewestItemSkeleton>
            </div>
          </div>
        )}
        {posts.length > 0 && (
          <div className="layout">
            <PostNewestLarge data={first}></PostNewestLarge>
            <div className="sidebar">
              {other.length > 0 &&
                other.map((post) => (
                  <PostNewestItem data={post} key={v4()}></PostNewestItem>
                ))}
            </div>
          </div>
        )}
      </div>
    </HomeNewestStyles>
  );
};

export default HomeNewest;
