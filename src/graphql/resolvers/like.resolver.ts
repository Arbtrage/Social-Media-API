import { Context } from '../../context';
import { likePost, unlikePost } from '../../modules/like/like.service'
import { BadRequestError, UnauthorizedError } from '../../utils/error'


export default {
  Mutation: {
    likePost: async (_: any, { postId }: { postId: string }, context: Context) => {
      try {
        const response = await likePost(postId, context);
        return response;
      } catch (error:unknown) {
        throw new BadRequestError(`Failed to like post: ${(error as Error).message}`);
      }
    },
    unlikePost: async (_: any, { postId }: { postId: string }, context: Context) => {
      try {
        const response = await unlikePost(postId, context);
        return response;
      } catch (error:unknown) {
        throw new BadRequestError(`Failed to unlike post: ${(error as Error).message}`);
      }
    }
  }
};
