import { ApolloError } from 'apollo-server-express';

class BadRequestError extends ApolloError {
  constructor(message: string) {
    super(message, 'BAD_REQUEST');

    Object.defineProperty(this, 'name', { value: 'BadRequestError' });
  }
}

class UnauthorizedError extends ApolloError {
  constructor(message: string) {
    super(message, 'UNAUTHORIZED');

    Object.defineProperty(this, 'name', { value: 'UnauthorizedError' });
  }
}

export { BadRequestError, UnauthorizedError };
