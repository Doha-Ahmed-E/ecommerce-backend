import { PrismaClient } from '@prisma/client';
import { verifyJWT } from '../../../lib/auth';

const prisma = new PrismaClient();

export default async function handler(req, res)
{
    if (req.method === 'GET')
    {
        // Public endpoint - no auth required
        const categories = await prisma.category.findMany();
        return res.status(200).json(categories);
    }

    if (req.method === 'POST')
    {
        // Protected endpoint - requires JWT
        const user = verifyJWT(req);
        if (!user)
        {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { name, description } = req.body;
        try
        {
            const category = await prisma.category.create({
                data: { name, description },
            });
            return res.status(201).json(category);
        } catch (error)
        {
            return res.status(400).json({ error: 'Creation failed' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}