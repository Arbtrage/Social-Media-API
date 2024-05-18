import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const user1Password = await bcrypt.hash('password1', 10);
    const user2Password = await bcrypt.hash('password2', 10);

    const user1 = await prisma.user.create({
        data: {
            username: 'user1',
            email: 'user1@example.com',
            password: user1Password,
        },
    });

    const user2 = await prisma.user.create({
        data: {
            username: 'user2',
            email: 'user2@example.com',
            password: user2Password,
        },
    });

    const post1 = await prisma.post.create({
        data: {
            content: 'This is the first post by user1',
            userId: user1.id, // Linking author directly by ID
        },
    });

    const post2 = await prisma.post.create({
        data: {
            content: 'This is the first post by user2',
            userId: user2.id, // Linking author directly by ID
        },
    });

    await prisma.like.create({
        data: {
            postId: post1.id, // Direct ID linking
            userId: user2.id,
        },
    });

    await prisma.like.create({
        data: {
            postId: post2.id, // Direct ID linking
            userId: user1.id,
        },
    });

    await prisma.comment.create({
        data: {
            content: 'Nice post!',
            postId: post1.id, // Direct ID linking
            userId: user2.id,
        },
    });

    await prisma.comment.create({
        data: {
            content: 'Thank you!',
            postId: post1.id, // Direct ID linking
            userId: user1.id,
        },
    });

    await prisma.follower.create({
        data: {
            userId: user1.id, // Direct ID linking
            followerId: user2.id,
        },
    });

    await prisma.follower.create({
        data: {
            userId: user2.id, // Direct ID linking
            followerId: user1.id,
        },
    });

    console.log('Database has been seeded');
}

main()
  .catch(e => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
