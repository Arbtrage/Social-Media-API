import prisma from "../../utils/prisma";
import jwt from 'jsonwebtoken';
import config from '../../config';
import { Context } from "../../context";


export const getAllUsers = async () => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                fullName: true,
                username: true,
                profilePhoto: true,
                email: true
            }
        })

        if (users.length === 0) throw new Error('No users found');
        return { message: "Users found", data: users }
    } catch (error) {
        return new Error((error as Error).message);
    }
};


export const getUserByName = async (username: string,context:Context) => {
    try {
        if (!context.user?.userId) throw new Error('Not authenticated');
        const users = await prisma.user.findMany({
            where: {
                username: {
                    startsWith: username
                }
            },
            select: {
                id: true,
                fullName: true,
                username: true,
                profilePhoto: true,
                email: true
            }
        });
        if (users.length===0) throw new Error('User not found');
        return { message: "User found", data: users }
    } catch (error) {
        return new Error((error as Error).message);
    }
};

export const getUserById = async (id: string,context:Context) => {
    try {
        if (!context.user?.userId) throw new Error('Not authenticated');
        const user = await prisma.user.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                fullName: true,
                username: true,
                profilePhoto: true,
                followers: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                id: true,
                                fullName: true,
                                username: true,
                                profilePhoto: true,
                            }
                        }

                    }
                },
                following: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                id: true,
                                fullName: true,
                                username: true,
                                profilePhoto: true,
                            }
                        }
                    }
                },
                Like: {
                    select: {
                        id: true,
                        post: {
                            select: {
                                id: true,
                                content: true,
                                media: true,
                                mediaType: true,
                                author: {
                                    select: {
                                        id: true,
                                        fullName: true,
                                        username: true,
                                        profilePhoto: true,
                                    }
                                },
                                createdAt: true,
                                updatedAt: true,
                            }
                        }
                    }
                },
                posts: {
                    select: {
                        id: true,
                        content: true,
                        media: true,
                        mediaType: true,
                        commentsCount: true,
                        likesCount: true,
                        commentsEnabled: true,
                        author: {
                            select: {
                                id: true,
                                fullName: true,
                                username: true,
                                profilePhoto: true,
                            }
                        },
                        comments: {
                            select: {
                                id: true,
                                content: true,
                                author: {
                                    select: {
                                        id: true,
                                        fullName: true,
                                        username: true,
                                        profilePhoto: true,
                                    }
                                },
                                createdAt: true,
                                updatedAt: true,
                            }
                        },
                        createdAt: true,
                        updatedAt: true,
                    }
                }
            }
        })
        if (!user) throw new Error('User not found');
        return { message: "User found", data: user };
    } catch (error) {
        return new Error((error as Error).message);
    }
};

export const refreshToken = async (refreshToken: string, context: Context) => {
    try {
        console.log(context.user?.userId)
        if (!context.user?.userId) throw new Error('Not authenticated');
        const id = context.user?.userId;
        const user = await prisma.user.findUnique({
            where: { id },
            select: { refreshToken: true },
        });

        if (!user || refreshToken !== user.refreshToken) {
            throw new Error('Invalid refresh token');
        }

        const newRefreshToken = jwt.sign({ userId: id }, config.jwtSecret);
        await prisma.user.update({
            where: { id },
            data: { refreshToken: newRefreshToken },
        });

        const accessToken = jwt.sign({ userId: id }, config.jwtSecret);
        return { message: "New Access Token", data: { accessToken, refreshToken: newRefreshToken } };
    } catch (error) {
        return new Error((error as Error).message);
    }
};
