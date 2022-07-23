
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from '../../../firebase-blog/firebase-config-blog';
import useFirebaseImage from '../../../hooks/useFirebaseImage';
import { userRole, userStatus } from '../../../utils/constants';
import { Button } from '../../button';
import { Radio } from '../../checkbox';
import { Field, FieldCheckboxes } from '../../field';
import ImageUpload from '../../image/ImageUpload';
import { Input } from '../../input';
import { Label } from '../../label';
import { TextArea } from '../../textarea';
import DashboardHeading from '../dashboard/DashboardHeading';



const UserUpdate = () => {
    const { control, handleSubmit, watch, reset, setValue, getValues, formState: { isValid, isSubmitting }
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
    const watchStatus = watch("status")
    const watchRole = watch("role")
    const [params] = useSearchParams()
    const userId = params.get("id")

    const imageUrl = getValues("avatar")
    const imageRegex = /%2F(\S+)\?/gm.exec(imageUrl)
    const imageName = imageRegex?.length > 0 ? imageRegex[1] : "";
    const {
        image,
        setImage,
        progress,
        handleSelectImage,
        handleDeleteImage,
    } = useFirebaseImage(setValue, getValues, imageName, deleteAvatar)


    const handleUpdateUser = async (values) => {

        if (!isValid) return
        try {
            const colRef = doc(db, "users", userId)
            await updateDoc(colRef, {
                ...values, 
                status: Number(values.role),
                role: Number(values.status),
                avatar: image,
            })
            toast.success("Update user information successfully")
        } catch (error) {
            toast.error("Update user failed!")
        }
    }

    async function deleteAvatar() {
        const colRef = doc(db, "users", userId)
        await updateDoc(colRef, {
            avatar: "",
        })
    }

    useEffect(() => {
        setImage(imageUrl)
    }, [imageUrl, setImage])
    useEffect(() => {
        async function fetchData() { 
            if (!userId) return
            const colRef = doc(db, "users", userId)
            const docData = await getDoc(colRef)
            console.log(docData);
            reset(docData && docData.data())
        }
        fetchData()
    }, [userId, reset])
    if (!userId) return null


    return (
        <div>
            <DashboardHeading
                title="Update user"
                desc="Update user to system"
            ></DashboardHeading>
            <form onSubmit={handleSubmit(handleUpdateUser)}>
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
                <div className='form-layout'>
                    <Field>
                        <Label>Description</Label>
                        <TextArea
                            name="description"
                            control={control}
                            ></TextArea>
                    </Field>
                </div>
                <Button
                    type="submit"
                    kind="primary"
                    className="mx-auto w-[200px]"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}>
                    Update
                </Button>
            </form>
        </div>
    );
};

export default UserUpdate;