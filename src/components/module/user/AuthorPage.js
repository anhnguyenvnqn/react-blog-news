import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase-blog/firebase-config-blog";
import Heading from "../../layout/Heading";
import Layout from "../../layout/Layout";
import PostItem, { PostItemSkeleton } from "../post/PostItem";

const AuthorPage = () => {
  const params = useParams();
  const [user, setUser] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const docRef = query(
        collection(db, "posts"),
        where("users.username", "==", params.slug)
      );
      onSnapshot(docRef, (snapshot) => {
        const results = [];
        snapshot.forEach((doc) => {
          results.push({
            id: doc.id,
            ...doc.data(),
          });
          setUser(results);
        });
      });
    }
    fetchData();
  }, [params.slug]);

  useEffect(() => {
    async function fetchData() {
      const colRef = collection(db, "users");
      const q = query(colRef, where("username", "==", params.slug));
      const querySnapshot = await getDocs(q);
      let result = [];
      querySnapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setUserInfo(result);
    }
    fetchData();
  }, []);
  if (user.length < 0) return null;
  return (
    <Layout>
      <div className="container">
      {user.length === 0 && (
          <div className="grid-layout grid-layout--primary">
            <PostItemSkeleton></PostItemSkeleton>
           <PostItemSkeleton></PostItemSkeleton>
           <PostItemSkeleton></PostItemSkeleton>
          </div>
        )}
        {userInfo.map((item) => (
          <Heading>{item.fullname}</Heading>
        ))}
        <div className="grid-layout grid-layout--primary">
          {user.map((item) => (
            <PostItem key={item.id} data={item}></PostItem>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AuthorPage;
