require('module-alias/register');
const express = require('express');
const hospitalRoutes = require('@base/routes/hospitalRoutes');
const userRoutes = require('@base/routes/userRoutes');
const authRoutes = require('@base/routes/authRoutes');
const { prisma } = require('@base/config/prismaconfig');
// const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


// Routes
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Health Check
app.get("/", async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    res.send(
      `API is running. Connected to the database. User count: ${userCount}`
    );
  } catch (error) {
    console.error("Database connection failed:", error.message);
    res.status(500).send(`Database connection failed: ${error.message}`);
  }
});
app.get('/', (req, res) => {
  res.status(200).send('Server is up and running!');
});
// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("Prisma disconnected");
  process.exit(0);
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
