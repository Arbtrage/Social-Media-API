import prisma from '../../utils/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config';

export const registerUser = async (fullName: string, username: string, email: string, password: string) => {
    try {
        const isUser = await prisma.user.findUnique({ where: { email } });
        if (isUser) throw new Error('User already exists');
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { fullName, username, email, password: hashedPassword },
        });
        return { message: "Registration Successfull !!", data: user };
    } catch (error) {
        return new Error((error as Error).message);
    }
};

export const loginUser = async (email: string, password: string) => {
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new Error('User not found');
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new Error('Invalid password');
        const refreshToken = jwt.sign({ userId: user.id }, config.jwtSecret);
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });
        const accessToken = jwt.sign({ userId: user.id }, config.jwtSecret);
        return { message: "Login Successfull !!", data: { accessToken, refreshToken } };
    } catch (error) {
        throw new Error(`Login failed: ${(error as Error).message}`);
    }
};