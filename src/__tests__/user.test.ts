import { createTestClient } from 'apollo-server-testing';
import { ApolloServer } from 'apollo-server-express';
import { PrismaClient } from '@prisma/client';
import { createContext } from '../context';
import { schema } from '../graphql'; 

const prisma = new PrismaClient();
const mockReq = {
    headers: {
        authorization: 'Bearer fake-jwt-token'
    }
};
const context = () => ({
    req: mockReq
});

jest.mock('../utils/prisma', () => {
    const originalModule = jest.requireActual('../utils/prisma');
    return {
        __esModule: true,
        default: originalModule.default,
    };
});

const server = new ApolloServer({
    schema,
    context: context,
    formatError: (err) => ({ message: err.message, status: 400 }),
});

const { query } = createTestClient(server as any);

describe('User Service Tests', () => {
    beforeAll(async () => {
        await prisma.$connect();
    });

    let userId: string;

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('users query', () => {
        it('should fetch all users', async () => {
            const USERS_QUERY = `
                query {
                    users {
                        message
                        data {
                            id
                            email
                        }
                    }
                }
            `;

            const response = await query({ query: USERS_QUERY });
            userId=response.data.users.data[0].id
            expect(response.data.users.message).toBe("Users found");
            expect(Array.isArray(response.data.users.data)).toBeTruthy();
        });
    });

    describe('user query', () => {
        it('should fetch a specific user by ID', async () => {
            const USER_QUERY = `
                query GetUser($id: ID!) {
                    user(id: $id) {
                        message
                        data {
                            id
                            username
                        }
                    }
                }
            `;
            const variables = { id: userId};

            const response = await query({ query: USER_QUERY, variables });
            expect(response.data.user.message).toBe("User found");
            expect(response.data.user.data.id).toBe(variables.id);
        });
    });
});
