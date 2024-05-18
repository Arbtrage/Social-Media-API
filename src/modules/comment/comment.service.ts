import prisma from '../../utils/prisma';
import { Context } from '../../context';

export const createComment = async (postId: string, content: string, context: Context) => {
    try {
        if (!context.user) {
            throw new Error('Not authenticated');
        }

        const post = await prisma.post.findUnique({
            where: { id: postId }
        });

        if (!post) {
            throw new Error('Post not found');
        }

        if (!post.commentsEnabled) {
            throw new Error('Comments are disabled for this post');
        }
        const comment = await prisma.comment.create({
            data: {
                content,
                postId,
                userId: context.user.userId,
                createdAt: new Date()
            },
            include: {
                post: true,
                author: true
            }
        });
        await prisma.post.update({
            where: {
                id: postId
            },
            data: {
                commentsCount: {
                    increment: 1
                }
            }
        });
        return { message: "Comment created successfully", data: comment };

    } catch (error) {
        return new Error((error as Error).message);
    }
};

export const editComment = async (id: string, content: string, context: Context) => {
    try {
        if (!context.user) {
            throw new Error('Not authenticated');
        }

        const comment = await prisma.comment.findUnique({
            where: { id }
        });

        if (!comment) {
            throw new Error('Comment not found');
        }

        if (comment.userId !== context.user.userId) {
            throw new Error('Not authorized to edit this comment');
        }

        const commentData = await prisma.comment.update({
            where: { id },
            data: { content }
        });
        return { message: "Comment updated successfully", data: commentData };

    } catch (error) {
        return new Error((error as Error).message);
    }
};

export const deleteComment = async (id: string, context: Context) => {
    try {
        if (!context.user) {
            throw new Error('Not authenticated');
        }

        const comment = await prisma.comment.findUnique({ where: { id }, select: { postId: true, userId: true } });

        if (!comment) {
            throw new Error('Comment not found');
        }

        if (comment.userId !== context.user.userId) {
            throw new Error('Not authorized to delete this comment');
        }

        await prisma.comment.delete({ where: { id } });

        await prisma.post.update({
            where: {
                id: comment.postId
            },
            data: {
                commentsCount: {
                    decrement: 1
                }
            }
        });

        return { message: "Comment deleted successfully", data: true };

    } catch (error) {
        return new Error((error as Error).message);
    }
};
