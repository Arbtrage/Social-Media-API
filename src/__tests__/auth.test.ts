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

const { mutate } = createTestClient(server as any);

describe('Authentication Tests', () => {
    let userId:string;

    beforeAll(async () => {
        await prisma.$connect();
    });

    afterAll(async () => {
        if (userId) {
            // Clean up by removing the test user created during the tests
            await prisma.user.delete({
                where: {
                    id: userId
                }
            });
        }
        await prisma.$disconnect();
    });

    describe('register mutation', () => {
        it('should register a new user', async () => {
            const REGISTER_MUTATION = `
                mutation Register($fullName: String!, $username: String!, $email: String!, $password: String!) {
                    register(fullName: $fullName, username: $username, email: $email, password: $password) {
                        message
                        data {
                            id
                            email
                        }
                    }
                }
            `;
            const variables = {
                fullName: "John Doe",
                username: "johndoe",
                email: "john.doe@example.com",
                password: "password123"
            };

            const response = await mutate({ mutation: REGISTER_MUTATION, variables });
            userId = response.data.register.data.id; // Store user ID for cleanup
            expect(response.data.register.message).toBe("Registration Successfull !!");
            expect(response.data.register.data.email).toBe(variables.email);
        });
    });

    describe('login mutation', () => {
        it('should login an existing user', async () => {
            const LOGIN_MUTATION = `
                mutation Login($email: String!, $password: String!) {
                    login(email: $email, password: $password) {
                        message
                        data {
                            accessToken
                            refreshToken
                        }
                    }
                }
            `;
            const variables = {
                email: "john.doe@example.com",
                password: "password123"
            };

            const response = await mutate({ mutation: LOGIN_MUTATION, variables });
            expect(response.data.login.message).toBe("Login Successfull !!");
            expect(response.data.login.data).toHaveProperty("accessToken");
            expect(response.data.login.data).toHaveProperty("refreshToken");
        });
    });
});
