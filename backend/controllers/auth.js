import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const generateToken = (id) => {
    return jwt.sign({id}, 'my_secret_jwt', {expiresIn: '30d'});
};

export const register = async (req, res) => {
    const {name, email, password, role} = req.body;

    try {
        const existingUser = await User.findOne({email});
        if (existingUser) return res.status(400).json({message: 'Пользователь уже существует'});

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        const token = generateToken(user._id);

        res.status(201).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        res.status(500).json({message: 'Ошибка сервера'});
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});
        if (!user) return res.status(400).json({message: 'Неверные данные'});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({message: 'Неверные данные'});

        const token = generateToken(user._id);

        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        res.status(500).json({message: 'Ошибка сервера'});
    }
}

export const getMe = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(404).json({message: 'Пользователь не найден'});
        }

        res.json(req.user);
    } catch (error) {
        res.status(500).json({message: 'Ошибка сервера'});
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id; // предполагаем, что middleware auth добавил req.user
        const { name, password } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

        if (name) user.name = name;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        await user.save();

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};