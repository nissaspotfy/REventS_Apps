import dns from 'dns/promises';

async function testDns() {
  console.log('Testing DNS lookup for smtp.gmail.com...');
  try {
    const ip = await dns.lookup('smtp.gmail.com');
    console.log('DNS lookup success:', ip);
  } catch (err) {
    console.error('DNS lookup failed:', err);
  }

  console.log('Testing fetch to google.com...');
  try {
    const res = await fetch('https://www.google.com');
    console.log('Fetch success! Status:', res.status);
  } catch (err) {
    console.error('Fetch failed:', err);
  }
}

testDns();
