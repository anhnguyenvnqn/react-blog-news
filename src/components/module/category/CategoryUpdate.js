
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from 'react-toastify';
import slugify from 'slugify';
import { db } from '../../../firebase-blog/firebase-config-blog';
import { categoryStatus } from '../../../utils/constants';
import { Button } from '../../button';
import { Radio } from '../../checkbox';
import { Field, FieldCheckboxes } from '../../field';
import { Input } from '../../input';
import { Label } from '../../label';
import DashboardHeading from '../dashboard/DashboardHeading';

// /manage/update-category?id=
const CategoryUpdate = () => {
    const { control, reset, watch, handleSubmit, formState: { isSubmitting } } = useForm({
        mode: "onChage",
        defaultValues: {
        }
    })
    const [params] = useSearchParams()
    const categoryId = params.get('id')
    const navigate = useNavigate()
    const watchStatus = watch("status")

    useEffect(() => {
        async function fetchData() {
            const colRef = doc(db, "categories", categoryId)
            const singleDoc = await getDoc(colRef)
            //trả dữ liệu về input
            reset(singleDoc.data())
        }
        fetchData()
    }, [categoryId, reset])


    const handleUpdateCategory = async (values) => {
        const colRef = doc(db, "categories", categoryId)
        await updateDoc(colRef, {
            name: values.name,
            slug: slugify(values.slug || values.name, { lower: true }),
            status: Number(values.status)
        })
        toast.success("Update category successfully")
        navigate("/manage/category")
    }
    if (!categoryId) return null

    return (
        <div>
            <DashboardHeading
                title='Update category'
                desc={`Update your category id : ${categoryId}`}></DashboardHeading>
            <form onSubmit={handleSubmit(handleUpdateCategory)} autoComplete="off">
                <div className="form-layout">
                    <Field>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            control={control}
                            name="name"
                            placeholder="Enter your category name"
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
                    kind="primary"
                    type='submit'
                    disable={isSubmitting}
                    isLoading={isSubmitting}
                >
                    Update  category
                </Button>
            </form>

        </div>
    );
};

export default CategoryUpdate;