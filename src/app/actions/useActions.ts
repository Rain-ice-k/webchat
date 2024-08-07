'use server'

import { MemberEditSchema, memberEditSchema } from "@/lib/schemas/memberEditSchema";
import { Member, Photo } from "@prisma/client";
import { getAuthUserId } from "./authActions";
import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import { cloudinary } from "@/lib/cloudinary";

export async function updateMemberProfile(data: MemberEditSchema): Promise<ActionResult<Member>>{
    try {
        const userId = await getAuthUserId()
        const validated = memberEditSchema.safeParse(data)
        if(!validated.success) return {status:'error', error: validated.error.errors}
        const {name,description,city,country}=validated.data
        const member = await prisma.member.update({
            where:{userId},
            data:{
                name,
                description,
                city,
                country
            }
        })
        return {status: 'success', data: member}
    } catch (error) {
        console.log(error)
        return {status: 'error', error:'出了点问题'}
    }
}
export async function addImage(url: string, publicId: string) {
    try {
        const userId = await getAuthUserId();

        return prisma.member.update({
            where: {userId},
            data: {
                photos: {
                    create: [
                        {
                            url,
                            publicId
                        }
                    ]
                }
            }
        })
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function setMainImage(photo: Photo) {
    if(!photo.isApproved) throw new Error('图片需经过审核')
    try {
        const userId = await getAuthUserId();

        await prisma.user.update({
            where: {id: userId},
            data: {image: photo.url}
        })

        return prisma.member.update(({
            where: {userId},
            data: {image: photo.url}
        }))
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function deleteImage(photo: Photo) {
    try {
        const userId = await getAuthUserId();

        if (photo.publicId) {
            await cloudinary.v2.uploader.destroy(photo.publicId);
        }

        return prisma.member.update({
            where: {userId},
            data: {
                photos: {
                    delete: {id: photo.id}
                }
            }
        })
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getUserInfoForNav() {
    try {
        const userId = await getAuthUserId();
        return prisma.user.findUnique({
            where: {id: userId},
            select: {name: true, image: true}
        })
    } catch (error) {
        console.log(error);
        throw error;
    }
}