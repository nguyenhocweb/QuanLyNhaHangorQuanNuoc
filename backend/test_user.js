import { getUser } from './src/modules/public/auth/repositories/User.db.js';

async function test() {
    const user = await getUser({ email: "customer2@example.com" });
    console.log(JSON.stringify(user, null, 2));
}

test().catch(console.error);
