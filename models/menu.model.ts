import { PrismaClient, Menu } from '@prisma/client'

const prisma = new PrismaClient()

const newMenu = async (data: Menu) => {
    const menu = await prisma.menu.create({
        data,
        include: {
            foods: true,
        },
    })
    return menu
}

const getAllMenus = async (storeId: any) => {
    const menus = await prisma.menu.findMany({
        where: {
            storeId,
        },
        include: {
            _count: {
                select: { foods: true },
            },
        }
    })
    return menus
}

const updateMenu = async ({ id, storeId }: any, data: Menu) => {
    const store = await prisma.menu.update({
        where: {
            id_storeId: {
                id: Number(id),
                storeId,
            }
        },
        data,
        include: {
            foods: true,
        },
    })
    return store
}

const getOneMenu = async ({ id, storeId }: any) => {
    const menu = await prisma.menu.findUnique({
        where: {
            id_storeId: {
                id: Number(id),
                storeId,
            },
        },
        include: {
            foods: true,
        },
    })
    return menu
}

const deleteMenu = async ({ id, storeId }: any) => {
    const menu = await prisma.menu.delete({
        where: {
            id_storeId: {
                id: Number(id),
                storeId,
            },
        },
    })
    return menu
}

export { newMenu, getAllMenus, updateMenu, getOneMenu, deleteMenu }