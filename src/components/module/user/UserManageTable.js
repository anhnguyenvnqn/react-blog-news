
import { deleteUser } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs, limit, onSnapshot, query, startAfter, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { db } from '../../../firebase-blog/firebase-config-blog';
import { userRole, userStatus } from '../../../utils/constants';
import { ActionDelete, ActionEdit, ActionView } from '../../action';
import { Button } from '../../button';
import { LabelStatus } from '../../label';
import { Table } from '../../table';


const USER_PER_PAGE = 4;
const UserManageTable = ({ filter }) => {
    const [userList, setUserList] = useState([])
    const [total, setTotal] = useState(0)
    const [lastDoc, setLastDoc] = useState()
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchData() {
            const colRef = collection(db, "users")
            const newRef = filter
                ? query(colRef, where("fullname", ">=", filter), where("fullname", "<=", filter + "utf8"))
                : query(colRef, limit(USER_PER_PAGE));
            const documentSnapshots = await getDocs(newRef);
            const lastVisible =
                documentSnapshots.docs[documentSnapshots.docs.length - 1];

            onSnapshot(colRef, snapshot => {
                setTotal(snapshot.size)
            })

            onSnapshot(newRef, snapshot => {
                const results = [];
                snapshot.forEach(doc => {
                    results.push({
                        id: doc.id,
                        ...doc.data(),
                    })
                })
                setUserList(results)
            })
            setLastDoc(lastVisible)

        }
        fetchData()
    }, [filter])

    const renderRoleLable = (role) => {
        switch (role) {
            case userRole.ADMIN:
                return "Admin"
            case userRole.MODE:
                return "Moderator"
            case userRole.USER:
                return "User"
            default:
                break;
        }
    }
    const renderLableStatus = (status) => {
        switch (status) {
            case userStatus.ACTIVE:
                return <LabelStatus type='success'>Active</LabelStatus>
            case userStatus.PENDING:
                return <LabelStatus type='warning'>Pending</LabelStatus>
            case userStatus.BAN:
                return <LabelStatus type='danger'>Rejected</LabelStatus>

            default:
                break;
        }
    }
    const handleDeleteUser = async (user) => {
        const colRef = doc(db, "users", user.id)
        
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
                await deleteUser(user)
                toast.success("Delete user successfully")
                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
            }
        })
    }
    const renderUserItem = (user) => {
        return (
            <tr key={user.id}>
                <td>{user.id.slice(0, 5) + "..."}</td>
                

                <td className='whitespace-nowrap'>
                    <div className='flex items-center gap-x-3'>
                        <img
                            src={user?.avatar}
                            className='w-10 h-10 object-cover rounded-md flex-shrink-0'
                            alt='' />
                        <div className='flex-1'>
                            <h3> {user?.fullname}</h3>
                            <time className='text-sm text-gray-300'>{new Date(user?.createdAt?.seconds * 1000).toLocaleDateString('vi-VI')}</time>
                        </div>
                    </div>
                </td>
                <td>{user?.email}</td>
                <td>{renderLableStatus(Number(user?.status))}</td>
                <td>{renderRoleLable(Number(user?.role))}</td>
                <td>
                    <div className="flex items-center gap-x-3">
                        <ActionView onClick={()=> navigate(`/author/${user.username}`)} ></ActionView>
                        <ActionEdit onClick={() => navigate(`/manage/update-user?id=${user.id}`)}></ActionEdit>
                        <ActionDelete onClick={() => handleDeleteUser(user)} ></ActionDelete>
                    </div>
                </td>
            </tr>
        )
    }
    const handleLoadmoreUser = async () => {
        const nextRef = query(collection(db, "users"),
          startAfter(lastDoc || 0),
          limit(USER_PER_PAGE));
    
        onSnapshot(nextRef, snapshot => {
          let results = [];
          snapshot.forEach(doc => {
            results.push({
              id: doc.id,
              ...doc.data(),
            })
          })
          setUserList([...userList, ...results])
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
                        <th>Id</th>     
                        <th>Info</th>
                        <th>Email address</th>
                        <th>Status</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {userList.length > 0 && userList.map(user => renderUserItem(user))}
                </tbody>
            </Table>
            {total > userList.length && (
        <div className="mt-10">
          <Button
            onClick={handleLoadmoreUser}
            className=""
          >Load more
          </Button>
          
        </div>
      )}
        </div>
    );
};

export default UserManageTable;

