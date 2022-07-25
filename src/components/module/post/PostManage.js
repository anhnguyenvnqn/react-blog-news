import { debounce } from "lodash";
import React, { useState } from "react";
import { Dropdown } from "../../dropdown";
import DashboardHeading from "../dashboard/DashboardHeading";
import PostManageTable from "./PostManageTable";

const PostManage = () => {
  const [filter, setFilter] = useState("");
  const handleSeachPost = debounce((e) => {
    setFilter(e.target.value);
  }, 500);
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
      <PostManageTable filter={filter}></PostManageTable>
    </div>
  );
};

export default PostManage;
