var http = require("http");
const fetch = require('node-fetch');
const mongoose = require("mongoose");
const puppeteer = require("puppeteer");

mongoose.connect("mongodb+srv://admin-bill:harbey1994@cluster0.ea0lo.mongodb.net/gameDb?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true, });
const gameSchema = new mongoose.Schema({time: String, ball1color: String, ball1number: Number, ball2color: String, ball2number: Number, ball3color: String, ball3number: Number, ball4color: String, ball4number: Number, ball5color: String, ball5number: Number, ball6color: String, ball6number: Number});

async function scrapeData(url){
const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.goto(url);

//wait for the elements that i want to scrape to become visible in the Dom
await page.waitForFunction(()=>{
  return document.querySelectorAll('.ball')[2] && document.querySelectorAll('.ball')[2].style.visibility != 'hidden' && document.querySelectorAll('.ball')[3] && document.querySelectorAll('.ball')[3].style.visibility != 'hidden' && document.querySelectorAll('.ball')[4] && document.querySelectorAll('.ball')[4].style.visibility != 'hidden' && document.querySelectorAll('.ball')[5] && document.querySelectorAll('.ball')[5].style.visibility != 'hidden' && document.querySelectorAll('.ball')[6] && document.querySelectorAll('.ball')[6].style.visibility != 'hidden' && document.querySelectorAll('.ball')[7] && document.querySelectorAll('.ball')[7].style.visibility != 'hidden';
}, {timeout: 100000 });

//wait for the innertext of the 6 balls to appear
await page.waitForFunction(() => {
return document.querySelectorAll(".ball")[2].innerText !== '' && document.querySelectorAll(".ball")[3].innerText !== '' && document.querySelectorAll(".ball")[4].innerText !== '' && document.querySelectorAll(".ball")[5].innerText !== '' && document.querySelectorAll(".ball")[6].innerText !== '' && document.querySelectorAll(".ball")[7].innerText !== '';
 }, { timeout: 100000 });

 //get the color and no of the six balls starting from the left
const [ball1, ball2, ball3, ball4, ball5, ball6] = await page.evaluate(() => {
const ball1 = document.querySelectorAll(".ball")[2]; const ball2 = document.querySelectorAll(".ball")[3];
const ball3 = document.querySelectorAll(".ball")[4]; const ball4 = document.querySelectorAll(".ball")[5]; 
const ball5 = document.querySelectorAll(".ball")[6]; const ball6 = document.querySelectorAll(".ball")[7];
 //return the color and their numbers
return [
{number: ball1.innerText,color: ball1.classList[1].split('-')[1]},{number: ball2.innerText,color: ball2.classList[1].split('-')[1]},
{number: ball3.innerText,color: ball3.classList[1].split('-')[1]},{number: ball4.innerText,color: ball4.classList[1].split('-')[1]},
{number: ball5.innerText,color: ball5.classList[1].split('-')[1]},{number: ball6.innerText,color: ball6.classList[1].split('-')[1]}
  ];
  });

  //convert time to nigeria timezone 
  function convertTZ(date, tzString) {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
}
const convertDate = convertTZ(new Date(),"Africa/Lagos");

 //change convert getMonth() to human readable formart
 var thisMonth;
switch(convertDate.getMonth()){ case 0: thisMonth = "january"; break; case 1: thisMonth = "february"; break; case 2: thisMonth = "march"; break; case 3: thisMonth = "april"; break; case 4: thisMonth = "may"; break; case 5: thisMonth = "june"; break; case 6: thisMonth = "july"; break; case 7: thisMonth = "august"; break; case 8: thisMonth = "september"; break; case 9: thisMonth = "octomber"; break; case 10: thisMonth = "november"; break; case 11: thisMonth = "december"; break; default: thisMonth = "invalid_month";} 

//create a db collection, name it using today date & month in nigeria timezone
  var dbCollection = thisMonth+"_"+convertDate.getDate();

  //get the current time in Nigeria timezone & save it to a variable
const gameTime = convertDate.getHours()+":"+convertDate.getMinutes()+":"+convertDate.getSeconds();

  //write the result to the database
const collection = mongoose.model(dbCollection, gameSchema);

const Result = new collection({
time: gameTime, ball1color: ball1.color, ball1number: ball1.number,
ball2color: ball2.color, ball2number: ball2.number, 
ball3color: ball3.color, ball3number: ball3.number,
ball4color: ball4.color, ball4number: ball4.number,
ball5color: ball5.color, ball5number: ball5.number,
ball6color: ball6.color, ball6number: ball6.number,
});

 Result.save((err, savedDoc, rowsAffected)=>{ 
if(err){
  //console.log("data not saved " + err);
  callScrapeDataAgain();
}else{
  //console.log("data saved succesfully");
  callScrapeDataAgain();
}
});

  //close the browser
  await browser.close();

}

scrapeData("https://logigames.bet9ja.com/Games/Launcher?gameId=11000&provider=0&sid=&pff=1&skin=201");

function callScrapeDataAgain(){
  setTimeout(()=>{
    scrapeData("https://logigames.bet9ja.com/Games/Launcher?gameId=11000&provider=0&sid=&pff=1&skin=201");
  }, 2000)
}

const pingHome = function(){
  fetch("https://lit-dawn-27057.herokuapp.com/")
  .then(res => res.text())
    .then(body => console.log(body))
    .catch(err => console.error(err));
}
setInterval(pingHome, 15*60*1000); 

const pingPlaceHolder = function(){
  fetch('https://jsonplaceholder.typicode.com/todos/1')
  .then(response => response.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));
}
setInterval(pingPlaceHolder, 20*60*1000); 

http.createServer((request, response)=>{
  if(request.url == "/" && request.method == "GET"){
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.end("your app is working", "utf-8");
  }
  
}).listen(process.env.PORT || 3000,()=>{console.log("server started succesfully")});
