import { PrismaClient } from '@prisma/client';
import { verifyJWT } from '../../../lib/auth';

const prisma = new PrismaClient();

export default async function handler(req, res)
{
    if (req.method === 'GET')
    {
        // Public endpoint - no auth required
        const products = await prisma.product.findMany({
            include: { category: true },
        });
        return res.status(200).json(products);
    }

    if (req.method === 'POST')
    {
        // Protected endpoint - requires JWT
        const user = verifyJWT(req);
        if (!user)
        {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { name, description, price, stock, categoryId } = req.body;
        try
        {
            const product = await prisma.product.create({
                data: {
                    name,
                    description,
                    price: parseFloat(price),
                    stock: Number(stock),
                    categoryId: Number(categoryId)
                },
                include: { category: true },
            });
            return res.status(201).json(product);
        } catch (error)
        {
            return res.status(400).json({ error: 'Creation failed' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}