const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
  // Chat & AI
  ["Gagal mengirim pesan chat.", "Failed to send chat message."],
  ["Halo! ?? Aku REvas'st. Lagi nyari acara seru buat akhir pekan ini? Kasih tau aku kamu suka apa (misal: musik, teknologi, atau kuliner)!", "Hey! 👋 I'm REvas'st. Looking for something fun this weekend? Tell me what you like (e.g., music, tech, or food)!"],
  ["Ceritakan padaku tipe acara apa yang sebenarnya sedang kamu cari!", "Tell me what type of event you're actually looking for!"],

  // Landing page sections
  ["Acara Terdekat Berdasarkan Lokasi", "Nearby Events By Location"],
  ["Oops! Acara Tidak Ditemukan", "Oops! No Events Found"],
  ["Sepertinya tidak ada acara yang cocok dengan pencarianmu saat ini. Mau aku bantu carikan rekomendasi lain yang mirip?", "Looks like there are no events matching your search right now. Want me to help find similar recommendations?"],
  ["1. Temukan Acara", "1. Find Events"],
  ["Eksplorasi ribuan acara menarik atau minta bantuan asisten pintar REvas'st untuk mendapatkan rekomendasi terbaik.", "Explore thousands of exciting events or ask the smart REvas'st assistant for personalized recommendations."],
  ["2. Amankan Tiket", "2. Secure Your Ticket"],
  ["Pesan tiket dengan cepat dan aman menggunakan berbagai metode pembayaran favorit Anda (QRIS, VA, e-Wallet).", "Book tickets quickly and securely using your preferred payment methods (QRIS, VA, e-Wallet)."],
  ["Tunjukkan QR Code e-ticket dari ponsel Anda di pintu masuk. Tanpa antre panjang, langsung nikmati acaranya!", "Show your e-ticket QR Code at the entrance from your phone. No long queues, just enjoy the event!"],
  ["Belum Menemukan Acara Impianmu?", "Haven't Found Your Dream Event Yet?"],
  ["Kirimkan ide acara yang paling kamu nantikan! Kami akan menyampaikannya ke penyelenggara terkait agar bisa direalisasikan.", "Submit the event idea you've been waiting for! We'll forward it to relevant organizers so it can be realized."],
  ["Ide acara terkirim! REvas'st akan memantau permintaanmu.", "Event idea submitted! REvas'st will keep track of your request."],
  ["Miliki Acara Sendiri? Buat di REventS Sekarang!", "Have Your Own Event? Create It on REventS Now!"],
  ["Ingin membuat seminar, konser, atau workshop-mu sendiri? Manfaatkan teknologi AI Co-Pilot REventS untuk manajemen tiket dan check-in yang instan.", "Want to create your own seminar, concert, or workshop? Use REventS AI Co-Pilot technology for instant ticket management and check-in."],

  // Validation messages (event creation)
  ["Judul Acara wajib diisi", "Event title is required"],
  ["Tanggal Acara wajib diisi", "Event date is required"],

  // Auth (organizer restriction)
  ["Penyelenggara tidak diperbolehkan membeli tiket dari acara yang dibuat sendiri.", "Organizers are not allowed to purchase tickets for their own events."],

  // Event sharing
  ["Tautan acara berhasil disalin ke papan klip!", "Event link copied to clipboard!"],

  // Create Event form labels
  ["Judul Acara (Event Title) ", "Event Title "],
  ["Tanggal Acara ", "Event Date "],
  ["Kategori Acara ", "Event Category "],
  ["Basic Event Information", "Basic Event Information"],  // already English, skip
  ["Lokasi Acara", "Event Location"],
  ["Acara Daring (Online)", "Online Event"],
  ["Tulis ringkasan acara yang menarik (maks 140 karakter)...", "Write an engaging event summary (max 140 characters)..."],
  ["Pengaturan Tiket", "Ticket Settings"],
  ["Nama Tiket ", "Ticket Name "],
  ["Tipe Tiket ", "Ticket Type "],
  ["Harga Tiket (IDR)", "Ticket Price (IDR)"],

  // Search placeholder
  ["Cari acara (mis: Konser musik)", "Search events (e.g., Music Concert)"],
];

let count = 0;
for (const [from, to] of replacements) {
  if (content.includes(from)) {
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'g');
    const newContent = content.replace(regex, to);
    if (newContent !== content) {
      count++;
      content = newContent;
    }
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log(`Done! Applied ${count} additional language replacements.`);
