'use client'
import { updateMemberProfile } from "@/app/actions/useActions"
import { MemberEditSchema, memberEditSchema } from "@/lib/schemas/memberEditSchema"
import { handleFormServerErrors } from "@/lib/util"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Input, Textarea } from "@nextui-org/react"
import { Member } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

type Props = {
    member: Member
}
export default function EditForm({member}:Props){
    const router = useRouter()
    const {register, handleSubmit, reset, setError, formState: {isValid, isDirty,isSubmitting,errors}} = useForm<MemberEditSchema>({
        // resolver:zodResolver(memberEditSchema),
        mode:'onTouched'
    })
    useEffect(()=>{
        if(member){
            reset({
                name: member.name,
                description: member.description,
                city:member.city,
                country:member.country
            })
        }
    },[member,reset])
    const onSubmit = async (data:MemberEditSchema) =>{
        const result = await updateMemberProfile(data)
        if(result.status ==='success'){
            toast.success('简介已更新')
            router.refresh()
            reset({...data})
        }else{
            handleFormServerErrors(result, setError)
        }
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col space-y-4'>
            <Input
            label='姓名'
            variant='bordered'
            {...register('name')}
            defaultValue={member.name}
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message}
            />
            <Textarea 
            label='描述' 
            variant='bordered'
            {...register('description')}
            defaultValue={member.description}
            isInvalid={!!errors.description}
            errorMessage={errors.description?.message}
            minRows={6}
            />
            <div className='flex flex-row gap-3'>
            <Input
            label='城市'
            variant='bordered'
            {...register('city')}
            defaultValue={member.city}
            isInvalid={!!errors.city}
            errorMessage={errors.city?.message}
            
            />
            <Input
            label='国家'
            variant='bordered'
            {...register('country')}
            defaultValue={member.country}
            isInvalid={!!errors.country}
            errorMessage={errors.country?.message}
            />
            </div>
            {errors.root?.serverError && (
              <p className='text-danger text-sm'>{errors.root.serverError.message}</p>
            )}
            <Button 
            type='submit'
            className='flex self-end'
            variant='solid'
            isDisabled={!isValid || !isDirty}
            isLoading={isSubmitting}
            color='primary'>
                更新简介
            </Button>
        </form>
    )
}