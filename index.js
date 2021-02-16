const fs = require("fs");
const puppeteer = require("puppeteer");

async function scrapeData(url){
  var gotData = false;
const browser = await puppeteer.launch( { headless: false } );
const page = await browser.newPage();
await page.goto(url);
//wait for all 6 balls and its innertext to appear
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
//save the returned data in to a variable
const result = convertDate.getHours()+":"+convertDate.getMinutes()+":"+convertDate.getSeconds()+" "+[`${ball1.color}-${ball1.number}`, `${ball2.color}-${ball2.number}`, `${ball3.color}-${ball3.number}`, `${ball4.color}-${ball4.number}`, `${ball5.color}-${ball5.number}`, `${ball6.color}-${ball6.number}`];
   //close the browser
 await browser.close();
//create a file, name it using today date & month in nigeria timezone
  var fileName = "day-"+convertDate.getDate()+"__"+"month-"+convertDate.getMonth()+".txt";
//write the result to a file
fs.appendFile(fileName,result+"\n", (err)=>{
 if(err){console.log(err);}else{
  gotData = true;
  if(gotData == true){
    //reset gotData back to false
      gotData = false;
    //re-run scrapeData again
       callScrapeDataAgain();
   }
}});
 }

 scrapeData("https://logigames.bet9ja.com/Games/Launcher?gameId=11000&provider=0&sid=&pff=1&skin=201");

  function callScrapeDataAgain(){
   scrapeData("https://logigames.bet9ja.com/Games/Launcher?gameId=11000&provider=0&sid=&pff=1&skin=201");
  };
console.log("connected");






