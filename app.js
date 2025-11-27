const { useState } = React;

function App() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState("");

    const API_KEY = "b62efa703b16e267160d92bddf530664";

    const getWeather = async () => {
        if (!city) return;

        try {
            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=pl`
            );
            const data = await res.json();

            if (data.cod !== 200) {
                setError("Nie znaleziono miasta!");
                setWeather(null);
            } else {
                setError("");
                setWeather(data);
            }
        } catch {
            setError("Błąd połączenia z API!");
        }
    };

    return (
        React.createElement("div", { className: "container" },
            React.createElement("h1", null, "Aplikacja Pogodowa"),
            React.createElement("input", {
                type: "text",
                value: city,
                placeholder: "Wpisz miasto...",
                onChange: e => setCity(e.target.value)
            }),
            React.createElement("button", { onClick: getWeather }, "Sprawdź pogodę"),
            error && React.createElement("p", { className: "error" }, error),
            weather && React.createElement("div", { className: "weather-box" },
                React.createElement("h2", null, weather.name),
                React.createElement("p", null, `Temperatura: ${weather.main.temp}°C`),
                React.createElement("p", null, `Wilgotność: ${weather.main.humidity}%`),
                React.createElement("p", null, `Opis: ${weather.weather[0].description}`)
            )
        )
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
