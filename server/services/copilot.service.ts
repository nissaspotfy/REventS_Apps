import { GoogleGenAI } from '@google/genai';

export class CopilotService {
  private static ai: GoogleGenAI | null = null;

  private static getAIInstance(): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      console.warn('GEMINI_API_KEY is not configured. AI Co-Pilot will run in mock mode.');
      return null;
    }
    
    if (!this.ai) {
      this.ai = new GoogleGenAI({ apiKey });
    }
    return this.ai;
  }

  static async generateEventDraft(userPrompt: string, existingTitles: string[] = []) {
    const ai = this.getAIInstance();
    
    if (!ai) {
      // Mock mode fallback
      return this.getMockResponse(userPrompt, existingTitles);
    }
 
    try {
      const titlesList = existingTitles.length > 0 ? existingTitles.map(t => `"${t}"`).join(', ') : 'None';
      const prompt = `
You are an advanced AI Co-Pilot for the REventS event management platform. 
The user wants to organize an event and wrote this idea: "${userPrompt}".

IMPORTANT: The system already has the following event titles in the database: [${titlesList}]. 
Your generated event title MUST NOT match or be extremely similar to any of these existing titles. Create a unique, distinct title.

Generate a rich, structured event proposal draft.
Do NOT use markdown asterisks (*) for bullet points or bold text. Use emojis to make it beautiful and engaging. Do not include the word "timeline" or "agenda" if unnecessary.
Return a valid JSON object matching the EXACT structure below (do not include markdown wrapper, return raw JSON string):
{
  "title": "Stunning Unique Event Title",
  "category": "Tech" | "Music" | "Food & Drink" | "Culture" | "Sports" (choose the single most relevant category),
  "description": "A short, engaging 1-2 sentence description summarizing the event.",
  "fullDescription": "A detailed event description formatted clearly. It MUST follow this structure: 1. Opening paragraph 2. Body containing the theme, time, and location 3. Closing paragraph ending with 'Regards, [Organizer]'. Emphasize the core value, activities. Make it clean and attractive. No asterisks.",
  "date": "YYYY-MM-DD" (Suggest a realistic future date),
  "time": "HH:MM AM - HH:MM PM" (Suggest a realistic time duration),
  "location": "Detailed realistic physical address or 'Online'",
  "theme": "A creative theme for the event",
  "price": "IDR 150.000" or "Free",
  "capacity": 100 (numeric value)
}
`;
 
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              title: { type: 'STRING' },
              category: { type: 'STRING' },
              description: { type: 'STRING' },
              fullDescription: { type: 'STRING' },
              date: { type: 'STRING' },
              time: { type: 'STRING' },
              location: { type: 'STRING' },
              theme: { type: 'STRING' },
              price: { type: 'STRING' },
              capacity: { type: 'INTEGER' }
            },
            required: ['title', 'category', 'description', 'fullDescription', 'date', 'time', 'location', 'theme', 'price', 'capacity']
          }
        }
      });
 
      const responseText = response.text || '';
      
      // Attempt to parse JSON
      return JSON.parse(responseText);
    } catch (err: any) {
      console.error('Error generating draft from Gemini API:', err);
      if (err?.status === 429 || err?.message?.includes('429') || err?.message?.includes('quota')) {
        return {
          title: "⚠️ API Quota Exceeded (Limit 429)",
          category: "Tech",
          description: "Your Gemini API Key has run out of request quota. Please wait about 1 minute and try again.",
          fullDescription: "An error occurred: Quota Exceeded for model gemini-2.5-flash. The API system rejected the request due to too many requests. Please wait a moment or check your Google Cloud billing.",
          date: "2026-12-31",
          time: "00:00 - 00:00",
          location: "API Error",
          theme: "Quota Exceeded",
          price: "0",
          capacity: 0
        };
      }
      // Fallback on other failure
      return this.getMockResponse(userPrompt, existingTitles);
    }
  }
 
  private static getMockResponse(userPrompt: string, existingTitles: string[] = []) {
    // Generate a reasonable mock draft if API fails or is not available
    const categories = ['Tech', 'Music', 'Food & Drink', 'Culture', 'Sports'];
    let selectedCategory = 'Tech';
    
    const lowerPrompt = userPrompt.toLowerCase();
    if (lowerPrompt.includes('music') || lowerPrompt.includes('concert') || lowerPrompt.includes('jazz') || lowerPrompt.includes('band')) {
      selectedCategory = 'Music';
    } else if (lowerPrompt.includes('food') || lowerPrompt.includes('drink') || lowerPrompt.includes('coffee') || lowerPrompt.includes('eat') || lowerPrompt.includes('cooking')) {
      selectedCategory = 'Food & Drink';
    } else if (lowerPrompt.includes('culture') || lowerPrompt.includes('art') || lowerPrompt.includes('exhibition') || lowerPrompt.includes('museum')) {
      selectedCategory = 'Culture';
    } else if (lowerPrompt.includes('sport') || lowerPrompt.includes('run') || lowerPrompt.includes('game') || lowerPrompt.includes('match') || lowerPrompt.includes('football')) {
      selectedCategory = 'Sports';
    }
 
    let title = `Next-Gen ${selectedCategory} Meetup 2026`;
    if (existingTitles.includes(title)) {
      title = `Next-Gen ${selectedCategory} Meetup 2026 (Edition ${Math.floor(Math.random() * 1000) + 1})`;
    }

    return {
      title: title,
      category: selectedCategory,
      description: `An engaging gathering focusing on ${userPrompt.substring(0, 50)}...`,
      fullDescription: `🎉 Special Event: ${title}\n\n✨ Main Concept:\nInspired by your idea: "${userPrompt}", this event brings together professionals, fans, and enthusiasts to connect, learn, and share brilliant ideas.\n\n🎯 Event Highlights:\n🚀 Theme: Future Forward\n🚀 Time: 09:00 AM - 04:00 PM\n🚀 Location: SCBD District, South Jakarta\n\n📌 Organizer Notes:\n✅ Prepare a strategic venue\n✅ Spread digital marketing\n✅ Open REventS ticket registration now!\n\nRegards, Organizer`,
      date: '2026-12-24',
      time: '09:00 AM - 04:00 PM',
      location: 'SCBD District, Jakarta Selatan',
      theme: 'Future Forward',
      price: 'Free',
      capacity: 100
    };
  }

  static async chatMatchmaker(message: string, history: any[] = [], eventsSummary: any[] = []) {
    const ai = this.getAIInstance();
    
    // Format real active events as context text
    const eventsText = eventsSummary.length > 0
      ? eventsSummary.map(e => `- [ID: ${e.id}] "${e.title}" (Category: ${e.category}) on ${e.date} at ${e.location}, price: ${e.price}. Description: ${e.description}`).join('\n')
      : 'No active events currently available.';

    if (!ai) {
      // Mock mode fallback for Chatbot
      return this.getMockChatResponse(message, eventsSummary);
    }

    try {
      const contents = [
        ...history.map(msg => ({
          role: msg.role === 'ai' ? 'model' : 'user',
          parts: [{ text: msg.text }]
        })),
        {
          role: 'user',
          parts: [{ text: message }]
        }
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
          systemInstruction: `You are the REventS AI Matchmaker Assistant. You help users find and recommend events on REventS.
CRITICAL RULES:
1. You MUST ONLY recommend events from the active database list provided below. DO NOT recommend, invent, or suggest any external, mock, or invented events under any circumstances!
2. If there are no events in the database list matching the user's request (for example, if they ask for music concerts but none are in the list), explicitly state in their language that no such events are currently available on REventS, and then suggest 1 or 2 of the most popular available events from the database list instead.
3. Every recommendation MUST reference the exact event title, date, location, and price from the database list, so the user can easily find it.
4. DO NOT reference or mention any event name, location, or details that are not in the database list below.

Here is the EXCLUSIVE list of active events in our database:
${eventsText}

Reply in the language the user used (Indonesian or English). Keep your response under 3 paragraphs.`
        }
      });

      return response.text || "Sorry, I couldn't process your request.";
    } catch (err) {
      console.error('Error generating chat from Gemini API:', err);
      return this.getMockChatResponse(message, eventsSummary);
    }
  }

  private static getMockChatResponse(message: string, eventsSummary: any[] = []): string {
    const lowerMessage = message.toLowerCase();
    const isIndo = /konser|musik|makan|kuliner|seminar|acara|halo|hai|rekomendasi|saya|kamu|apa|di|pada/.test(lowerMessage);

    // Try to find a matching event from the database first
    const matched = eventsSummary.find(e => 
      e.title.toLowerCase().includes(lowerMessage) || 
      e.description.toLowerCase().includes(lowerMessage) || 
      e.category.toLowerCase().includes(lowerMessage)
    );

    if (matched) {
      if (isIndo) {
        return `🎉 Saya merekomendasikan acara **${matched.title}** (${matched.category}) pada tanggal ${matched.date} di ${matched.location}! Harganya ${matched.price}. ${matched.description || ''}. Ingin membeli tiketnya?`;
      }
      return `🎉 I highly recommend the event **${matched.title}** (${matched.category}) on ${matched.date} at ${matched.location}! The price is ${matched.price}. ${matched.description || ''}. Would you like to get tickets?`;
    }

    // Category-based check in database
    if (lowerMessage.includes('music') || lowerMessage.includes('konser') || lowerMessage.includes('concert')) {
      const musicEvent = eventsSummary.find(e => e.category.toLowerCase() === 'music');
      if (musicEvent) {
        if (isIndo) {
          return `🎸 Saya merekomendasikan konser musik **${musicEvent.title}** pada tanggal ${musicEvent.date} di ${musicEvent.location}. Harganya ${musicEvent.price}. Ingin tahu detail tiketnya?`;
        }
        return `🎸 I recommend the music concert **${musicEvent.title}** on ${musicEvent.date} at ${musicEvent.location}. The price is ${musicEvent.price}. Would you like details?`;
      }
      return isIndo 
        ? "🎸 Maaf, saat ini tidak ada acara musik atau konser yang aktif di database kami. Silakan cek daftar acara lainnya atau request acara musik impian Anda!"
        : "🎸 Sorry, there are no active music events or concerts registered on our platform right now. Feel free to request one in the request section below!";
    } else if (lowerMessage.includes('tech') || lowerMessage.includes('startup') || lowerMessage.includes('ai') || lowerMessage.includes('seminar')) {
      const techEvent = eventsSummary.find(e => e.category.toLowerCase() === 'tech');
      if (techEvent) {
        if (isIndo) {
          return `🚀 Ada seminar teknologi menarik nih: **${techEvent.title}** pada ${techEvent.date} di ${techEvent.location}. Tiketnya ${techEvent.price}! Apakah Anda tertarik?`;
        }
        return `🚀 There is an exciting tech event: **${techEvent.title}** on ${techEvent.date} at ${techEvent.location}. Ticket is ${techEvent.price}! Are you interested?`;
      }
      return isIndo
        ? "🚀 Maaf, saat ini tidak ada acara teknologi atau seminar yang aktif di database kami. Silakan cek kategori lain atau request seminar impian Anda!"
        : "🚀 Sorry, there are no active technology events or seminars registered on our platform right now.";
    } else if (lowerMessage.includes('makan') || lowerMessage.includes('food') || lowerMessage.includes('kuliner')) {
      const foodEvent = eventsSummary.find(e => e.category.toLowerCase().includes('food') || e.category.toLowerCase().includes('drink'));
      if (foodEvent) {
        if (isIndo) {
          return `🍔 Untuk pecinta kuliner, ada **${foodEvent.title}** di ${foodEvent.location} pada tanggal ${foodEvent.date}! Harganya ${foodEvent.price}. Tertarik?`;
        }
        return `🍔 For food lovers, there is **${foodEvent.title}** at ${foodEvent.location} on ${foodEvent.date}! Price is ${foodEvent.price}. Interested?`;
      }
      return isIndo
        ? "🍔 Maaf, saat ini tidak ada festival kuliner atau makanan yang aktif di database kami."
        : "🍔 Sorry, there are no active culinary or food events registered on our platform right now.";
    } else if (lowerMessage.includes('halo') || lowerMessage.includes('hai')) {
      return isIndo
        ? "Halo! 👋 Aku REvas'st, asisten pintar REventS. Lagi nyari acara seru? Kasih tau aku kategori yang kamu minati!"
        : "Hello! 👋 I'm REvas'st, your AI Matchmaker. Looking for exciting events? Let me know what category you are interested in!";
    }
    
    if (eventsSummary.length > 0) {
      const first = eventsSummary[0];
      if (isIndo) {
        return `🎉 Maaf, kami tidak menemukan acara yang tepat dengan kata kunci Anda. Tapi kami punya acara populer lainnya: **${first.title}** (${first.category}) pada tanggal ${first.date}. Mau saya bantu carikan tiketnya?`;
      }
      return `🎉 Sorry, we couldn't find a direct match. However, we have a popular event available: **${first.title}** (${first.category}) on ${first.date}. Would you like to see it?`;
    }
    
    return isIndo
      ? "Maaf, saat ini belum ada acara aktif di platform REventS yang sesuai dengan preferensi Anda. Anda bisa request acara impian Anda melalui formulir di bawah!"
      : "Sorry, there are no active events registered on REventS matching your preferences right now. Feel free to request your dream event in the section below!";
  }

  static async recommendEvents(userPreferences: any, eventsSummary: any[]) {
    const ai = this.getAIInstance();

    const formattedEvents = eventsSummary.map(e => ({
      id: e.id,
      title: e.title,
      category: e.category,
      date: e.date,
      location: e.location,
      price: e.price,
      description: e.description,
      type: e.type
    }));

    const userProfileText = `
User Profile Interests:
- Categories: ${JSON.stringify(userPreferences.categories || [])}
- Format: ${userPreferences.format || 'Any'}
- Mode Kehadiran (Online/Offline/Hybrid): ${userPreferences.attendanceMode || 'Any'}
- Budget: ${userPreferences.budget || 'Any'}
`;

    if (!ai) {
      // Mock mode fallback for recommendations
      return this.getMockRecommendations(userPreferences, eventsSummary);
    }

    try {
      const prompt = `
Kamu adalah REva, AI Matchmaker pintar di platform manajemen acara.
Tugasmu adalah menganalisis profil ketertarikan (Interests) pengguna dan memilih 3 hingga 5 acara yang paling cocok dari daftar acara yang tersedia.

ATURAN WAJIB:
1. Analisis harus berdasarkan variabel kategori, format, mode kehadiran, dan budget pengguna.
2. Kamu WAJIB merespons HANYA dengan format JSON yang valid.
3. Jangan gunakan blok kode markdown (\`\`\`), jangan ada teks pembuka/penutup.

Daftar acara yang tersedia:
${JSON.stringify(formattedEvents, null, 2)}

Profil ketertarikan pengguna:
${userProfileText}

Kembalikan respon JSON dengan skema persis seperti ini (pastikan HANYA mengembalikan objek JSON mentah, tidak ada markdown wrapper, tidak ada penjelasan tambahan):
{
  "recommendedEventIds": [1, 2, 3]
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              recommendedEventIds: {
                type: 'ARRAY',
                items: { type: 'INTEGER' }
              }
            },
            required: ['recommendedEventIds']
          }
        }
      });

      const responseText = response.text || '';
      return JSON.parse(responseText);
    } catch (err) {
      console.error('Error generating recommendations from Gemini API:', err);
      return this.getMockRecommendations(userPreferences, eventsSummary);
    }
  }

  private static getMockRecommendations(userPreferences: any, eventsSummary: any[]) {
    const userCategories = userPreferences.categories || [];
    const userBudget = (userPreferences.budget || 'Any').toLowerCase();
    const userMode = (userPreferences.attendanceMode || 'Any').toLowerCase();

    const filtered = eventsSummary.filter(e => {
      // Category match
      let matchCat = userCategories.length === 0 || userCategories.includes(e.category);
      
      // Budget match
      let isFree = !e.price || e.price.toLowerCase() === 'free' || e.price.replace(/\D/g, '') === '0';
      let matchBudget = true;
      if (userBudget === 'free') {
        matchBudget = isFree;
      } else if (userBudget === 'under 100k') {
        const pNum = parseInt(e.price.replace(/\D/g, ''), 10) || 0;
        matchBudget = isFree || pNum <= 100000;
      } else if (userBudget === '100k - 500k') {
        const pNum = parseInt(e.price.replace(/\D/g, ''), 10) || 0;
        matchBudget = pNum >= 100000 && pNum <= 500000;
      }

      // Mode match
      let matchMode = true;
      if (userMode === 'online') {
        matchMode = e.type === 'online';
      } else if (userMode === 'offline') {
        matchMode = e.type === 'offline';
      }

      return matchCat && matchBudget && matchMode;
    });

    const recommendedEventIds = filtered.slice(0, 5).map(e => e.id);
    return { recommendedEventIds };
  }
}
