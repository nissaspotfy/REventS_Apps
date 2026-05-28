import { Event } from '../server/models/Event';
import { sequelize } from '../server/config/database';

async function run() {
  try {
    await sequelize.authenticate();
    const match = await Event.findOne({ where: { title: 'Mari bergabung' } });
    if (match) {
      console.log('--- FOUND MATCH ---');
      console.log(`ID: ${match.id} | Title: "${match.title}" | Status: ${match.status}`);
    } else {
      console.log('--- NO MATCH FOUND ---');
    }
  } catch (err) {
    console.error(err);
  } finally {
    await sequelize.close();
  }
}

run();
