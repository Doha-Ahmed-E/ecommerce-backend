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

    if (req.method === 'POST')
    {
        try
        {
            const cart = await prisma.cart.create({
                data: { userId: Number(user.id) },
            });
            return res.status(201).json(cart);
        } catch (error)
        {
            return res.status(400).json({ error: 'Creation failed' });
        }
    }

    if (req.method === 'DELETE')
    {
        try
        {
            await prisma.cart.delete({ where: { userId: Number(user.id) } });
            return res.status(200).json({ message: 'Deleted' });
        } catch (error)
        {
            return res.status(400).json({ error: 'Delete failed' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}