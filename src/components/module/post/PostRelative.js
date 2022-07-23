import { async } from '@firebase/util';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase-blog/firebase-config-blog';
import Heading from '../../layout/Heading';
import PostItem from './PostItem';

const PostRelative = ({categoryId}) => {
    const [post,setPost] = useState([])
useEffect(()=> {
    async function fetchData () {
        const docRef = query(collection(db,"posts"), where("category.id", "==", categoryId))
        onSnapshot(docRef,snapshot => {
            const results = [];
            snapshot.forEach(doc => {
                results.push({
                    id: doc.id,
                    ...doc.data()
                })
            })
            setPost(results)
        })
    }
    fetchData()
},[categoryId])

    if(!categoryId || post.length < 0) return null
    return (
        <div className="post-related">
            <Heading>Bài viết liên quan</Heading>
            <div className="grid-layout grid-layout--primary">
            {post.map(item=> (
              <PostItem key={item.id} data={item}></PostItem>
            ))}
              
            </div>
          </div>
    );
};

export default PostRelative;