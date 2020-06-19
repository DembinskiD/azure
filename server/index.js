const express = require("express");
const proxy = require("express-http-proxy");
const {ServiceBusClient, ReceiveMode} = require("@azure/service-bus");
const { SingleEntryPlugin } = require("webpack");

var reload = require("express-reload");

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  })
}

const publicweb = process.env.PUBLICWEB || ".";
const app = express();

const exchangeBusClient = ServiceBusClient.createFromConnectionString("Endpoint=sb://exchangedatasbus.servicebus.windows.net/;SharedAccessKeyName=getPolicy;SharedAccessKey=fZIRlwOZ6pCoq1u0fDCCX0vE9MCa/eQxBvVeu/A74KE=;EntityPath=ratesqueue");
const exchangeQueueClient = exchangeBusClient.createQueueClient("ratesqueue");
const exchangeReceiver = exchangeQueueClient.createReceiver(ReceiveMode.peekLock);

const stockSBClient = ServiceBusClient.createFromConnectionString("Endpoint=sb://projectongoingservicebus.servicebus.windows.net/;SharedAccessKeyName=ListenPolicy;SharedAccessKey=H8QuUFRCqU1rViwfkrCrwSJb0LcaXMlFtm/09icYF0Y=;EntityPath=stockqueue");
const stockQueueClient = stockSBClient.createQueueClient("stockqueue");
const stockReceiver = stockQueueClient.createReceiver(ReceiveMode.peekLock);

const weatherApi = process.env.WEATHER_API || "https://weatherfunctionforproject.azurewebsites.net/api/readWeather?code=2eYxF0Ouezkr/auK5YxLUL2JqGwzQu4gPSOHRLbghIaDmHaW5kkeGQ==";
const exchangeApi = process.env.EXCHANGE_API || "https://exchangeratesforproject.azurewebsites.net/api/getRates?code=jxPYVDVy0Uhs3TaIDOm/LSfSOxAiZMMEZwxzIKDyX8KY9spqjJaMJw==";
const stocksApi = process.env.STOCKS_API || "https://stockforproject.azurewebsites.net/api/readFromDB?code=5vILXx059fFR8tXt1gsK42PfpkgS5YgaBIbuB2hcj9xXZnuG/t8n1w==";

const port = process.env.PORT || "3000";

const updateStockData = async () => {
  let message = await stockReceiver.receiveMessages(1);
  message = message[0].body;
  while(true) {
    let match = await stockReceiver.receiveMessages(1);
    if(message != match[0].body) {
      message = match[0].body;
      console.log("stkData");
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
    }
    await sleep(1000);
  }
}

const updateExchangeData = async () => {
  let message = await exchangeReceiver.receiveMessages(1);
  message = message[0].body;
  while(true) {
    let match = await exchangeReceiver.receiveMessages(1);
    if(message != match[0].body) {
      message = match[0].body;
      console.log("exData");
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
    }
    await sleep(1000);
  }
}



updateExchangeData();
updateStockData();




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
