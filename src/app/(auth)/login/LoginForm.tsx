"use client";
import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { GiPadlock } from "react-icons/gi";
import { useForm } from "react-hook-form";
import { LoginSchema, loginSchema } from "@/lib/schemas/LoginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signInUser } from "@/app/actions/authActions";
import { toast } from "react-toastify";
export default function LoginForm() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    clearErrors,
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });
  const onSubmit = async (data: LoginSchema) => {
    const result = await signInUser(data)
    if(result.status ==='success'){
      router.push('/members')
      router.refresh()
    }else{
      toast.error(result.error as string)
    }
  };
  return (
    <Card className="w-2/5 mx-auto">
      <CardHeader className="flex flex-col items-center justify-center">
        <div className="flex flex-col gap-2 items-center text-primary">
          <div className="flex flex-row items-center gap-3">
            <GiPadlock size={30} />
            <h1 className="text-3xl font-semibold">登录</h1>
          </div>
          <p className="text-neutral-500">欢迎回来</p>
        </div>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              defaultValue=""
              label="邮箱"
              variant="bordered"
              {...register("email")}
              onFocus={() => clearErrors("email")}
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message as string}
            />
            <Input
              label="密码"
              variant="bordered"
              type="password"
              {...register("password")}
              onFocus={() => clearErrors("password")}
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message as string}
            />
            <Button
              isLoading={isSubmitting}
              isDisabled={!isValid}
              fullWidth
              color="primary"
              type="submit"
            >
              登录
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
