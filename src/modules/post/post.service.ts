import prisma from '../../utils/prisma';
import { Context } from '../../context';



export const getPosts = async () => {
    try {
        const posts = await prisma.post.findMany({
            include: {
                author: true,
                likes: true,
                comments: true
            }
        });

        if (posts.length === 0) throw new Error('No posts found');
        return { message: "Posts fetched successfully", data: posts };
    } catch (error) {
        return new Error((error as Error).message);
    }
};

export const getPost = async (id: string, context: Context) => {
    try {
        if (!context.user) {
            throw new Error('Not authenticated');
        }
        const post = await prisma.post.findUnique({
            where: { id }
        });
        if (!post) throw new Error('Post not found');
        return { message: "Post fetched successfully", data: post };
    } catch (error) {
        return new Error((error as Error).message);
    }
};

export const createPost = async (content: string, media: string | undefined, commentsEnabled: boolean, context: Context, scheduledAt: string, byTime: boolean) => {
    try {
        if (!context.user) {
            throw new Error('Not authenticated');
        }
        let scheduledDate;

        if (byTime) {
            const minutes = parseInt(scheduledAt, 10);
            if (isNaN(minutes)) {
                throw new Error('Invalid scheduled time. Please provide a valid number of minutes.');
            }
            const now = new Date();
            scheduledDate = new Date(now.getTime() + minutes * 60000);
        } else {
            scheduledDate = scheduledAt ? new Date(scheduledAt) : new Date();
            if (isNaN(scheduledDate.getTime()) || scheduledDate < new Date()) {
                throw new Error('Invalid scheduled date. Please provide a valid future date.');
            }
        }

        const post = await prisma.post.create({
            data: {
                content,
                media,
                userId: context.user.userId,
                createdAt: new Date(),
                commentsEnabled,
                scheduledAt: scheduledDate,
                active: scheduledAt ? true : false
            },
            include: {
                author: true,
                likes: true,
                comments: true
            }
        });
        return { message: "Post created successfully", data: post };
    } catch (error) {
        return new Error((error as Error).message);
    }
};

export const deletePost = async (id: string, context: Context) => {
    try {
        if (!context.user) {
            throw new Error('Not authenticated');
        }

        const post = await prisma.post.findUnique({ where: { id } });

        if (!post) {
            throw new Error('Post not found');
        }

        if (post?.userId !== context.user.userId) {
            throw new Error('Not authorized to delete this post');
        }

        await prisma.post.delete({ where: { id } });

        return { message: "Post deleted successfully", data: true };

    } catch (error) {
        return new Error((error as Error).message);
    }
};

export const toggleComments = async (postId: string, enabled: boolean, context: Context) => {
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

        if (post.userId !== context.user.userId) {
            throw new Error('Not authorized to change comment settings for this post');
        }
        const updatedPost = await prisma.post.update({
            where: { id: postId },
            data: { commentsEnabled: enabled },
            include: {
                author: true,
                likes: true,
                comments: true
            }
        });
        return { message: "Comment settings toggled successfully", data: updatedPost };
    } catch (error) {
        return new Error((error as Error).message);
    }
};

export const getFeed = async (context: Context) => {
    try {

        if (!context.user) {
            throw new Error('Not authenticated');
        }

        let followingIds = (
            await prisma.follower.findMany({
                where: { followerId: context.user.userId },
                select: { userId: true }
            })
        ).map(follower => follower.userId);
        followingIds.push(context.user.userId);

        const posts = await prisma.post.findMany({
            where: { userId: { in: followingIds } },
            include: {
                author: true,
                likes: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                id: true,
                                fullName: true,
                                username: true,
                                profilePhoto: true
                            }
                        }
                    }
                },
                comments: {
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        author: {
                            select: {
                                id: true,
                                fullName: true,
                                username: true,
                                profilePhoto: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        const feedData = posts.map(post => ({
            ...post,
            likeCount: post.likes.length,
            commentCount: post.comments.length
        }));
        return { message: "Feed fetched successfully", data: feedData };
    } catch (error) {
        return new Error((error as Error).message);
    }
};
