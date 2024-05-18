
import { Context } from '../../context';
import { followUser, unfollowUser } from '../../modules/follow/follow.service';
import { BadRequestError, UnauthorizedError } from '../../utils/error'

export default {
  Mutation: {
    followUser: async (_: any, { userId }: { userId: string }, context: Context) => {
      try {
        const response = await followUser(userId, context);
        return response;
      } catch (error:unknown) {
        throw new BadRequestError(`Failed to follow user: ${(error as Error).message}`);
      }
    },
    unfollowUser: async (_: any, { userId }: { userId: string }, context: Context) => {
      try {
        const response = await unfollowUser(userId, context);
        return response;
      } catch (error:unknown) {
        throw new BadRequestError(`Failed to follow user: ${(error as Error).message}`);
      }
    }
  }
};
