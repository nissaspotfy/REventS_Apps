import { sequelize } from './server/config/database';

async function fixDb() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    // Explicitly modify the column to be NULL
    await sequelize.query('ALTER TABLE Tickets MODIFY userId INT NULL;');
    console.log('Tickets table userId column successfully modified to allow NULL.');
    
  } catch (error) {
    console.error('Unable to connect to the database or modify table:', error);
  } finally {
    await sequelize.close();
  }
}

fixDb();
