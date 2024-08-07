"use client";
import { generateResetPasswordEmail } from "@/app/actions/authActions";
import CardWrapper from "@/components/CardWrapper";
import ResultMessage from "@/components/ResultMessage";
import { ActionResult } from "@/types";
import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { GiPadlock } from "react-icons/gi";

export default function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm();
  const [result, setResult] = useState<ActionResult<string> | null>(null);

  const onSubmit = async (data: FieldValues) => {
    setResult(await generateResetPasswordEmail(data.email));
    reset();
  };
  return (
    <CardWrapper
      headerIcon={GiPadlock}
      headerText="忘记密码"
      subHeaderText="请输入你的邮箱,我们将会发送一个链接重置密码"
      body={
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          <Input
            type="email"
            placeholder="邮箱地址"
            variant="bordered"
            defaultValue=""
            {...register("email", { required: true })}
          />
          <Button
            type="submit"
            color="primary"
            isLoading={isSubmitting}
            isDisabled={!isValid}
          >发送重置邮件 </Button>
        </form>
      }
      footer={
        <ResultMessage result={result} />
      }
    />
  );
}
