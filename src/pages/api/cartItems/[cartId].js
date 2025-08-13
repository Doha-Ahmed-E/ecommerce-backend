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

    const { cartId } = req.query;

    // Ensure the cart belongs to the user
    const cart = await prisma.cart.findUnique({
        where: { id: Number(cartId), userId: Number(user.id) },
    });
    if (!cart) return res.status(403).json({ error: 'Cart not found or not yours' });

    if (req.method === 'GET')
    {
        try
        {
            const cartItems = await prisma.cartItem.findMany({
                where: { cartId: Number(cartId) },
                include: { product: true },
            });
            return res.status(200).json(cartItems);
        } catch (error)
        {
            return res.status(500).json({ error: 'Failed to fetch cart items' });
        }
    }

    if (req.method === 'POST')
    {
        const { productId, quantity } = req.body;
        if (!productId || !quantity || quantity < 1)
        {
            return res.status(400).json({ error: 'Invalid productId or quantity' });
        }
        try
        {
            // Verify product exists
            const product = await prisma.product.findUnique({
                where: { id: Number(productId) },
            });
            if (!product) return res.status(404).json({ error: 'Product not found' });
            if (product.stock < quantity) return res.status(400).json({ error: 'Insufficient stock' });

            const cartItem = await prisma.cartItem.create({
                data: {
                    cartId: Number(cartId),
                    productId: Number(productId),
                    quantity: Number(quantity),
                },
            });
            return res.status(201).json(cartItem);
        } catch (error)
        {
            return res.status(500).json({ error: 'Failed to add cart item' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}