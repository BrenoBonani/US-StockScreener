require("dotenv").config();

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const { log } = require("console");
const ejs = require("ejs");


const app = express();



app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static("public"));
app.set('view engine', 'ejs');



// app post 
app.post("/", (req, res) => {
    const apiKey = process.env.API_KEY;
    const queryTicker = req.body.tickerName.toUpperCase();
    const url = process.env.URL_API + queryTicker + "?apikey=" + apiKey;
    

// https for response the data
https.get(url, function(response){
    console.log(response);

    

    response.on("data", function(data){
        const financialData = JSON.parse(data);
        console.log(financialData);

        // overview company
        const symbol = financialData[0].symbol;
        const name = financialData[0].name;
        const exchange = financialData[0].exchange;

        // price status
        const price = financialData[0].price;
        const priceOpen = financialData[0].open;
        const priceClose = financialData[0].previousClose;
        const changeOnDay = (financialData[0].changesPercentage).toFixed(2);
        const marketCap = financialData[0].marketCap.toLocaleString();
        const volume = financialData[0].volume.toLocaleString();
        const avgVolume = financialData[0].avgVolume.toLocaleString();
        const sharesOutstanding = financialData[0].sharesOutstanding.toLocaleString();
        const priceAvg50 = financialData[0].priceAvg50;
        const priceAvg200 = financialData[0].priceAvg200;
        const earningsAnnouncement = (financialData[0].earningsAnnouncement);
        let newDate = new Date(earningsAnnouncement);
        let earningsDate = newDate.toDateString();

        // stock multiples
        const EPS = financialData[0].eps;
        const PE = Math.round(financialData[0].pe);
        

      
   
        res.render("result", {name: name, symbol: symbol, exchange: exchange, 
        marketCap: marketCap, price: price, priceOpen: priceOpen, priceClose: priceClose, 
        changeOnDay: changeOnDay, sharesOutstanding: sharesOutstanding, volume: volume, 
        avgVolume: avgVolume, priceAvg50: priceAvg50, priceAvg200: priceAvg200, 
        EPS: EPS, PE: PE, earningsDate: earningsDate});
    });

    
});



});


// app get
app.get("/", function(req, res){

    res.render("home");

});

// app listen
app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000");
});
