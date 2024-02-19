import { Router, Request, Response } from 'express'
import { validate, body } from '../controllers/validators/bodyValidate'
import { create, edit, getStores, getStore, deleteStore, menu, food } from '../controllers/myStore/'
import requireSession from '../controllers/validators/session'
import { ownerStore, storeMenu, storeMenuFood } from '../controllers/validators/myStore'
import multer from '../controllers/storage/multer'

const router = Router()
const storeFileMiddleware = multer.fields([{ name: 'logoImg', maxCount: 1 }, { name: 'bgImg', maxCount: 1 }])
const foodFileMiddleware = multer.fields([{ name: 'img', maxCount: 1 }])

// Main route
// Only protect if the user is the owner of the store

router.get('/', requireSession, getStores) // Get all stores

router.get('/:id', requireSession, getStore) // Get a store

router.post('/', requireSession, body('name').not().isEmpty(), body('description'), validate, create) // Create a store

router.patch('/:id', requireSession, storeFileMiddleware, body('name').notEmpty().optional(), body('description'), body('location'), body('range'), validate, ownerStore, edit) // Edit a store

router.delete('/:id', requireSession, ownerStore, deleteStore) // Delete a store

// Sub routes

// Menu
router.get('/:id/menu', requireSession, ownerStore, menu.getMenus) // Get all menus

router.get('/:id/menu/:menuId', requireSession, ownerStore, menu.getMenu) // Get a menu

router.post('/:id/menu', requireSession, body('name').notEmpty(), body('description'), validate, ownerStore, menu.create) // Create a menu

router.patch('/:id/menu/:menuId', requireSession, body('name').notEmpty(), body('description'), validate, storeMenu, menu.edit)  // Edit a menu

router.delete('/:id/menu/:menuId', requireSession, ownerStore, menu.delete) // Delete a menu

// Food
router.get('/:id/food', requireSession, ownerStore, food.getStoreFoods) // Get all store food

router.get('/:id/menu/:menuId/food', requireSession, ownerStore, food.getFoods) // Get all foods in a menu

router.get('/:id/food/:foodId', requireSession, ownerStore, food.getFood) // Get a food

router.post('/:id/menu/:menuId/food', requireSession, foodFileMiddleware, body('name').notEmpty(), body('description'), body('price').notEmpty().isNumeric(), body('img'), validate, storeMenu, food.createFood) // Create a food in a menu

router.patch('/:id/menu/:menuId/food/:foodId', requireSession, foodFileMiddleware, body('name').notEmpty(), body('description'), body('price').notEmpty().isNumeric(), body('img'), validate, storeMenuFood, food.editFood) // Edit a food in a menu

router.delete('/:id/food/:foodId', requireSession, ownerStore, food.deleteFood) // Delete a food in a menu

module.exports = router