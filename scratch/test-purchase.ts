import 'dotenv/config';
import { TicketService } from '../server/services/ticket.service';
import { sequelize } from '../server/config/database';

async function test() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    const result = await TicketService.purchaseTicket(
      undefined,
      2,
      'qris',
      'Test Transporter Reuse',
      'anissaagungg@gmail.com',
      'General',
      'Social Media',
      10
    );

    console.log('Purchase executed successfully!');
    console.log(`Ticket count: ${result.ticketCount}`);
    console.log(`Tickets generated:`, result.tickets.map(t => t.qrCode));
    
    console.log('Waiting 15 seconds for background email processing to complete...');
    await new Promise(resolve => setTimeout(resolve, 15000));
  } catch (error) {
    console.error('Test purchase failed:', error);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

test();
