import { debounce } from "lodash";
import React, { useState } from "react";
import { useAuth } from "../../../context/auth-context";
import { userRole } from "../../../utils/constants";
import { Button } from "../../button";
import DashboardHeading from "../dashboard/DashboardHeading";
import UserManageTable from "./UserManageTable";

const UserManage = () => {
  const [filter, setFilter] = useState(undefined);
  const handleInputFilter = debounce((e) => {
    setFilter(e.target.value);
  }, 500);
  //Nếu user ko phải admin thì ko vào đc
  const { userInfo } = useAuth();
  if (userInfo.role !== userRole.ADMIN) return null;

  return (
    <div>
      <DashboardHeading
        title="Users"
        desc="Manage your user"
      ></DashboardHeading>
      <div className="flex justify-between mb-5">
        <div className="w-full max-w-[300px] mb-10 flex justify-end">
          <input
            type="text"
            className="w-full p-4 rounded-lg border border-solid border-gray-300"
            placeholder="Search post..."
            onChange={handleInputFilter}
          />
        </div>
        <Button to="/manage/add-user" height="50px">Add new User</Button>
      </div>
      <UserManageTable filter={filter}></UserManageTable>
    </div>
  );
};

export default UserManage;
