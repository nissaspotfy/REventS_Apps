import { createConnection } from 'mysql2/promise';
import { User } from '../models/User';
import { Event } from '../models/Event';
import { Ticket } from '../models/Ticket';
import { sequelize } from '../config/database';

export async function seedDatabase() {
  try {
    // Connection parameters
    const dbHost = process.env.DB_HOST || '127.0.0.1';
    const dbPort = parseInt(process.env.DB_PORT || '3306', 10);
    const dbUser = process.env.DB_USER || 'root';
    const dbPassword = process.env.DB_PASSWORD || '';
    const dbName = process.env.DB_NAME || 'revents';

    // Create database if not exists
    console.log(`Ensuring database '${dbName}' exists...`);
    const connection = await createConnection({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.end();
    console.log(`Database '${dbName}' checked/created successfully.`);

    // Sync the models (alter:true adds new columns without dropping existing data)
    console.log('Synchronizing database models...');
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized successfully.');

    // Seed Users
    const userCount = await User.count();
    if (userCount === 0) {
      console.log('Seeding initial users...');
      await User.create({
        id: 1,
        email: 'john@example.com',
        password: 'e10adc3949ba59abbe56e057f20f883e', // md5 of 123456
        fullName: 'John Smith',
        role: 'audience',
        preferences: {
          categories: ['Music', 'Tech'],
          budget: '100-300k',
          frequency: 'Weekend',
          ageGroup: 'Young Adult'
        },
        profilePicUrl: null
      });
      console.log('Users seeded.');
    }

    // Seed Events
    const eventCount = await Event.count();
    if (eventCount === 0) {
      console.log('Seeding initial events...');
      const initialEvents = [
        {
          id: 1,
          title: "Summer Music Festival 2024",
          category: "Music",
          date: "Saturday, June 15",
          month: "JUN",
          day: "15",
          location: "Central Park, Jakarta",
          price: "IDR 250.000",
          image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80",
          isTrending: true,
          organizerId: 1,
          description: "Join us for the ultimate summer celebration in the heart of Jakarta. Experience live performances from top local and international artists across multiple stages, alongside culinary delights and interactive installations.",
          type: "offline",
          ticketType: "paid",
          ticketsSold: 342,
          revenue: 85500000,
          views: 4321,
          checkins: 280,
          status: 'active'
        },
        {
          id: 2,
          title: "Future of AI Workshop",
          category: "Tech",
          date: "Wednesday, July 10",
          month: "JUL",
          day: "10",
          location: "Tech Hub, BSD City",
          price: "Free",
          image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
          isTrending: false,
          organizerId: 1,
          description: "An interactive, hands-on workshop focused on the practical applications of Generative AI, Large Language Models, and Agentic workflows. Perfect for developers, product managers, and tech enthusiasts.",
          type: "offline",
          ticketType: "free",
          ticketsSold: 120,
          revenue: 0,
          views: 1500,
          checkins: 95,
          status: 'active'
        },
        {
          id: 3,
          title: "Street Food Carnival",
          category: "Food & Drink",
          date: "Friday, June 21",
          month: "JUN",
          day: "21",
          location: "Kota Tua, Jakarta",
          price: "IDR 50.000",
          image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
          isTrending: true,
          organizerId: 1,
          description: "Taste the best street food flavors Jakarta has to offer! Over 50 local vendors serving traditional snacks, modern fusion dishes, and signature drinks in the historical Kota Tua square.",
          type: "offline",
          ticketType: "paid",
          ticketsSold: 512,
          revenue: 25600000,
          views: 5600,
          checkins: 420,
          status: 'draft'
        },
        {
          id: 4,
          title: "Startup Networking Night",
          category: "Tech",
          date: "Thursday, June 27",
          month: "JUN",
          day: "27",
          location: "WeWork Co-working, Sudirman",
          price: "IDR 100.000",
          image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80",
          isTrending: false,
          organizerId: 1,
          description: "Connect with founders, angel investors, venture capitalists, and top tech talent in Jakarta. Share pitches, find partners, and discuss the latest industry trends in a relaxed professional environment.",
          type: "offline",
          ticketType: "paid",
          ticketsSold: 88,
          revenue: 8800000,
          views: 980,
          checkins: 70,
          status: 'past'
        },
        {
          id: 5,
          title: "Jazz Under the Stars",
          category: "Music",
          date: "Saturday, July 20",
          month: "JUL",
          day: "20",
          location: "Senayan Golf Club",
          price: "IDR 450.000",
          image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80",
          isTrending: false,
          organizerId: 1,
          description: "An elegant evening of jazz melodies under the open sky. Featuring performances by award-winning jazz ensembles, gourmet dining, and a selection of fine wines.",
          type: "offline",
          ticketType: "paid",
          ticketsSold: 190,
          revenue: 85500000,
          views: 2200,
          checkins: 150,
          status: 'active'
        },
        {
          id: 6,
          title: "Coffee Brewing Masterclass",
          category: "Food & Drink",
          date: "Sunday, June 30",
          month: "JUN",
          day: "30",
          location: "Roastery Lab, Tebet",
          price: "IDR 150.000",
          image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
          isTrending: false,
          organizerId: 1,
          description: "Learn the art and science of coffee brewing from expert baristas. Discover different beans, roasting profiles, and hands-on methods like V60, AeroPress, and French Press.",
          type: "offline",
          ticketType: "paid",
          ticketsSold: 45,
          revenue: 6750000,
          views: 620,
          checkins: 40,
          status: 'active'
        }
      ];

      await Event.bulkCreate(initialEvents);
      console.log('Events seeded.');
    }

    // Seed Tickets
    const ticketCount = await Ticket.count();
    if (ticketCount === 0) {
      console.log('Seeding initial tickets...');
      const initialTickets = [
        {
          id: 1,
          userId: 1,
          eventId: 1,
          purchaseDate: '2026-05-20T10:00:00Z',
          status: 'active',
          paymentMethod: 'qris',
          price: 'IDR 250.000',
          qrCode: 'TKT-1-1-654928',
          checkedIn: false,
          fullName: 'John Smith',
          email: 'john@example.com',
          audienceCategory: 'Umum',
          referralSource: 'Media Sosial'
        },
        {
          id: 2,
          userId: 1,
          eventId: 3,
          purchaseDate: '2026-05-18T14:30:00Z',
          status: 'past',
          paymentMethod: 'bca',
          price: 'IDR 50.000',
          qrCode: 'TKT-1-3-329841',
          checkedIn: true,
          fullName: 'John Smith',
          email: 'john@example.com',
          audienceCategory: 'Umum',
          referralSource: 'Media Sosial'
        }
      ];

      await Ticket.bulkCreate(initialTickets as any);
      console.log('Tickets seeded.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
