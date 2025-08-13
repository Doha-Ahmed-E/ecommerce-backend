import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req, res)
{
    if (req.method !== 'POST')
    {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    const { username, email, password } = req.body;
    if (!username || !email || !password)
    {
        return res.status(400).json({ error: 'Missing fields' });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    try
    {
        const user = await prisma.user.create({
            data: { username, email, password: hashedPassword },
        });
        return res.status(201).json({ message: 'User created', user });
    } catch (error)
    {
        return res.status(400).json({ error: 'User already exists' });
    }
}