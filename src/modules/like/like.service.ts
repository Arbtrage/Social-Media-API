import { PrismaClient } from '@prisma/client';
import { Context } from '../../context';

const prisma = new PrismaClient();

export const likePost = async (postId: string, context: Context) => {
  try {
    if (!context.user) {
      throw new Error('Not authenticated');
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId
      },
      select: {
        userId: true
      }
    });

    if (!post) throw new Error('Post not found');
    if (post?.userId === context.user.userId) {
      throw new Error('Cannot like your own post');
    }

    const like = await prisma.like.create({
      data: {
        postId,
        userId: context.user.userId
      },
      include: {
        post: true,
        user: true
      }
    });

    await prisma.post.update({
      where: {
        id: postId
      },
      data: {
        likesCount: {
          increment: 1
        }
      }
    });
    return { message: "Liked Successfully" };
  } catch (error) {
    return new Error((error as Error).message);
  }
};

export const unlikePost = async (postId: string, context: Context) => {
  try {
    if (!context.user) {
      throw new Error('Not authenticated');
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId
      },
      select: {
        userId: true
      }
    });

    await prisma.post.update({
      where: {
        id: postId
      },
      data: {
        likesCount: {
          decrement: 1
        }
      }
    });

    if (!post) throw new Error('Post not found');
    if (post?.userId === context.user.userId) {
      throw new Error('Operation not allowed!!');
    }

    await prisma.like.deleteMany({
      where: {
        postId,
        userId: context.user.userId
      }
    });

    return { message: "Unliked Successfully" };
  } catch (error) {
    return new Error((error as Error).message);
  }

};
