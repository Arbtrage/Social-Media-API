
import { Context } from '../../context';
import { createComment, editComment, deleteComment } from '../../modules/comment/comment.service';
import { BadRequestError, UnauthorizedError } from '../../utils/error';

export default {
    Mutation: {
        createComment: async (_: any, { postId, content }: { postId: string, content: string }, context: Context) => {
            try {
                const response = await createComment(postId, content, context);
                return response;
            } catch (error: unknown) {
                throw new BadRequestError(`Failed to create comment: ${(error as Error).message}`);
            }
        },
        editComment: async (_: any, { id, content }: { id: string, content: string }, context: Context) => {
            try {
                const response = await editComment(id, content, context);
                return response;
            } catch (error: unknown) {
                throw new BadRequestError(`Failed to edit comment: ${(error as Error).message}`);
            }
        },
        deleteComment: async (_: any, { id }: { id: string }, context: Context) => {
            try {
                const response = await deleteComment(id, context);
                return response;
            } catch (error: unknown) {
                throw new BadRequestError(`Failed to delete comment: ${(error as Error).message}`);
            }
        }
    }
};
