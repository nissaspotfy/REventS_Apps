import 'dotenv/config';
import { CopilotService } from './server/services/copilot.service';

async function test() {
  const result = await CopilotService.generateEventDraft("buatkan saya seminar mengenai Kreator pada tanggal 10 mei 2026 di balai kota bandung dengan kuota 400 orang dan bayar 100 ribu.");
  console.log(JSON.stringify(result, null, 2));
}

test();
