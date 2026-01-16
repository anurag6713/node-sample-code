import db from '@db';

beforeAll(async () => {
    await db.connect();
});
