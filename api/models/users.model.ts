import { PrismaClient, User } from '@prisma/client'

const prisma = new PrismaClient()

const newUser = async (data: User) => {
    const resgister = await prisma.user.create({
        data,
    })
    return resgister
}

const getUser = async (id: any) => {
    const user = await prisma.user.findUnique({
        where: {
            id,
        },
    })
    return user
}

const getUserByEmail = async (email: any) => {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    })
    return user
}

const editUser = async (id: any, data: any) => {
    const user = await prisma.user.update({
        where: {
            id,
        },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            createdAt: true,
            googleId: true,
            facebookId: true,
        },
    })
    return user
}

const getUserByGoogleId = async (googleId: any) => {
    const user = await prisma.user.findUnique({
        where: {
            googleId,
        },
    })
    return user
}

const updateGoogleId = async (id: any, googleId: any) => {
    const user = await prisma.user.update({
        where: {
            id,
        },
        data: {
            googleId,
        },
    })
    return user
}

const updateFacebookId = async (id: any, facebookId: any) => {
    const user = await prisma.user.update({
        where: {
            id,
        },
        data: {
            facebookId,
        },
    })
    return user
}


export { newUser, getUser, getUserByEmail, getUserByGoogleId, updateGoogleId, updateFacebookId, editUser }