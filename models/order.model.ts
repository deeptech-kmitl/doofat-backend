import { PrismaClient, Order, OrderStatus } from '@prisma/client'

const prisma = new PrismaClient()

const newOrder = async (data: any) => {
    const neworder = await prisma.order.create({
        data,
    })
    return neworder
}

const getOneOrder = async (id: number) => {
    const order = await prisma.order.findUnique({
        where: { id },
    })
    return order
}

const getUserOrders = async (userId: string, status: OrderStatus[]) => {
    const orders = await prisma.order.findMany({
        where: {
            userId,
            status: { in: status },
        },
        include: {
            store: {
                select: {
                    name: true,
                    orders: {
                        select: {
                            id: true,
                            status: true,
                            createdAt: true,
                            userId: true,
                        },
                        where: {
                            status: { in: ['PENDING'] },
                        },
                        orderBy: {
                            createdAt: 'asc',
                        },
                    },
                }
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    })
    return orders
}

const getStoreOrders = async (storeId: string, status: OrderStatus[]) => {
    const orders = await prisma.order.findMany({
        where: {
            storeId,
            status: { in: status },
        },
        include: {
            user: {
                select: {
                    name: true,
                    avatar: true,
                }
            }
        }
    })
    return orders
}

const updateOneOrder = async (id: number, data: any) => {
    if (data.status == 'COMPLETED' || data.status == 'CANCLED') {
        data.completedAt = new Date()
    }
    const order = await prisma.order.update({
        where: { id },
        data,
        include: {
            store: {
                select: {
                    name: true,
                    orders: {
                        select: {
                            id: true,
                            status: true,
                            createdAt: true,
                            userId: true,
                        },
                        where: {
                            status: { in: ['PENDING'] },
                        },
                        orderBy: {
                            createdAt: 'asc',
                        },
                    },
                }
            },
        },
    })
    return order
}

export { newOrder, getUserOrders, getStoreOrders, updateOneOrder, getOneOrder }