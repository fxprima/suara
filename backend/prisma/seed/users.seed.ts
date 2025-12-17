import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as argon2 from 'argon2'

const prisma = new PrismaClient();

type SeedUsersOptions = {
  count?: number;
  password?: string; 
  cleanFirst?: boolean; 
};

export async function seedSuperUser() {
  const username = 'admin';
  const email = 'admin@gmail.com';
  const passwordPlain = 'admin123';

  const hashed = await argon2.hash(passwordPlain);

  const exists = await prisma.users.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
    select: { id: true },
  });

  if (exists) {
    console.log('[seedSuperUser] admin already exists, skipped');
    return { created: false };
  }

  const user = await prisma.users.create({
    data: {
      username,
      email,
      password: hashed,
      firstname: 'admin',
      lastname: 'admin',
      isAdmin: true,
      isVerified: true,
      isActive: true,
      dob: faker.date.birthdate({ min: 25, max: 40, mode: 'age' }),
      biography: faker.lorem.sentence(),
      location: faker.location.city(),
      website: faker.internet.url(),
      lastLogin: new Date(),
      createdAt: new Date(),
    },
  });

  console.log('[seedSuperUser] admin created:', user.email);
  return { created: true, userId: user.id };
}


export async function seedUsers(opts: SeedUsersOptions = {}) {
  const count = opts.count ?? 50;
  const passwordPlain = opts.password ?? 'password123';
  const cleanFirst = opts.cleanFirst ?? false;

  if (cleanFirst) 
    await prisma.users.deleteMany({});
  

  const hashed = await argon2.hash(passwordPlain);

  const created: string[] = [];
  const skipped: string[] = [];

  for (let i = 0; i < count; i++) {
    const firstname = faker.person.firstName();
    const lastname = faker.person.lastName();
    const username = faker.internet
      .username({ firstName: firstname, lastName: lastname })
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '_') + `_${i}`;

    const email = `user${i}_${faker.string.alphanumeric(6).toLowerCase()}@test.local`;

    const usePhone = faker.number.int({ min: 0, max: 100 }) > 25; 
    const phone = usePhone ? `08${faker.string.numeric(10)}` : null;

    const dob = faker.date.birthdate({ min: 18, max: 40, mode: 'age' });

    const isVerified = faker.number.int({ min: 0, max: 100 }) > 70; 
    const isAdmin = i === 0; 
    const isActive = faker.number.int({ min: 0, max: 100 }) > 5; 

    const data = {
      username,
      firstname,
      lastname,
      email,
      password: hashed,
      biography: faker.number.int({ min: 0, max: 100 }) > 30 ? faker.lorem.sentence() : null,
      location: faker.number.int({ min: 0, max: 100 }) > 50 ? faker.location.city() : null,
      website: faker.number.int({ min: 0, max: 100 }) > 70 ? faker.internet.url() : null,
      phone,
      dob,
      isVerified,
      isActive,
      isAdmin,
      lastLogin: faker.date.recent({ days: 30 }),
      createdAt: faker.date.past({ years: 1 }),
    } satisfies Parameters<typeof prisma.users.create>[0]['data'];

    const exists = await prisma.users.findFirst({
      where: {
        OR: [{ email }, { username }, ...(phone ? [{ phone }] : [])],
      },
      select: { id: true },
    });

    if (exists) {
      skipped.push(email);
      continue;
    }

    await prisma.users.create({ data });
    created.push(email);
  }

  return { createdCount: created.length, skippedCount: skipped.length, created, skipped };
}

if (require.main === module) {
  (async () => {
    await seedSuperUser();
    await seedUsers({ count: 50, password: 'password123', cleanFirst: false });

    console.log('[seed] all done');
  })()
    .catch((e) => {
      console.error('[seed] error:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
