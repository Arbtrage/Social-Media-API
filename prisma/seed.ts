import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.create({
    data: {
      username: 'user1',
      email: 'user1@example.com',
      password: await bcrypt.hash('password1', 10),
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'user2',
      email: 'user2@example.com',
      password: await bcrypt.hash('password2', 10),
    },
  });

  const post1 = await prisma.post.create({
    data: {
      content: 'This is the first post by user1',
      media: null,
      author: { connect: { id: user1.id } },
    },
  });

  const post2 = await prisma.post.create({
    data: {
      content: 'This is the first post by user2',
      media: null,
      author: { connect: { id: user2.id } },
    },
  });

  await prisma.like.create({
    data: {
      post: { connect: { id: post1.id } },
      user: { connect: { id: user2.id } },
    },
  });

  await prisma.like.create({
    data: {
      post: { connect: { id: post2.id } },
      user: { connect: { id: user1.id } },
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Nice post!',
      post: { connect: { id: post1.id } },
      author: { connect: { id: user2.id } },
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Thank you!',
      post: { connect: { id: post1.id } },
      author: { connect: { id: user1.id } },
    },
  });

  await prisma.follower.create({
    data: {
      user: { connect: { id: user1.id } },
      follower: { connect: { id: user2.id } },
    },
  });

  await prisma.follower.create({
    data: {
      user: { connect: { id: user2.id } },
      follower: { connect: { id: user1.id } },
    },
  });

  console.log('Database has been seeded');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
