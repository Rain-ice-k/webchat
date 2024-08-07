import {Resend} from 'resend'

const resend = new Resend(process.env.RESED_API_KEY)

export async function sendVerificationEmail(email: string, token: string){
    const link = `http://localhost:3000/verify-email?token=${token}`
    return resend.emails.send({
        from: 'testing@resend.dev',
        to: email,
        subject: '验证你的邮箱',
        html:`
            <h1>验证你的邮箱</h1>
            <p>点击下方链接验证你的邮箱</p>
            <a href="${link}">验证邮箱</a>
            `
    })
}


export async function sendPasswordResetEmail(email: string, token: string){
    const link = `http://localhost:3000/reset-password?token=${token}`
    return resend.emails.send({
        from: 'testing@resend.dev',
        to: email,
        subject: '重置你的密码',
        html:`
            <h1>你正在重置你的密码</h1>
            <p>点击下方链接重置密码</p>
            <a href="${link}">重置密码</a>
            `
    })
}