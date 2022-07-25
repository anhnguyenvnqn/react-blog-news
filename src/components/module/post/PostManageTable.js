import { ActionDelete, ActionEdit, ActionView } from 'components/action';
import { Button } from 'components/button';
import { LabelStatus } from 'components/label';
import { Table } from 'components/table';
import { db } from 'firebase-blog/firebase-config-blog';
import { collection, deleteDoc, doc, getDocs, limit, onSnapshot, query, startAfter, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { userStatus } from 'utils/constants';

const POST_PER_PAGE = 10
const PostManageTable = ({filter}) => {
    const [postList, setPostList] = useState([])
  const [lastDoc, setLastDoc] = useState()
  const [total, setTotal] = useState(0)
  const navigate = useNavigate()
  useEffect(() => {
    async function fetchData() {
      const colRef = collection(db, "posts");
      const newRef = filter
        ? query(colRef, where("title", ">=", filter), where("title", "<=", filter + "utf8"))
        : query(colRef, limit(POST_PER_PAGE));
      const documentSnapshots = await getDocs(newRef);
      const lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];
        onSnapshot(colRef, snapshot => {
          setTotal(snapshot.size)
        })
      onSnapshot(newRef, snapshot => {
        let results = [];
        snapshot.forEach(doc => {
          results.push({
            id: doc.id,
            ...doc.data(),
          })
        })
        setPostList(results)
      })
      setLastDoc(lastVisible)
    }
    fetchData()
  }, [filter])

  const handleDeletePost = async (postId) => {
    const colRef = doc(db, "posts", postId)
    //khi ấn Del nên sd sweetAlert2 để cảnh báo
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(colRef)
        Swal.fire(
          'Deleted!',
          'Your post has been deleted.',
          'success'
        )
      }
    })

  }
  const renderLableStatus = (status) => {
    switch (status) {
      case userStatus.ACTIVE:
        return <LabelStatus type='success'>News</LabelStatus>
      case userStatus.PENDING:
        return <LabelStatus type='warning'>Pending</LabelStatus>
      case userStatus.BAN:
        return <LabelStatus type='danger'>Other</LabelStatus>

      default:
        break;
    }
  }

  const handleLoadmorePost = async () => {
    const nextRef = query(collection(db, "posts"),
      startAfter(lastDoc || 0),
      limit(POST_PER_PAGE));

    onSnapshot(nextRef, snapshot => {
      let results = [];
      snapshot.forEach(doc => {
        results.push({
          id: doc.id,
          ...doc.data(),
        })
      })
      setPostList([...postList, ...results])
    })
    const documentSnapshots = await getDocs(nextRef);
    // Get the last visible document
    const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastDoc(lastVisible)
  }

    return (
        <div>
            <Table>
        <thead>
          <tr>
            <th className="">Id</th>
            <th>Post</th>
            <th>Category</th>
            <th>Author</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {postList.length > 0 && postList.map(post => {
            const date = post?.createdAt?.seconds
              ? new Date(post?.createdAt?.seconds * 1000)
              : new Date()
            const fomatDate = new Date(date).toLocaleDateString("vi-VI")

            return (
              <tr key={post.id}>
                <td>{post.id?.slice(0, 5) + "..."}</td>
                <td>
                  <div className="flex items-center gap-x-3">
                    <img
                      src={post.image}
                      alt=""
                      className="w-[66px] h-[55px] rounded object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold max-w-[200px] whitespace-pre-wrap">{post.title}</h3>
                      <time className="text-sm text-gray-500">
                        Date: {fomatDate}
                      </time>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="text-gray-500">{post.category.name}</span>
                </td>
                <td>
                  <span className="text-gray-500">{post.users.username}</span>
                </td>
                <td>
                  {renderLableStatus(post.status)}
                </td>
                <td>
                  <div className="flex items-center gap-x-3">
                    <ActionView onClick={()=> navigate(`/${post.slug}`)}></ActionView>
                    <ActionEdit onClick={() => navigate(`/manage/update-posts?id=${post.id}`)}></ActionEdit>
                    <ActionDelete onClick={() => handleDeletePost(post.id)}></ActionDelete>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
      <div className="mt-10 text-center ">
      {total > postList.length && (
        <Button className="mx-auto w-[200px]"
        onClick={handleLoadmorePost}>
          See more+ {total - POST_PER_PAGE} post
        </Button>
      )}     
      </div>
        </div>
    );
};

export default PostManageTable;