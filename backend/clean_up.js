import { prisma } from './src/databases/init.mongodb.js';

async function cleanUp() {
  try {
    console.log('Fetching all upgrade requests...');
    const requests = await prisma.upgradeRequest.findMany();
    let deletedCount = 0;

    for (const req of requests) {
      const user = await prisma.user.findUnique({
        where: { id: req.userId }
      });
      if (!user) {
        console.log(`User not found for UpgradeRequest ${req.id} (userId: ${req.userId}). Deleting request...`);
        await prisma.upgradeRequest.delete({
          where: { id: req.id }
        });
        deletedCount++;
      }
    }
    
    console.log(`Clean up finished. Deleted ${deletedCount} orphaned UpgradeRequest(s).`);
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    // Assuming the app gracefully handles disconnects, or we just let process exit.
    process.exit(0);
  }
}

cleanUp();
