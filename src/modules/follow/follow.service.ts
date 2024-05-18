import { PrismaClient } from '@prisma/client';
import { Context } from '../../context';

const prisma = new PrismaClient();

export const followUser = async (userId: string, context: Context) => {
  try {
    if (!context.user) {
      throw new Error('Not authenticated');
    }

    const follower = await prisma.follower.create({
      data: {
        userId,
        followerId: context.user.userId
      },
      include: {
        user: true,
        follower: true
      }
    });

    return { message: "Followed successfully", data: follower };
  } catch (error) {
    return new Error((error as Error).message);
  }
};

export const unfollowUser = async (userId: string, context: Context) => {
  try {
    if (!context.user) {
      throw new Error('Not authenticated');
    }

    await prisma.follower.deleteMany({
      where: {
        userId,
        followerId: context.user.userId
      }
    });

    return true;
  } catch (error) {
    return new Error((error as Error).message);
  }
};
