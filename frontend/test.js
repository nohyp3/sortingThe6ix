const fetch = require("node-fetch");

async function logMovies() {
    const response = await fetch("http://127.0.0.1:105/data", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({labels: ["Plastic wrap", "Burgers"]})
        
    });
    const movies = await response.json();
    console.log(movies);
  }

logMovies()