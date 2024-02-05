import { Request, Response } from 'express'
import { getOneStore } from '../../models/store.model'
import { Store, User } from '@prisma/client'

const getStore = async (req: Request, res: Response) => {
    try {
        const user = req.user as User
        const stores = await getOneStore({ id: req.params.id })

        if (stores?.location && stores.range && stores.userId !== user.id) {

            const locations = stores.location.split(',')
            const lat1 = parseFloat(locations[0])
            const lon1 = parseFloat(locations[1])

            const userLocation = String(req.query.location).split(',')
            const lat2 = parseFloat(userLocation[0])
            const lon2 = parseFloat(userLocation[1])
            const range = stores.range

            const isInRange = isPositionInRange(lat2, lon2, lat1, lon1, range)
            if (!isInRange) {
                return res.status(404).json({ errors: [{ msg: 'You are not in range' }] })
            }
        }

        if (stores) {
            return res.status(200).json(stores)
        } else {
            return res.status(404).json({ errors: [{ msg: 'Not found store' }] })
        }
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ errors: [{ msg: 'Server error' }] })
    }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const earthRadius = 6371000 // Earth's radius in meters

    // Convert degrees to radians
    const lat1Rad = (Math.PI / 180) * lat1
    const lon1Rad = (Math.PI / 180) * lon1
    const lat2Rad = (Math.PI / 180) * lat2
    const lon2Rad = (Math.PI / 180) * lon2

    // Calculate the differences between the coordinates
    const deltaLat = lat2Rad - lat1Rad
    const deltaLon = lon2Rad - lon1Rad

    // Calculate the Haversine distance
    const a =
        Math.sin(deltaLat / 2) ** 2 +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLon / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = earthRadius * c

    return distance
}

function isPositionInRange(lat1: number, lon1: number, lat2: number, lon2: number, rangeInMeters: number) {
    const distance: number = calculateDistance(lat1, lon1, lat2, lon2)
    return distance <= rangeInMeters
}

export default getStore
