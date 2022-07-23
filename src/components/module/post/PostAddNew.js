import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";

import { Field } from "../../field";
import { Label } from "../../label";
import { Input } from "../../input";
import FieldCheckboxes from "../../field/FieldCheckboxes";
import { Radio } from "../../checkbox";
import { Button } from "../../button";
import { postStatus } from "../../../utils/constants";
import DashboardHeading from "../dashboard/DashboardHeading";
import ImageUpload from "../../image/ImageUpload";
import Toggle from "../../toggle/Toggle";
import useFirebaseImage from "../../../hooks/useFirebaseImage";
import {  addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "../../../firebase-blog/firebase-config-blog";
import { result } from "lodash";
import { Dropdown } from "../../dropdown";
import { useAuth } from "../../../context/auth-context";
import { toast } from "react-toastify";

const PostAddNew = () => {
  const {userInfo} = useAuth()
  const { control, watch, setValue, handleSubmit, getValues,reset } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      slug: "",
      image: "" ,
      status: 2,
      hot: false,    
      category: {},
      user: {}
    },
  });

  const watchStatus = watch("status");
  const watchHot = watch("hot");
  
  const {
    image,
    progress,
    handleSelectImage,
    handleDeleteImage,
    handleUploadImage,
    handleResetUploadImg,

  } = useFirebaseImage(setValue, getValues)

  const [categories, setCategories] = useState([])
  const [selectCategory, setSelectCategory] = useState("")
  const [loading,setLoading] = useState(false)

  useEffect(()=> {
    async function fetchUserData () {
      if(!userInfo.email) return
      const q = query(collection(db,"users"), where("email", "==", userInfo.email))
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach(doc => {
        setValue("users", {
          id:doc.id,
          //lấy hết tất cả
          ...doc.data()
        })
      })
    }
    fetchUserData()
  
  },[userInfo.email])

  const addPostHandle = async (values) => {
    setLoading(true)
    const cloneValues = { ...values }
    cloneValues.slug = slugify(values.slug || values.title, {lower:true})
    cloneValues.status = Number(values.status)
    // handleUploadImage(cloneValues.image)
    const colRef = collection(db,"posts")
    console.log(cloneValues);
    await addDoc(colRef, {
      ...cloneValues,
      image,
      createdAt: serverTimestamp(),
    })
    toast.success("Successfully!")
    reset({
      title: "",
      slug: "",
      image: "" ,
      status: 2,
      hot: false,   
      category: {},
      user: {}

    })
    handleResetUploadImg()
    setSelectCategory({})
    setLoading(false)
  }

  const handleClickOption = async(item) => {
    const colRef = doc(db,"categories", item.id)
    const docData = await getDoc(colRef)
    setValue("category", {
      id: docData.id,
      ...docData.data()
    })
    setSelectCategory(item)
  }

  useEffect(() => {
    async function getData() {
      const colRef = collection(db, "categories");
      const q = query(colRef, where("status", "==", 1));
      const querySnapshot = await getDocs(q);
      result = []
      querySnapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        })
      });
      setCategories(result)
    }
    getData()
  }, [])
  
  useEffect(()=> {
    document.title = " Blogging - Add new post "
  })

  return (
    <>
      <DashboardHeading title="Add post" desc="Add new post"></DashboardHeading>
      <form onSubmit={handleSubmit(addPostHandle)}>
        <div className="form-layout">
          <Field>
            <Label htmlFor="title">Title</Label>
            <Input
              control={control}
              placeholder="Enter your title"
              name="title"
              required
            ></Input>
          </Field>
          <Field>
            <Label htmlFor="slug">Slug</Label>
            <Input
              control={control}
              placeholder="Enter your slug"
              name="slug"
            ></Input>
          </Field>
        </div>

        <div className="form-layout">
          <Field>
            <Label>Image</Label>
            <ImageUpload
              onChange={handleSelectImage}
              className="h-[250px]"
              handleDeleteImage={handleDeleteImage}
              progress={progress}
              image={image}
              ></ImageUpload>
          </Field>
        </div>

        <div className="form-layout">
          <Field>
            <Label>Feature post</Label>
            <Toggle on={watchHot === true}
              onClick={() => setValue("hot", !watchHot)} ></Toggle>
          </Field>

          <Field>
            <Label>Status</Label>
            <FieldCheckboxes>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.NEW}
                value={postStatus.NEW}
              >
                News
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.PENDING}
                value={postStatus.PENDING}
              >
                Pending
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.OTHER}
                value={postStatus.OTHER}
              >
                Other
              </Radio>
            </FieldCheckboxes>
          </Field>

          <Field>
            <Label>Category</Label>
            <Dropdown> 
              <Dropdown.Select placeholder={`${selectCategory.name || "Select category "}`}></Dropdown.Select>
              <Dropdown.List>
                {categories.length > 0 && categories.map((item) =>
                  <Dropdown.Option key={item.id} onClick={()=> handleClickOption(item)}>{item.name}</Dropdown.Option>
                )}
              </Dropdown.List>
            </Dropdown>
            {selectCategory?.name && (
            <span className="inline-block p-3 bg-green-50 text-green-600 text-sm rounded-lg font-medium" >
              {selectCategory?.name}
            </span>
            )}
          </Field>
        </div>
        <Button
          type="submit"
          className="mx-auto w-[250px]"
          isLoading={loading}
          disable={loading}
        >
          Add new post
        </Button>
      </form>
    </>
  );
};

export default PostAddNew;
