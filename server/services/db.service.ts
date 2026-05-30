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
        },
        {
          id: 7,
          title: "Java Jazz Festival 2026",
          category: "Music",
          date: "Friday, June 12",
          month: "JUN",
          day: "12",
          location: "JIExpo Kemayoran, Jakarta",
          price: "IDR 950.000",
          image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
          isTrending: true,
          organizerId: 1,
          description: "The legendary Jakarta International Java Jazz Festival is back with stellar international lineups and local jazz legends. Catch multiple stages, delicious culinary options, and unforgettable memories.",
          type: "offline",
          ticketType: "paid",
          ticketsSold: 0,
          revenue: 0,
          views: 120,
          checkins: 0,
          status: 'active',
          isExternal: false,
          externalUrl: "https://www.javajazzfestival.com",
          externalProvider: "Loket.com"
        },
        {
          id: 8,
          title: "Bali Cultural & Arts Festival 2026",
          category: "Culture",
          date: "Wednesday, July 1",
          month: "JUL",
          day: "01",
          location: "Denpasar, Bali",
          price: "IDR 150.000",
          image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
          isTrending: false,
          organizerId: 1,
          description: "Immerse yourself in Balinese traditional dances, crafts, and theatrical performances in the heart of Bali's capital. Explore the beautiful heritage of Indonesia.",
          type: "offline",
          ticketType: "paid",
          ticketsSold: 0,
          revenue: 0,
          views: 85,
          checkins: 0,
          status: 'active',
          isExternal: false,
          externalUrl: "https://www.klook.com/en-ID/activity/99999-bali-cultural-arts-festival/",
          externalProvider: "Klook"
        },
        {
          id: 9,
          title: "Indonesia Tech Summit 2026",
          category: "Tech",
          date: "Monday, August 10",
          month: "AUG",
          day: "10",
          location: "JCC Senayan, Jakarta",
          price: "Free",
          image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
          isTrending: true,
          organizerId: 1,
          description: "Connect with tech leaders, startups, and investors across Indonesia. Discover cutting-edge innovations in AI, Web3, and sustainability. Featuring panel talks, workshops, and startup booths.",
          type: "offline",
          ticketType: "free",
          ticketsSold: 0,
          revenue: 0,
          views: 240,
          checkins: 0,
          status: 'active',
          isExternal: false,
          externalUrl: "https://www.eventbrite.com/e/indonesia-tech-summit-2026-tickets-987654321",
          externalProvider: "Eventbrite"
        }
      ];

      await Event.bulkCreate(initialEvents);
      console.log('Events seeded.');
    }

    // Ensure external events exist (Jakarta, Bali, Medan, Surabaya, Yogyakarta, Bandung)
    const externalEventsToSeed = [
      {
        id: 7,
        title: "Java Jazz Festival 2026",
        category: "Music",
        date: "Friday, June 12",
        month: "JUN",
        day: "12",
        location: "JIExpo Kemayoran, Jakarta, Indonesia",
        price: "IDR 950.000",
        image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
        isTrending: true,
        organizerId: 1,
        description: "The legendary Jakarta International Java Jazz Festival is back with stellar international lineups and local jazz legends. Catch multiple stages, delicious culinary options, and unforgettable memories.",
        type: "offline",
        ticketType: "paid",
        ticketsSold: 0,
        revenue: 0,
        views: 120,
        checkins: 0,
        status: 'active',
        isExternal: false,
        externalUrl: "https://www.javajazzfestival.com",
        externalProvider: "Loket.com"
      },
      {
        id: 8,
        title: "Bali Cultural & Arts Festival 2026",
        category: "Culture",
        date: "Wednesday, July 1",
        month: "JUL",
        day: "01",
        location: "Denpasar, Bali, Indonesia",
        price: "IDR 150.000",
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
        isTrending: false,
        organizerId: 1,
        description: "Immerse yourself in Balinese traditional dances, crafts, and theatrical performances in the heart of Bali's capital. Explore the beautiful heritage of Indonesia.",
        type: "offline",
        ticketType: "paid",
        ticketsSold: 0,
        revenue: 0,
        views: 85,
        checkins: 0,
        status: 'active',
        isExternal: false,
        externalUrl: "https://www.klook.com/en-ID/activity/99999-bali-cultural-arts-festival/",
        externalProvider: "Klook"
      },
      {
        id: 9,
        title: "Indonesia Tech Summit 2026",
        category: "Tech",
        date: "Monday, August 10",
        month: "AUG",
        day: "10",
        location: "JCC Senayan, Jakarta, Indonesia",
        price: "Free",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
        isTrending: true,
        organizerId: 1,
        description: "Connect with tech leaders, startups, and investors across Indonesia. Discover cutting-edge innovations in AI, Web3, and sustainability. Featuring panel talks, workshops, and startup booths.",
        type: "offline",
        ticketType: "free",
        ticketsSold: 0,
        revenue: 0,
        views: 240,
        checkins: 0,
        status: 'active',
        isExternal: false,
        externalUrl: "https://www.eventbrite.com/e/indonesia-tech-summit-2026-tickets-987654321",
        externalProvider: "Eventbrite"
      },
      {
        id: 10,
        title: "Medan Music & Food Festival 2026",
        category: "Music",
        date: "Saturday, September 5",
        month: "SEP",
        day: "05",
        location: "Lapangan Benteng, Medan, Indonesia",
        price: "IDR 75.000",
        image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80",
        isTrending: false,
        organizerId: 1,
        description: "Enjoy Medan's legendary culinary options and live music performances from top local bands.",
        type: "offline",
        ticketType: "paid",
        ticketsSold: 0,
        revenue: 0,
        views: 95,
        checkins: 0,
        status: 'active',
        isExternal: false,
        externalUrl: "https://www.loket.com/event/medan-music-food-2026",
        externalProvider: "Loket.com"
      },
      {
        id: 11,
        title: "Surabaya Tech Summit 2026",
        category: "Tech",
        date: "Thursday, October 15",
        month: "OCT",
        day: "15",
        location: "Grand City Convention, Surabaya, Indonesia",
        price: "Free",
        image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80",
        isTrending: false,
        organizerId: 1,
        description: "Join the largest tech conference in East Java, discussing AI development, startup growth, and technology ecosystem in Surabaya.",
        type: "offline",
        ticketType: "free",
        ticketsSold: 0,
        revenue: 0,
        views: 110,
        checkins: 0,
        status: 'active',
        isExternal: false,
        externalUrl: "https://www.loket.com/event/surabaya-tech-summit-2026",
        externalProvider: "Loket.com"
      },
      {
        id: 12,
        title: "Yogyakarta Heritage Walk 2026",
        category: "Culture",
        date: "Sunday, November 22",
        month: "NOV",
        day: "22",
        location: "Malioboro Square, Yogyakarta, Indonesia",
        price: "IDR 120.000",
        image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80",
        isTrending: false,
        organizerId: 1,
        description: "Explore the ancient historical streets of Yogyakarta and connect Javanese culture, local history, and street food.",
        type: "offline",
        ticketType: "paid",
        ticketsSold: 0,
        revenue: 0,
        views: 145,
        checkins: 0,
        status: 'active',
        isExternal: false,
        externalUrl: "https://www.klook.com/en-ID/activity/12345-yogyakarta-heritage-walk/",
        externalProvider: "Klook"
      },
      {
        id: 13,
        title: "Bandung Art & Design Expo 2026",
        category: "Culture",
        date: "Saturday, December 12",
        month: "DEC",
        day: "12",
        location: "Dago Tea House, Bandung, Indonesia",
        price: "IDR 50.000",
        image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80",
        isTrending: false,
        organizerId: 1,
        description: "Experience Bandung's creative designs, modern art pieces, and architectural masterpieces from national artists.",
        type: "offline",
        ticketType: "paid",
        ticketsSold: 0,
        revenue: 0,
        views: 130,
        checkins: 0,
        status: 'active',
        isExternal: false,
        externalUrl: "https://www.eventbrite.com/e/bandung-art-design-expo-2026-tickets-11223344",
        externalProvider: "Eventbrite"
      }
    ];

    for (const extEv of externalEventsToSeed) {
      const exists = await Event.findByPk(extEv.id);
      if (!exists) {
        console.log(`Seeding external event ID ${extEv.id}: ${extEv.title}...`);
        await Event.create(extEv as any);
      }
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

    // Ensure all physical event locations include ', Indonesia'
    try {
      const allDbEvents = await Event.findAll();
      for (const ev of allDbEvents) {
        if (ev.location && ev.location.toLowerCase() !== 'online' && !ev.location.toLowerCase().includes('indonesia')) {
          ev.location = `${ev.location}, Indonesia`;
          await ev.save();
        }
      }
      console.log('Event locations synced with Indonesia suffix.');
    } catch (locErr) {
      console.error('Error syncing event locations:', locErr);
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
