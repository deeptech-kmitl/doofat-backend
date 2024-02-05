import { PrismaClient, Store } from '@prisma/client'

const prisma = new PrismaClient()

const newStore = async (data: Store) => {
    const store = await prisma.store.create({
        data,
    })
    return store
}

const updateStore = async ({ id, userId }: any, data: Store) => {
    const store = await prisma.store.update({
        where: {
            id_userId: {
                id,
                userId,
            }
        },
        data,
    })
    return store
}

const getAllStores = async (userId: any) => {
    const stores = await prisma.store.findMany({
        where: {
            userId,
        },
    })
    return stores
}

const getOneStore = async ({ id, userId }: any) => {
    const store = await prisma.store.findUnique({
        where: userId ? {
            id_userId: {
                id,
                userId,
            }
        } : { id },
        include: {
            menus: {
                include: {
                    foods: true,
                },
            },
        },
    })
    return store
}

const delStore = async ({ id, userId }: any) => {
    const store = await prisma.store.delete({
        where: {
            id_userId: {
                id,
                userId,
            }
        },
    })
    return store
}

export { newStore, updateStore, getAllStores, getOneStore, delStore }