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

    if (req.method === 'GET')
    {
        const userDetails = await prisma.user.findUnique({
            where: { id: Number(user.id) },
            select: { id: true, username: true, email: true },
        });
        return res.status(200).json(userDetails);
    }

    if (req.method === 'PATCH')
    {
        const { email } = req.body;
        try
        {
            const updatedUser = await prisma.user.update({
                where: { id: Number(user.id) },
                data: { email },
                select: { id: true, username: true, email: true },
            });
            return res.status(200).json(updatedUser);
        } catch (error)
        {
            return res.status(400).json({ error: 'Update failed' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}