import { Sequelize, DataTypes } from 'sequelize';

async function run() {
  const sequelize = new Sequelize('revents', 'root', '', {
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql',
    logging: false
  });

  try {
    await sequelize.authenticate();
    console.log('Connected to ROOT instance!');
    const [results] = await sequelize.query('SELECT id, title, status FROM events');
    console.log('--- ROOT DB EVENTS ---');
    results.forEach((e: any) => {
      console.log(`ID: ${e.id} | Title: "${e.title}" | Status: ${e.status}`);
    });
    console.log('----------------------');
  } catch (err: any) {
    console.error('Root connection failed:', err.message);
  } finally {
    await sequelize.close();
  }
}

run();
