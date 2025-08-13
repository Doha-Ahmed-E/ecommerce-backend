import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res)
{
    if (req.method !== 'POST')
    {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { username, password } = req.body;

    if (!username || !password)
    {
        return res.status(400).json({ error: 'Username and password required' });
    }

    try
    {
        // Find user by username
        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user)
        {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isValidPassword = bcrypt.compareSync(password, user.password);

        if (!isValidPassword)
        {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error)
    {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
