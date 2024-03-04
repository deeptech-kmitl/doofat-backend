import { PrismaClient, Food } from '@prisma/client'

const prisma = new PrismaClient()

const getFoodsByMenu = async (menuId: any) => {
    const foods = await prisma.food.findMany({
        where: {
            menuId: Number(menuId),
        },
    })
    return foods
}

const getFoodByStore = async (storeId: any) => {
    const foods = await prisma.food.findMany({
        where: {
            storeId,
        },
    })
    return foods
}

const getOneFood = async ({ id, storeId }: any) => {
    const food = await prisma.food.findUnique({
        where: {
            id_storeId: {
                id: Number(id),
                storeId,
            },
        },
    })
    return food
}

const getOneFood2 = async ({ id, storeId, menuId }: any) => {
    const food = await prisma.food.findUnique({
        where: {
            id_menuId_storeId: {
                id: Number(id),
                storeId,
                menuId: Number(menuId),
            },
        },
    })
    return food
}

const newFood = async (data: Food) => {
    const food = await prisma.food.create({
        data,
    })
    return food
}

const updateFood = async ({ id, storeId }: any, data: Food) => {
    const food = await prisma.food.update({
        where: {
            id_storeId: {
                id: Number(id),
                storeId,
            }
        },
        data,
    })
    return food
}

const deleteFood = async ({ id, storeId }: any) => {
    const food = await prisma.food.delete({
        where: {
            id_storeId: {
                id: Number(id),
                storeId,
            }
        },
    })
    return food
}

const findFoodByManyId = async ({ ids, storeId }: any) => {
    const foods = await prisma.food.findMany({
        where: {
            id: {
                in: ids,
            },
            storeId: storeId
        },
    })
    return foods
}

export {
    getFoodsByMenu,
    getFoodByStore,
    getOneFood,
    newFood,
    updateFood,
    deleteFood,
    getOneFood2,
    findFoodByManyId
}