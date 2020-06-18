const express = require("express");
const proxy = require("express-http-proxy");

const publicweb = process.env.PUBLICWEB || ".";
const app = express();

const weatherApi = process.env.WEATHER_API || "https://api.weatherapi.com";
const exchangeApi = process.env.EXCHANGE_API || "www.ecb.europa.eu";
const stocksApi = process.env.STOCKS_API || "finnhub.io";

const port = process.env.PORT || "3000";

app.use(express.static(publicweb));
app.use("/api/weather", proxy(weatherApi));
app.use(
  "/api/exchange",
  proxy(exchangeApi, {
    https: true,
  })
);
app.use(
  "/api/stocks",
  proxy(stocksApi, {
    https: true,
  })
);

app.get("/admin", (req, res) => {
  res.send(
    `PORT: ` +
      port +
      `<br>WEATHER_API: ` +
      weatherApi +
      `<br>EXCHANGE_API: ` +
      exchangeApi +
      `<br>STOCKS_API: ` +
      stocksApi
  );
});

app.get("*", (req, res) => {
  res.sendFile(`index.html`, { root: publicweb });
});

app.listen(port, () => console.log(`API running on localhodst:${port}`));
