import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '../components/button';
import { Field } from '../components/field';
import { Input } from '../components/input';
import { Label } from '../components/label';
import { useAuth } from '../context/auth-context';
import AuthenticationPage from './AuthenticationPage';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { toast } from 'react-toastify';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase-blog/firebase-config-blog';
import InputPasswordToggle from '../components/input/InputPasswordToggle';


const schema = yup.object({
    email: yup
        .string()
        .email("Please enter valid email address")
        .required("Please enter your email address"),
    password: yup
        .string()
        .min(8, "Your password must be at least 8 characters or greater")
        .required("Please enter your password"),
});

const SignInpage = () => {
    const { userInfo } = useAuth()
    const navigate = useNavigate()

    const { handleSubmit,
        control,
        formState: { isSubmitting, errors },
    }
        = useForm({
            mode: "onSubmit",
            resolver: yupResolver(schema),
        })
    
    const handleSignIn = async (values) => {         
        await signInWithEmailAndPassword(auth, values.email, values.password)
        navigate("/")
    }

    useEffect(() => {
        const arrError = Object.values(errors);
        if (arrError.length > 0) {
            toast.error(arrError[0]?.message, {
                pauseOnHover: false,
                delay: 0,
            })
        }
    }, [errors])

    useEffect(() => {
        document.title = "Blogging - Login Page"
        //nếu đã đăng nhập thì....
        if (userInfo?.email) navigate("/")
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <AuthenticationPage>
            <form
                className='form'
                onSubmit={handleSubmit(handleSignIn)}
                autoComplete="off" >
                <Field>
                    <Label htmlFor='email'>Email address</Label>
                    <Input type="email" name='email' placeholder="Enter your email" control={control}> </Input>
                </Field>
                <Field>
                    <Label htmlFor='password'>Email password</Label>
                    <InputPasswordToggle control={control}></InputPasswordToggle>
                </Field>
                <div className='have-account'>You have not had an acoount?
                    <NavLink to={'/sign-up'}>Register an account</NavLink>
                </div>

                <Button type="submit"
                    styled={{
                        width: "100%",
                        maxWidth: 350,
                        margin: "0 auto",
                    }}
                    disabled={isSubmitting}
                    isLoading={isSubmitting}>SignUp</Button>

            </form>
        </AuthenticationPage>
    );
};

export default SignInpage;