'use client'

import { Input } from "@nextui-org/react"
import { useFormContext } from "react-hook-form"

export default function UserDetailsForm() {
  const {register, getValues, formState: {errors}} = useFormContext();
  return (
    <div className='space-y-4'>
        <Input
              defaultValue={getValues('name')}
              label="姓名"
              variant="bordered"
              {...register("name")}
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message as string}
            />
            <Input
              defaultValue={getValues('email')}
              label="邮箱"
              variant="bordered"
              {...register("email")}
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message as string}
            />
            <Input
              defaultValue={getValues('password')}
              label="密码"
              variant="bordered"
              type="password"
              {...register("password")}
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message as string}
            />
    </div>
  )
}