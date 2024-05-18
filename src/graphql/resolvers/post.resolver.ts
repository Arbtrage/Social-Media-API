import { BadRequestError, UnauthorizedError } from '../../utils/error'
import { Context } from '../../context';
import { createPost, deletePost, getPost, getPosts, getFeed, toggleComments } from '../../modules/post/post.service';

export default {
    Query: {
        posts: async (_: any, __: any) => {
            try {
                const response = await getPosts();
                return response
            } catch (error) {
                throw new BadRequestError(`Failed to get all post: ${(error as Error).message}`);
            }
        },
        post: async (_: any, { id }: { id: string }, context: Context) => {
            try {
                const response = await getPost(id, context);
                return response
            } catch (error) {
                throw new BadRequestError(`Failed to fetch post: ${(error as Error).message}`);
            }
        },
        feed: async (_: any, __: any, context: Context) => {
            try {
                const response = await getFeed(context);
                return response
            } catch (error) {
                throw new BadRequestError(`Failed to get feed: ${(error as Error).message}`);
            }
        }
    },
    Mutation: {
        createPost: async (_: any, { content, media, commentsEnabled,scheduledAt,byTime }: { content: string, media?: string, commentsEnabled: boolean,scheduledAt:string,byTime:boolean }, context: Context) => {
            try {
                console.log(scheduledAt)
                const response = await createPost(content, media, commentsEnabled, context,scheduledAt,byTime);
                return response
            } catch (error) {
                throw new BadRequestError(`Failed to create post: ${(error as Error).message}`);
            }
        },
        deletePost: async (_: any, { id }: { id: string }, context: Context) => {
            try {
                const response = await deletePost(id, context);
                return response
            } catch (error) {
                throw new BadRequestError(`Failed to delete post: ${(error as Error).message}`);
            }
        },
        toggleComments: async (_: any, { postId, enabled }: { postId: string, enabled: boolean }, context: Context) => {
            try {
                const response = await toggleComments(postId, enabled, context);
                return response
            } catch (error) {
                throw new BadRequestError(`Failed to toggle setting: ${(error as Error).message}`);
            }
        }
    }
};
