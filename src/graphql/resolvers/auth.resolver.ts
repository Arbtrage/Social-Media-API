import { registerUser, loginUser } from '../../modules/auth/auth.service';
import { BadRequestError, UnauthorizedError } from '../../utils/error';

export default {
  Mutation: {
    register: async (_: any, args: { fullName: string, username: string, email: string, password: string }) => {
      try {
        const response = await registerUser(args.fullName, args.username, args.email, args.password);
        return response;
      } catch (error: unknown) {
        return new BadRequestError((error as Error).message);
      }
    },
    login: async (_: any, args: { email: string, password: string }) => {
      try {
        const { message, data } = await loginUser(args.email, args.password);
        return { message: message, data: data };
      } catch (error: unknown) {
        throw new UnauthorizedError(`Login failed: ${(error as Error).message}`);
      }
    }
  }
};