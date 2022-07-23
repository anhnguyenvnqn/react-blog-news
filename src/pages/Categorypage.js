import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Heading from "../components/layout/Heading";
import Layout from "../components/layout/Layout";
import PostItem, { PostItemSkeleton } from "../components/module/post/PostItem";
import { db } from "../firebase-blog/firebase-config-blog";

const Categorypage = () => {
  const params = useParams();
  const [category, setCategory] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const docRef = query(
        collection(db, "posts"),
        where("category.slug", "==", params.slug)
      );
      onSnapshot(docRef, (snapshot) => {
        const results = [];
        snapshot.forEach((doc) => {
          results.push({
            id: doc.id,
            ...doc.data(),
          });
          setCategory(results);
        });
      });
    }
    fetchData();
  }, [params.slug]);
  useEffect(() => {
    async function fetchData() {
      const colRef = collection(db, "categories");
      const q = query(colRef, where("slug", "==", params.slug));
      const querySnapshot = await getDocs(q);
      let result = [];
      querySnapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setCategoryInfo(result);
    }
    fetchData();
  }, []);

  if (category.length < 0) return null;
  return (
    <Layout>
      <div className="container">
        {category.length === 0 && (
          <div className="grid-layout grid-layout--primary">
            <PostItemSkeleton></PostItemSkeleton>
           <PostItemSkeleton></PostItemSkeleton>
           <PostItemSkeleton></PostItemSkeleton>
          </div>
        )}

        {categoryInfo.map((item) => (
          <Heading> {item?.name}</Heading>
        ))}
        <div className="grid-layout grid-layout--primary">
          {category.map((item) => (
            <PostItem key={item.id} data={item}></PostItem>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Categorypage;
