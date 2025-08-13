import { PrismaClient } from '@prisma/client';
import { verifyJWT } from '../../../lib/auth';

const prisma = new PrismaClient();

export default async function handler(req, res)
{
    const user = verifyJWT(req);
    if (!user)
    {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { cartItemId } = req.query;

    // Ensure cart item belongs to user's cart
    const cartItem = await prisma.cartItem.findUnique({
        where: { id: Number(cartItemId) },
        include: { cart: true },
    });
    if (!cartItem || cartItem.cart.userId !== Number(user.id))
    {
        return res.status(403).json({ error: 'Cart item not found or not yours' });
    }

    if (req.method === 'GET')
    {
        const item = await prisma.cartItem.findUnique({
            where: { id: Number(cartItemId) },
            include: { product: true },
        });
        return res.status(200).json(item);
    }

    if (req.method === 'PATCH')
    {
        const { quantity } = req.body;
        if (!quantity || quantity < 1)
        {
            return res.status(400).json({ error: 'Invalid quantity' });
        }
        try
        {
            const updatedItem = await prisma.cartItem.update({
                where: { id: Number(cartItemId) },
                data: { quantity: Number(quantity) },
                include: { product: true },
            });
            return res.status(200).json(updatedItem);
        } catch (error)
        {
            return res.status(400).json({ error: 'Update failed' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}