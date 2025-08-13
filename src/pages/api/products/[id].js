import { PrismaClient } from '@prisma/client';
import { verifyJWT } from '../../../lib/auth';

const prisma = new PrismaClient();

export default async function handler(req, res)
{
    const { id } = req.query;

    if (req.method === 'GET')
    {
        // Public endpoint - no auth required
        const product = await prisma.product.findUnique({
            where: { id: Number(id) },
            include: { category: true },
        });
        if (!product) return res.status(404).json({ error: 'Not found' });
        return res.status(200).json(product);
    }

    // Protected endpoints - require JWT
    const user = verifyJWT(req);
    if (!user)
    {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'PATCH')
    {
        const { name, description, price, stock, categoryId } = req.body;
        try
        {
            const product = await prisma.product.update({
                where: { id: Number(id) },
                data: {
                    name,
                    description,
                    price: parseFloat(price),
                    stock: Number(stock),
                    categoryId: Number(categoryId)
                },
                include: { category: true },
            });
            return res.status(200).json(product);
        } catch (error)
        {
            return res.status(400).json({ error: 'Update failed' });
        }
    }

    if (req.method === 'DELETE')
    {
        try
        {
            await prisma.product.delete({ where: { id: Number(id) } });
            return res.status(200).json({ message: 'Deleted' });
        } catch (error)
        {
            return res.status(400).json({ error: 'Delete failed' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}