const http = require("http");
const https = require("https");
const url = require("url");

const API_KEY = "b62efa703b16e267160d92bddf530664";

const server = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Content-Type", "application/json");

    const parsedUrl = url.parse(req.url, true);

    if (parsedUrl.pathname === "/api/weather") {
        const city = parsedUrl.query.city;
        if (!city) {
            res.writeHead(400);
            return res.end(JSON.stringify({ error: "Brak nazwy miasta!" }));
        }

        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=pl`;

        https.get(apiUrl, apiRes => {
            let data = "";

            apiRes.on("data", chunk => (data += chunk));
            apiRes.on("end", () => {
                try {
                    const json = JSON.parse(data);

                    if (json.cod !== 200) {
                        res.writeHead(404);
                        return res.end(JSON.stringify({ error: "Nie znaleziono miasta!" }));
                    }

                    res.writeHead(200);
                    res.end(JSON.stringify(json));
                } catch (err) {
                    res.writeHead(500);
                    res.end(JSON.stringify({ error: "Błąd serwera!" }));
                }
            });
        })
        .on("error", () => {
            res.writeHead(500);
            res.end(JSON.stringify({ error: "Błąd połączenia z API!" }));
        });

    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Endpoint nie istnieje!" }));
    }
});

// Uruchomienie serwera
server.listen(5000, () => {
    console.log("Server działa na porcie 5000 (bez Express)");
});
