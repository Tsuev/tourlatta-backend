import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Отсутствует токен авторизации' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Добавляем данные пользователя в req
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Неверный или просроченный токен' });
    }
};

// Middleware для проверки роли
export const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'У вас нет доступа к этому ресурсу' });
        }
        next();
    };
};
