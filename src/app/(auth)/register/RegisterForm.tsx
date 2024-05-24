'use client'
import { registerUser } from "@/app/actions/authActions";
import { RegisterSchema, registerSchema } from "@/lib/schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardBody, Button, Input } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { GiPadlock } from "react-icons/gi";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting},
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });
  const onSubmit = async (data: RegisterSchema) => {
    const result = await registerUser(data)
    if(result.status ==='success'){
      console.log('注册成功')
    }else{
      if(Array.isArray(result.error)){
        result.error.forEach((e)=>{
          const fieldName = e.path.join('.') as 'email'|'name'|'password'
          setError(fieldName, {message: e.message})
        })
      }else{
        setError('root.serverError', {message: result.error})
      }
    }
  };
  return (
    <Card className="w-2/5 mx-auto">
      <CardHeader className="flex flex-col items-center justify-center">
        <div className="flex flex-col gap-2 items-center text-primary">
          <div className="flex flex-row items-center gap-3">
            <GiPadlock size={30} />
            <h1 className="text-3xl font-semibold">注册</h1>
          </div>
          <p className="text-neutral-500">欢迎</p>
        </div>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              defaultValue=""
              label="姓名"
              variant="bordered"
              {...register("name")}
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
            />
            <Input
              defaultValue=""
              label="邮箱"
              variant="bordered"
              {...register("email")}
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
            />
            <Input
              defaultValue=""
              label="密码"
              variant="bordered"
              type="password"
              {...register("password")}
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
            />
            <Button
              isLoading={isSubmitting}
              isDisabled={!isValid}
              fullWidth
              color="primary"
              type="submit"
            >
              注册
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
