const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// ================= USER CRUD =================

// CREATE USER
app.post("/users", async (req, res) => {
  const user = await prisma.user.create({
    data: req.body,
  });
  res.json(user);
});

// GET ALL USERS

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany({
    include: { presences: true },
  });
  res.json(users);
});

app.get("/bena", async (req, res) => {
  const users = await prisma.user.findMany({
    include: { presences: true },
  });
  res.json(users);
});

// ================= PRESENCE CRUD =================

// MARK PRESENCE
app.post("/presences", async (req, res) => {
  const presence = await prisma.presence.create({
    data: req.body,
  });
  res.json(presence);
});

// GET PRESENCES
app.get("/presences", async (req, res) => {
  const presences = await prisma.presence.findMany({
    include: { user: true },
  });
  res.json(presences);
});

// UPDATE PRESENCE
app.put("/presences/:id", async (req, res) => {
  const presence = await prisma.presence.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });
  res.json(presence);
});

// DELETE PRESENCE
app.delete("/presences/:id", async (req, res) => {
  await prisma.presence.delete({
    where: { id: Number(req.params.id) },
  });
  res.json({ message: "Deleted" });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});