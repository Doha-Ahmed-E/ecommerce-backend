import jwt from 'jsonwebtoken';

export function verifyJWT(req)
{
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer '))
    {
        return null;
    }

    try
    {
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error)
    {
        return null;
    }
}

export function requireAuth(handler)
{
    return async (req, res) =>
    {
        const user = verifyJWT(req);

        if (!user)
        {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        req.user = user;
        return handler(req, res);
    };
}
