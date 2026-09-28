const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Users
  const user1 = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@mail.com",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@mail.com",
    },
  });

  // Presences
  await prisma.presence.createMany({
    data: [
      {
        status: true,
        userId: user1.id,
      },
      {
        status: false,
        userId: user2.id,
      },
    ],
  });

  console.log("Seed terminé 🚀");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });