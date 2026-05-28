async function run() {
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'john@example.com', password: '123456' })
    });
    if (!loginRes.ok) {
      throw new Error(`Login failed: ${loginRes.statusText}`);
    }
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log("Logged in, token received.");

    const putRes = await fetch('http://localhost:5000/api/events/1', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: "Summer Music Festival 2024 - API Updated",
        category: "Music",
        date: "Saturday, June 15",
        location: "Central Park, Jakarta",
        price: "IDR 250.000",
        image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80",
        isTrending: false,
        description: "Join us for the ultimate summer celebration in the heart of Jakarta.",
        type: "offline",
        ticketType: "paid",
        status: "active"
      })
    });

    console.log("PUT status:", putRes.status);
    const putData = await putRes.json();
    console.log("PUT response body:", putData);

  } catch (e) {
    console.error("Error:", e);
  }
}
run();
