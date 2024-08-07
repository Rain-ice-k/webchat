'use server';

import { auth, signIn, signOut } from '@/auth';
import { sendPasswordResetEmail, sendVerificationEmail } from '@/lib/mail';
import { prisma } from '@/lib/prisma';
import { LoginSchema } from '@/lib/schemas/LoginSchema';
import { ProfileSchema, RegisterSchema, combinedRegisterSchema, registerSchema, } from '@/lib/schemas/registerSchema';
import { generateToken, getTokenByEmail, getTokenByToken } from '@/lib/token';
import { ActionResult } from '@/types';
import { TokenType, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';

export async function signInUser(data:LoginSchema):Promise<ActionResult<string>>{
    try {
      const existingUser = await getUserByEmail(data.email)
      if(!existingUser || !existingUser.email) return {status: 'error', error:'无效的凭证'}
      
      if(!existingUser.emailVerified){
        const token = await generateToken(existingUser.email, TokenType.VERIFICATION)
        
        await sendVerificationEmail(token.email, token.token)
        return {status:'error', error:'请在登陆前验证你的邮箱'}
      }
      const result = await signIn('credentials', {
        email:data.email,
        password: data.password,
        redirect:false
      })
      console.log(result)
      return {status: 'success', data:'已登录'}
    } catch (error) {
      console.log(error)
      if(error instanceof AuthError){
        switch(error.type){
          case 'CredentialsSignin':
            return {status: 'error', error: '无效的用户凭证'}
          default:
            return {status: 'error', error: '出了点问题'}
        }
      }else{
        return {status:'error', error:'出了点问题'}
      }
    }
    }

export async function signOutUser() {
    await signOut({ redirectTo: '/' });
}

export async function registerUser(data: RegisterSchema):Promise<ActionResult<User>> {
    try {
      const validated = combinedRegisterSchema.safeParse(data);
      if (!validated.success) {
        return {status: 'error', error: validated.error.errors };
      }
      const { name, email, password, gender, description, dateOfBirth, city, country } = validated.data;
      const hashedPassword = await bcrypt.hash(password, 10);
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) return {status:'error', error: "用户已经存在" };
      const user = await prisma.user.create({
        data: {
            name, 
            email,
            passwordHash: hashedPassword,
            profileComplete: true,
            member: {
                create: {
                    name,
                    description,
                    city,
                    country,
                    dateOfBirth: new Date(dateOfBirth),
                    gender
                }
            }
        }
    });
      const verificationToken = await generateToken(email, TokenType.VERIFICATION)

      await sendVerificationEmail(verificationToken.email, verificationToken.token)
      return {status: 'success', data:user}
    } catch (error) {
      console.log(error)
      return {status: 'error', error:'有一些错误发生了'}
    }
  }

export async function getUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
}

export async function getUserById(id: string) {
    return prisma.user.findUnique({ where: { id } });
}

export async function getAuthUserId() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) throw new Error('未经授权');

    return userId;
}

export async function verifyEmail(token: string): Promise<ActionResult<string>>{
  try {
    const existingToken = await getTokenByToken(token)
    if(!existingToken){
      return {status: 'error', error: '无效的token'}
    }
    const hasExpired = new Date() > existingToken.expires
    if(hasExpired){
      return {status: 'error', error: 'token已过期'}
    }
    const existingUser = await getUserByEmail(existingToken.token)
    if(!existingUser){
      return {status: 'error', error: '用户不存在'}
    }
    await prisma.user.update({
      where: {id: existingUser.id},
      data: {emailVerified: new Date() }
    })

    await prisma.token.delete({where: {id : existingToken.id}})
    return {status: 'success', data:'成功'}
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function generateResetPasswordEmail(email: string): Promise<ActionResult<string>>{
  try {
    const existingUser = await getUserByEmail(email)
    if(!existingUser){
      return {status: 'error', error:'未找到邮箱'}
    }
    const token = await generateToken(email, TokenType.PASSWORD_RESET)
    await sendPasswordResetEmail(token.email, token.token)
    return {status: 'success', data: '重置密码的邮件已发送，请查收邮件'}
  } catch (error) {
    console.log(error)
    return {status: 'error', error: '出了点问题'}
  }
}

export async function resetPassword(password: string, token:string | null): Promise<ActionResult<string>>{
  
  try {
    if(!token) return {status: 'error', error:'token丢失'}
    const existingToken = await getTokenByToken(token)
    if(!existingToken){
      return {status: 'error', error: '无效的token'}
    }
    const hasExpired = new Date() > existingToken.expires
    if(hasExpired){
      return {status: 'error', error: 'token已过期'}
    }
    const existingUser = await getUserByEmail(existingToken.token)
    if(!existingUser){
      return {status: 'error', error: '用户不存在'}
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    await prisma.user.update({
      where: {id: existingUser.id},
      data:{passwordHash: hashedPassword}
    })
    await prisma.token.delete({
      where: {id: existingToken.id}
    })
    return {status:'success', data:'密码已更新, 请重新登录'}
  
  } catch (error) {
    console.log(error)
    return { status:'error', error: '出了点问题'}
  }
 }
export async function completeSocialLoginProfile(data: ProfileSchema):
 Promise<ActionResult<string>> {
  const session = await auth()
  if(!session?.user) return { status: 'error', error:'未找到用户'}
  try {
    const user = await prisma.user.update({
      where: {id: session.user.id},
      data: {
        profileComplete: true,
        member: {
          create: {
            name: session.user.name as string,
            image: session.user.image,
            gender: data.gender,
            dateOfBirth: new Date(data.dateOfBirth),
            description: data.description,
            city: data.city,
            country: data.country
          }
        }
      },
      select: {
        accounts: {
          select: {
            provider: true
          }
        }
      }
    })
    return {status:'success', data: user.accounts[0].provider}
  } catch (error) {
    console.log(error)
    throw error
  }
 }

 export async function getUserRole(){
    const session = await auth()
    const role = session?.user.role
    
    if(!role) throw new Error('not in role')
      return role
 }