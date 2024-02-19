import { Router, Request, Response } from 'express'
import { validate, body, check } from '../controllers/validators/bodyValidate'
import { createOrder, getMyOrders, getStoreOrders, updateOrder } from '../controllers/order/index'
import { orderStore } from '../controllers/validators/myStore'
import requireSession from '../controllers/validators/session'

const router = Router()
// Order
// router.get('/:id/order', requireSession, ownerStore, food.getStoreOrders) // Get all store orders
const validateArray = [
    check('foods.*.id').notEmpty().isInt(),
    check('foods.*.name').notEmpty(),
    check('foods.*.price').notEmpty().isFloat(),
    check('foods.*.amount').notEmpty().isInt(),
];

router.get('/', requireSession, getMyOrders) // Get all orders in a store

// อาจจะต้องเช็คให้เจ้าของร้านดูได้เท่านั้นแต่ ขก ค่อยทำ
router.get('/:storeId', requireSession, getStoreOrders)

// ต้องเช็คว่าอยู่ใน Range ไหมด้วย แต่ ขก ค่อยทำ
router.post('/:storeId', requireSession, body('foods').isArray().notEmpty(), validateArray, validate, createOrder) // Create a order in a food

router.patch('/:id', requireSession, check('status').isIn(['NEW', 'PENDING', 'COMPLETED', 'CANCLED']), validate, orderStore, updateOrder) // Update a order

module.exports = router