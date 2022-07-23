import React, { useEffect } from "react";
import { Input } from "../components/input";
import { useForm } from "react-hook-form";
import { Field } from "../components/field";
import { Button } from "../components/button";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase-blog/firebase-config-blog";

import { NavLink, useNavigate } from "react-router-dom";
import AuthenticationPage from "./AuthenticationPage";
import InputPasswordToggle from "../components/input/InputPasswordToggle";
import slugify from "slugify";
import { Label } from "../components/label";
import { userRole, userStatus } from "../utils/constants";

const schema = yup.object({
  fullname: yup
    .string()
    .required("Please enter your fullname"),
  email: yup
    .string()
    .email("Please enter valid email address")
    .required("Please enter your email address"),
  password: yup
    .string()
    .min(8, "Your password must be at least 8 characters or greater")
    .required("Please enter your password"),
});

const SignUpPage = () => {
  const navigatte = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    //khi ấn submit mới validate
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  const handleSignUp = async (values) => {
    if (!isValid) return;
    //authentication tạo user
    const user = await createUserWithEmailAndPassword(
      auth,
      values.email,
      values.password
    );
    //sau khi tạo tài khoản xong cập nhập profile
    await updateProfile(auth.currentUser, {
      displayName: values.fullname,
      photoURL:
        "https://st2.depositphotos.com/4111759/12123/v/950/depositphotos_121231710-stock-illustration-male-default-avatar-profile-gray.jpg",
    });

    //firestore db
    //sử dụng setDoc thay vì addDoc vì muốn cái Id tự động tạo ra chính là id của user
    await setDoc(doc(db, "users", auth.currentUser.uid), {
      fullname: values.fullname,
      email: values.email,
      password: values.password,
      username: slugify(values.username || values.fullname, { lower: true }),
      avatar:
        "https://st2.depositphotos.com/4111759/12123/v/950/depositphotos_121231710-stock-illustration-male-default-avatar-profile-gray.jpg",
      status: userStatus.ACTIVE,
      role: userRole.USER,
      createdAt: serverTimestamp(),
    });
    //tạo collection user
    // const colRef = collection(db, 'users');
    // addDoc(colRef, {
    //     fullname: values.fullname,
    //     email: values.email,
    //     password: values.password
    // })
    toast.success("Register successfully");
    navigatte("/");

    //test isloading
    // return new Promise((resolve) => {
    //     setTimeout(() => {
    //         resolve()
    //     }, 3000)
    // }) 
  };

  useEffect(() => {
    const arrError = Object.values(errors);
    if (arrError.length > 0) {
      //đối số thứ 2 là các option
      toast.error(arrError[0]?.message, {
        //khi hover vào ko bị dừng
        pauseOnHover: false,
        delay: 0,
      });
    }
  }, [errors]);
  
  useEffect(() => {
    document.title = "Blogging - Register Page";
  });

  return (
    <AuthenticationPage>
      <div className="container">
        <form
          className="form"
          onSubmit={handleSubmit(handleSignUp)}
          autoComplete="off"
        >
          <Field>
            <Label htmlFor="fullname">Fullname</Label>
            <Input
              type="text"
              name="fullname"
              placeholder="Enter you fullname"
              control={control}
            />
          </Field>
          <Field>
            <Label htmlFor="email">Email adress</Label>
            <Input
              type="email"
              name="email"
              placeholder="Enter you email"
              control={control}
            />
          </Field>
          <Field>
            <Label htmlFor="password">Password</Label>
            <InputPasswordToggle control={control}></InputPasswordToggle>
          </Field>
          <div className="have-account">
            You already have acoount?
            <NavLink to={"/sign-in"}>Login</NavLink>
          </div>
          <Button
            type="submit"
            styled={{
              maxWidth: 350,
              margin: "0 auto",
            }}
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            SignUp
          </Button>
        </form>
      </div>
    </AuthenticationPage>
  );
};

export default SignUpPage;
