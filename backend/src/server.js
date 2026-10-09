// DB: Server bootstrap with database connection and automatic seeding
import app from './app.js';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import { seedDatabase } from './seeds/seed.js';

const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();

    const PORT = ENV.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(` Fixora Backend API is running on port: ${PORT}`);
      console.log(` Environment: ${ENV.NODE_ENV}`);
      console.log(` Ready for customer, provider, and admin workflows.`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error(`[SERVER FATAL ERROR]: ${error.message}`);
    process.exit(1);
  }
};

startServer();
