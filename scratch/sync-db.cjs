const { sequelize } = require('../server/config/database');
const { Event } = require('../server/models/Event');

async function sync() {
  try {
    console.log("Connecting to database and synchronizing models...");
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Database synchronized successfully! The columns fullDescription and capacity are now created.");
  } catch (error) {
    console.error("Failed to sync database:", error);
  } finally {
    await sequelize.close();
  }
}
sync();
