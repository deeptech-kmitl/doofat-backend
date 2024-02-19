import { Request, Response, NextFunction } from 'express';
import { getOneStore } from '../../models/store.model';
// import { getOneMenu } from '../../models/menu.model';
// import { getOneFood2 } from '../../models/food.model';
// import { getOneOrder } from '../../models/order.model';
import { User } from '@prisma/client';

export const ownerStore = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User
    const store = await getOneStore({ id: req.params.id, userId: user.id });

    if (store) {
        next();
    } else {
        return res.status(401).json({ errors: [{ msg: 'Not found your store' }] })
    }
}

// export const storeMenu = async (req: Request, res: Response, next: NextFunction) => {
//     const menu = await getOneMenu({ id: req.params.menuId, storeId: req.params.id });

//     if (menu) {
//         next();
//     } else {
//         return res.status(401).json({ errors: [{ msg: 'Not found your menu' }] })
//     }
// }

// export const storeMenuFood = async (req: Request, res: Response, next: NextFunction) => {
//     const food = await getOneFood2({ id: req.params.foodId, storeId: req.params.id, menuId: req.params.menuId });

//     if (food) {
//         next();
//     } else {
//         return res.status(401).json({ errors: [{ msg: 'Not found your food' }] })
//     }
// }

// export const orderStore = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const user = req.user as User
//         const order = await getOneOrder(Number(req.params.id));
//         if (order) {
//             const store = await getOneStore({ id: order?.storeId, userId: user.id });

//             if (store) {
//                 next();
//             } else {
//                 return res.status(401).json({ errors: [{ msg: 'you dont have permission to edit this order' }] })
//             }
//         } else {
//             return res.status(401).json({ errors: [{ msg: 'Not found your order' }] })
//         }
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ errors: [{ msg: 'Server error' }] })
//     }
// }
// // export default { ownerStore, ownerStoreMenu };