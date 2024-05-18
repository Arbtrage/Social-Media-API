import prisma from "./prisma";
import cron from 'node-cron';

async function checkAndActivatePosts() {
    const now = new Date();

    try {
        const postsToActivate = await prisma.post.findMany({
            where: {
                scheduledAt: {
                    lte: now
                },
                active: false
            }
        });
        const activationPromises = postsToActivate.map(post =>
            prisma.post.update({
                where: { id: post.id },
                data: { active: true }
            })
        );

        await Promise.all(activationPromises);

        console.log(`Activated ${activationPromises.length} posts at ${now}`);
    } catch (error) {
        console.error('Error activating posts:', error);
    }
}

cron.schedule('* * * * *', checkAndActivatePosts, {
    scheduled: true,
    timezone: "UTC"
});