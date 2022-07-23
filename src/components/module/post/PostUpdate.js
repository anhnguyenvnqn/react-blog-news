import "react-quill/dist/quill.snow.css";
import { Button } from "../../button";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase-blog/firebase-config-blog";
import { Dropdown } from "../../dropdown";
import { Field, FieldCheckboxes } from "../../field";
import { imgbbAPI } from "../../../apiConfig";
import { Input } from "../../input";
import { Label } from "../../label";
import { postStatus, userRole, userStatus } from "../../../utils/constants";
import { Radio } from "../../checkbox";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import DashboardHeading from "../dashboard/DashboardHeading";
import ImageUpload from "../../image/ImageUpload";

import ImageUploader from "quill-image-uploader";
import React, { useEffect, useMemo, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import slugify from "slugify";
import Toggle from "../../toggle/Toggle";
import useFirebaseImage from "../../../hooks/useFirebaseImage";

Quill.register("modules/imageUploader", ImageUploader);

const PostUpdate = () => {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    getValues,
    formState: { isValid, isSubmitting },
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
    },
  });
  const [categories, setCategories] = useState([]);
  console.log(categories);
  const [selectCategory, setSelectCategory] = useState("");
  console.log(selectCategory);
  const [content, setContent] = useState("");
  const imageUrl = getValues("image");
  const imageName = getValues("image_name");
  const watchStatus = watch("status");
  const watchHot = watch("hot");
  const [params] = useSearchParams();
  const postId = params.get("id");

  const { image, setImage, progress, handleSelectImage, handleDeleteImage } =
    useFirebaseImage(setValue, getValues, imageName, deletePostImage);

  //https://codesandbox.io/s/h71jc?file=/src/App.js
  const modules = useMemo(
    () => ({
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote"],
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: "ordered" }, { list: "bullet" }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["link", "image"],
      ],
      //tạo tài khoản tại imgbb lấy API
      //cài quill image uploader
      imageUploader: {
        upload: async (file) => {
          const bodyFormData = new FormData();
          bodyFormData.append("image", file);
          const response = await axios({
            method: "post",
            url: imgbbAPI,
            data: bodyFormData,
            headesrs: {
              "Content-Type": "mutipart/form-data",
            },
          });
          //log response để xem kĩ data trả về, url mà mình đã upload lên
          return response.data.data.url;
        },
      },
    }),
    []
  );

  async function deletePostImage() {
    const colRef = doc(db, "users", postId);
    await updateDoc(colRef, {
      avatar: "",
    });
  }

  const handleUpdatePosts = async (values) => {
    if (!isValid) return;
    const docRef = doc(db, "posts", postId);
    values.slug = slugify(values.slug || values.title, { lower: true });
    values.status = Number(values.status);
    await updateDoc(docRef, {
      ...values,
      image,
      content,
    });
    toast.success("Update post successfully");
  };

  const handleClickOption = async (item) => {
    const colRef = doc(db, "categories", item.id);
    const docData = await getDoc(colRef);
    setValue("category", {
      id: docData.id,
      ...docData.data(),
    });
    console.log(item);
    setSelectCategory(item);
  }; 


  useEffect(() => {
    setImage(imageUrl);
  }, [imageUrl, setImage]);

  useEffect(() => {
    async function fetchData() {
      if (!postId) return;
      const colRef = doc(db, "posts", postId);
      const docSnapshot = await getDoc(colRef);
      //nếu có data truyền dữ liệu vào các input,category,content
      if (docSnapshot.data()) {
        reset(docSnapshot.data());
        setSelectCategory(docSnapshot.data()?.category || "");
        setContent(docSnapshot.data()?.content || "");
      }
    }
    fetchData();
  }, [postId, reset]);

  useEffect(() => {
    async function getCategoriesData() {
      const colRef = collection(db, "categories");
      const q = query(colRef, where("status", "==", 1));
      const querySnapshot = await getDocs(q);
      let result = [];
      querySnapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setCategories(result);
    }
    getCategoriesData();
  }, []);

  if (!postId) return null;
  return (
    <>
      <DashboardHeading title="Edit post" desc="Edit  post"></DashboardHeading>
      <form onSubmit={handleSubmit(handleUpdatePosts)}>
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

        <div className="mb-10">
          <Field>
            <Label>Content</Label>
            <div className="w-full entry-content">
              <ReactQuill
                modules={modules}
                theme="snow"
                value={content}
                onChange={setContent}
              />
            </div>
          </Field>
        </div>

        <div className="form-layout">
          <Field>
            <Label>Feature post</Label>
            <Toggle
              on={watchHot === true}
              onClick={() => setValue("hot", !watchHot)}
            ></Toggle>
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
              <Dropdown.Select
                placeholder={`${selectCategory.name || "Select category "}`}
              ></Dropdown.Select>
              <Dropdown.List>
                {categories.length > 0 &&
                  categories.map((item) => (
                    <Dropdown.Option
                      onClick={() => handleClickOption(item)}
                      key={item.id}
                    >
                      {item.name}
                    </Dropdown.Option>
                  ))}
              </Dropdown.List>
            </Dropdown>
            {selectCategory?.name && (
              <span className="inline-block p-3 bg-green-50 text-green-600 text-sm rounded-lg font-medium">
                {selectCategory?.name}
              </span>
            )}
          </Field>
        </div>
        <Button
          type="submit"
          className="mx-auto w-[250px]"
          isLoading={isSubmitting}
          disable={isSubmitting}
        >
          Update post
        </Button>
      </form>
    </>
  );
};

export default PostUpdate;
