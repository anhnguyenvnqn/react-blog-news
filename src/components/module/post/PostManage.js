
import { collection, deleteDoc, doc, getDocs, limit, onSnapshot, query, startAfter, where } from "firebase/firestore";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../../context/auth-context";
import { db } from "../../../firebase-blog/firebase-config-blog";
import { userStatus } from "../../../utils/constants";
import { ActionDelete, ActionEdit, ActionView } from "../../action";
import { Button } from "../../button";
import { Dropdown } from "../../dropdown";
import { LabelStatus } from "../../label";
import { Table } from "../../table";
import DashboardHeading from "../dashboard/DashboardHeading";

const POST_PER_PAGE = 10
const PostManage = () => {
  const [postList, setPostList] = useState([])
  const [lastDoc, setLastDoc] = useState()
  const [filter, setFilter] = useState("")
  const [total, setTotal] = useState(0)
  const navigate = useNavigate()

  console.log(postList);
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
  const handleSeachPost = debounce((e) => {
    setFilter(e.target.value)
  }, 500)
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
      <DashboardHeading
        title="All posts"
        desc="Manage all posts"
      ></DashboardHeading>
      <div className="mb-10 flex justify-end gap-5">
        <div className="w-full max-w-[200px]">
          <Dropdown>
            <Dropdown.Select placeholder="Category"></Dropdown.Select>
          </Dropdown>
        </div>
        <div className="w-full max-w-[300px]">
          <input
            type="text"
            className="w-full p-4 rounded-lg border border-solid border-gray-300"
            placeholder="Search post..."
            onChange={handleSeachPost}
          />
        </div>
      </div>
      <Table>
        <thead>
          <tr>

            <th>Id</th>
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

export default PostManage;
