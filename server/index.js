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

const busClient = ServiceBusClient.createFromConnectionString("Endpoint=sb://exchangedatasbus.servicebus.windows.net/;SharedAccessKeyName=getPolicy;SharedAccessKey=fZIRlwOZ6pCoq1u0fDCCX0vE9MCa/eQxBvVeu/A74KE=;EntityPath=ratesqueue");
const queueClient = busClient.createQueueClient("ratesqueue");
const receiver = queueClient.createReceiver(ReceiveMode.peekLock);


const weatherApi = process.env.WEATHER_API || "https://weatherfunctionforproject.azurewebsites.net/api/readWeather?code=2eYxF0Ouezkr/auK5YxLUL2JqGwzQu4gPSOHRLbghIaDmHaW5kkeGQ==";
const exchangeApi = process.env.EXCHANGE_API || "https://exchangeratesforproject.azurewebsites.net/api/getRates?code=jxPYVDVy0Uhs3TaIDOm/LSfSOxAiZMMEZwxzIKDyX8KY9spqjJaMJw==";
const stocksApi = process.env.STOCKS_API || "https://stockforproject.azurewebsites.net/api/readFromDB?code=5vILXx059fFR8tXt1gsK42PfpkgS5YgaBIbuB2hcj9xXZnuG/t8n1w==";

const port = process.env.PORT || "3000";

const updateData = async () => {
  let message = await receiver.receiveMessages(1);
  message = message[0].body;
  console.log("ok");
  while(true) {
    let match = await receiver.receiveMessages(1);
    if(message != match[0].body) {
      message = match[0].body;
      // console.log(message);
      // app.use(reload(__dirname+"/"));
      console.log("ok2");
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

updateData();




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
