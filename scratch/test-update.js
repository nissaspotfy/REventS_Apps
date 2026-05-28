const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('revents', 'user_revents', 'REventSApp2026', {
  host: '127.0.0.1',
  dialect: 'mysql',
  logging: false
});

async function run() {
  try {
    const [results] = await sequelize.query("SELECT * FROM events WHERE id = 1");
    console.log("Before update:", results[0]);
    
    await sequelize.query("UPDATE events SET title = 'Summer Music Festival 2024 - Updated' WHERE id = 1");
    
    const [resultsAfter] = await sequelize.query("SELECT * FROM events WHERE id = 1");
    console.log("After update:", resultsAfter[0]);
    
    // Restore
    await sequelize.query("UPDATE events SET title = 'Summer Music Festival 2024' WHERE id = 1");
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await sequelize.close();
  }
}
run();
