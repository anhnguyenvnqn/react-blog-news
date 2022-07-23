
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import slugify from "slugify";
import { auth, db } from "../../../firebase-blog/firebase-config-blog";
import useFirebaseImage from "../../../hooks/useFirebaseImage";
import { userRole, userStatus } from "../../../utils/constants";
import { Button } from "../../button";
import { Radio } from "../../checkbox";
import { Field } from "../../field";
import FieldCheckboxes from "../../field/FieldCheckboxes";
import ImageUpload from "../../image/ImageUpload";
import { Input } from "../../input";
import { Label } from "../../label";
import DashboardHeading from "../dashboard/DashboardHeading";

const UserAddNew = () => {
  const { control, handleSubmit, setValue, watch, getValues, reset, formState: { isValid, isSubmitting }
  } = useForm({
    mode: "onChange",
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      username: "",
      avatar: "",
      status: userStatus.ACTIVE,
      role: userRole.USER,
      createdAt: new Date(),
    }
  });
  const {
    image,
    progress,
    handleSelectImage,
    handleDeleteImage,
    handleResetUploadImg,

  } = useFirebaseImage(setValue, getValues)
  const watchStatus = watch("status")
  const watchRole = watch("role")
  const handleCreateUser = async (values) => {
    if (!isValid) return
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password)
      const colRef = collection(db, "users");
      await addDoc(colRef, {
        fullname: values.fullname,
        email: values.email,
        password: values.password,
        username: slugify(values.username || values.fullname, { lower: true, trim: true, replacement: "" }),
        avatar: image,
        status: Number(values.status),
        role: Number(values.role),
        createdAt: serverTimestamp(),
      })
      toast.success(`Create new user with email:${values.email} successfully`)
      reset({
        fullname: "",
        email: "",
        password: "",
        username: "",
        avatar: "",
        status: userStatus.ACTIVE,
        role: userRole.USER,
        createdAt: new Date(),
      })
      handleResetUploadImg()
    } catch (error) {
      console.log(error);
      toast.error("Can not create new User")
    }
    console.log(values);
  }


  return (
    <div>
      <DashboardHeading
        title="New user"
        desc="Add new user to system"
      ></DashboardHeading>
      <form onSubmit={handleSubmit(handleCreateUser)}>
        <div className="w-[200px] h-[200px] rounded-full mx-auto mb-10">
          <ImageUpload className="!rounded-full h-full"
            onChange={handleSelectImage}
            handleDeleteImage={handleDeleteImage}
            progress={progress}
            image={image}
          ></ImageUpload>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Fullname</Label>
            <Input
              name="fullname"
              placeholder="Enter your fullname"
              control={control}
            ></Input>
          </Field>
          <Field>
            <Label>Username</Label>
            <Input
              name="username"
              placeholder="Enter your username"
              control={control}
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Email</Label>
            <Input
              name="email"
              placeholder="Enter your email"
              control={control}
              type="email"
            ></Input>
          </Field>
          <Field>
            <Label>Password</Label>
            <Input
              name="password"
              placeholder="Enter your password"
              control={control}
              type="password"
            ></Input>
          </Field>
        </div>

        <div className="form-layout">
          <Field>
            <Label>Status</Label>
            <FieldCheckboxes>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === userStatus.ACTIVE}
                value={userStatus.ACTIVE}
              >
                Active
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === userStatus.PENDING}
                value={userStatus.PENDING}
              >
                Pending
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === userStatus.BAN}
                value={userStatus.BAN}
              >
                Banned
              </Radio>
            </FieldCheckboxes>
          </Field>

          <Field>
            <Label>Role</Label>
            <FieldCheckboxes>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.ADMIN}
                value={userRole.ADMIN}
              >

                Admin
              </Radio>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.MODE}
                value={userRole.MODE}
              >
                Moderator
              </Radio>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.USER}
                value={userRole.USER}
              >
                User
              </Radio>
            </FieldCheckboxes>
          </Field>
        </div>
        <Button
          type="submit"
          kind="primary"
          className="mx-auto w-[200px]"
          isLoading={isSubmitting}
          disabled={isSubmitting}>
          Add new user
        </Button>
      </form>
    </div>
  );
};

export default UserAddNew;
