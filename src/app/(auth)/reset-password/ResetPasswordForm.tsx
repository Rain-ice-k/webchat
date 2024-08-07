"use client";
import { generateResetPasswordEmail, resetPassword } from "@/app/actions/authActions";
import CardWrapper from "@/components/CardWrapper";
import ResultMessage from "@/components/ResultMessage";
import { ResetPasswordSchema, resetPasswordSchema } from "@/lib/schemas/forgotPasswordSchema";
import { ActionResult } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { GiPadlock } from "react-icons/gi";

export default function ResetPasswordForm() {
    const searchParams = useSearchParams()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ResetPasswordSchema>({
    mode: 'onTouched',
    resolver: zodResolver(resetPasswordSchema)
  });
  const [result, setResult] = useState<ActionResult<string> | null>(null);

  const onSubmit = async (data: FieldValues) => {
    setResult(await resetPassword(data.password, searchParams.get('token')));
    reset();
  };
  return (
    <CardWrapper
      headerIcon={GiPadlock}
      headerText="重置密码"
      subHeaderText="在下方输入你的新密码"
      body={
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          <Input
            type="password"
            placeholder="密码"
            variant="bordered"
            defaultValue=""
            {...register("password")}
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message as string}
          />
           <Input
            type="password"
            placeholder="确认密码"
            variant="bordered"
            defaultValue=""
            {...register("confirmPassword")}
            isInvalid={!!errors.confirmPassword}
            errorMessage={errors.confirmPassword?.message as string}
          />
          <Button
            type="submit"
            color="primary"
            isLoading={isSubmitting}
            isDisabled={!isValid}
          >重置密码 </Button>
        </form>
      }
      footer={
        <ResultMessage result={result} />
      }
    />
  );
}
