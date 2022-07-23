import { async } from "@firebase/util";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { values } from "lodash";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import slugify from "slugify";
import { db } from "../../../firebase-blog/firebase-config-blog";
import { categoryStatus } from "../../../utils/constants";
import { Button } from "../../button";
import { Radio } from "../../checkbox";
import { Field, FieldCheckboxes } from "../../field";

import { Input } from "../../input";
import { Label } from "../../label";
import DashboardHeading from "../dashboard/DashboardHeading";

const CategoryAddNew = () => {
  const {
    control,
    watch,
    handleSubmit,
    reset,
    formState: {isValid,isSubmitting}
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      slug: "",
      status: 1,
      createAt: new Date(),
    }
  });
  const watchStatus = watch("status")


  const handleAddNewCategory = async (values) => {
    if(!isValid) return
    const newValues = { ...values }
    newValues.slug = slugify(newValues.name || newValues.slug, { lower: true })
    newValues.status = Number(newValues.status)

    const colRef = collection(db,"categories")
    try {
      await addDoc(colRef, {
        ...newValues,
        createAt: serverTimestamp(),
      })
      toast.success("Create new category successfully")
   
    } catch (error) {
      toast.error(error.mesage)
    } finally {
      reset ({
        name: "",
        slug: "",
        status: 1,
        createAt: new Date(),
      })
    }
    
    console.log(newValues);
  }

  return (
    <div>
      <DashboardHeading
        title="New category"
        desc="Add new category"
      ></DashboardHeading>
      <form onSubmit={handleSubmit(handleAddNewCategory)} autoComplete="off">
        <div className="form-layout">
          <Field>
            <Label htmlFor="name">Name</Label>
            <Input
              control={control}
              name="name"
              placeholder="Enter your category name"
              required
            ></Input>
          </Field>
          <Field>
            <Label htmlFor="slug">Slug</Label>
            <Input
              control={control}
              name="slug"
              placeholder="Enter your slug"
            ></Input>
          </Field>
        </div>
        <Field>
          <Label>Status</Label>
          <FieldCheckboxes>
            <Radio
              name="status"
              control={control}
              checked={Number(watchStatus) === categoryStatus.APPROVED}
              value={categoryStatus.APPROVED}
            >
              Approved
            </Radio>
            <Radio
              name="status"
              control={control}
              checked={Number(watchStatus) === categoryStatus.UNAPPROVED}
              value={categoryStatus.UNAPPROVED}
            >
              Unapproved
            </Radio>
          </FieldCheckboxes>
        </Field>

        <Button
          type="submit"
          kind="primary"
          width="200px"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          >
          Add new category
        </Button>
      </form>
    </div>
  );
};

export default CategoryAddNew;
