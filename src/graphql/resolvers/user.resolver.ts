import { getAllUsers, getUserById, refreshToken,getUserByName } from '../../modules/user/user.service';
import { BadRequestError, UnauthorizedError } from '../../utils/error'
import { Context } from '../../context';

export default {
  Query: {
    users: async () => {
      try {
        const response = await getAllUsers();
        return response;
      } catch (error: unknown) {
        throw new BadRequestError(`Failed to fetch users: ${(error as Error).message}`);
      }
    },
    user: async (_: any, { id }: { id: string },context: Context) => {
      try {
        const response = await getUserById(id,context);
        return response;
      } catch (error: unknown) {
        throw new BadRequestError(`Failed to fetch user: ${(error as Error).message}`);
      }
    },
    usersByUsername: async (_: any, { username }: { username: string },context: Context) => {
      try {
        const response = await getUserByName(username,context);
        return response;
      } catch (error: unknown) {
        throw new BadRequestError(`Failed to fetch user: ${(error as Error).message}`);
      }
    }
  },
  Mutation: {
    refreshToken: async (_: any, args: { refreshToken: string },context: Context) => {
      try {
        const response = await refreshToken(args.refreshToken, context);
        return response;
      } catch (error: unknown) {
        throw new UnauthorizedError(`Token refresh failed: ${(error as Error).message}`);
      }
    }
  }
};
