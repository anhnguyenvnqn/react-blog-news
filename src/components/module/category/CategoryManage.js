import React, { useState } from "react";
import DashboardHeading from "../dashboard/DashboardHeading";
import { debounce } from "lodash";
import { Button } from "../../button";
import CategoryTable from "./CategoryTable";

const CategoryManage = () => {
  const [filter, setFilter] = useState("");
  const handleInputFilter = debounce((e) => {
    setFilter(e.target.value);
  }, 500);

  return (
    <div>
      <DashboardHeading
        title="Categories"
        desc="Manage your category"
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
        <Button to="/manage/add-category" height="50px">Add new Category</Button>
      </div>
      <CategoryTable filter={filter}></CategoryTable>
    </div>
  );
};

export default CategoryManage;
