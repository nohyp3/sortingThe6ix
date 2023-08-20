const fetch = require("node-fetch");

async function logMovies() {
    const response = await fetch("https://dba0-141-117-117-21.ngrok-free.app/data", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "ngrok-skip-browser-warning"
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({labels: ["Plastic wrap", "Burgers"]})
        
    });
    const movies = await response.json();
    console.log(movies);
  }

logMovies()