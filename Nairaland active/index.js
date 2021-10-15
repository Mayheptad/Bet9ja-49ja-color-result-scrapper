import http from 'http';
import puppeteer from 'puppeteer';
import mongoose from 'mongoose';
import fetch from 'node-fetch';

const server = http.createServer((request, response)=>{
  if(request.url == "/" && request.method == "GET"){
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.end("your app is working", "utf-8");
  }
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
 const nlModelName = thisMonth+"_"+convertDate.getDate();

mongoose.connect('mongodb+srv://admin-bill:harbey1994@cluster0.ea0lo.mongodb.net/nairalandDB?retryWrites=true&w=majority');
//mongoose.connect('mongodb://localhost:27017/nlDB');

const nlSchema = mongoose.Schema({
	Time:String, done: String
})

 let postPingTime; let nlModel;

async function updateNl(){

try{
  const browser = await puppeteer.launch({headless: false, slowMo: 250});
  const page = await browser.newPage();
  await page.setViewport({width: 1200, height: 720})
  //throw Error('intetionaly trow error to trigger catch block')
  await page.goto('https://www.nairaland.com/login',{
    waitUntil: 'networkidle2',
  });
 	
  await page.type('input[name="name"]', 'oluwarichy')
  await page.type('input[name="password"]', 'harbey1994')
  
  await Promise.all([
  page.click('input[value="Login"]'),
  page.waitForNavigation(), 
  ]) 
  
  await page.goto('https://www.nairaland.com/followed');
  
   let postArr = await page.evaluate( _ => { 
	  var temArr = [];
	  
	 let p1 = document.querySelector("body > div > table:nth-child(9) > tbody > tr:nth-child(2) > td > b:nth-child(4) > a").href; let p2 = document.querySelector("body > div > table:nth-child(9) > tbody > tr:nth-child(3) > td > b:nth-child(4) > a").href; let p3 = document.querySelector("body > div > table:nth-child(9) > tbody > tr:nth-child(4) > td > b:nth-child(4) > a").href; let p4 = document.querySelector("body > div > table:nth-child(9) > tbody > tr:nth-child(5) > td > b:nth-child(4) > a").href; let p5 = document.querySelector("body > div > table:nth-child(9) > tbody > tr:nth-child(6) > td > b:nth-child(4) > a").href;
	 let p6 = document.querySelector("body > div > table:nth-child(9) > tbody > tr:nth-child(7) > td > b:nth-child(4) > a").href; let p7 = document.querySelector("body > div > table:nth-child(9) > tbody > tr:nth-child(8) > td > b:nth-child(4) > a").href; let p8 = document.querySelector("body > div > table:nth-child(9) > tbody > tr:nth-child(9) > td > b:nth-child(4) > a").href; let p9 = document.querySelector("body > div > table:nth-child(9) > tbody > tr:nth-child(10) > td > b:nth-child(4) > a").href; let p10 = document.querySelector("body > div > table:nth-child(9) > tbody > tr:nth-child(11) > td > b:nth-child(4) > a").href;
	 
     temArr.push(p1); temArr.push(p2); temArr.push(p3); temArr.push(p4); temArr.push(p5); temArr.push(p6); temArr.push(p7); temArr.push(p8); temArr.push(p9); temArr.push(p10);
			
		return temArr;  
	}, 60000);
		 
		 var i;
		 var len = postArr.length;
		 
	 for(i = 0; i < len; i++) {
		 
    await page.goto(postArr[i]);
	
	const replyBtnUrl = await page.evaluate( _ => document.querySelector("body > div > div.nocopy > p:nth-child(1) > a:nth-child(2)").href, 60000);
  
   await page.goto(replyBtnUrl);
   
  const str = ['Always visit ', 'Go to ', 'Kindly visit ', "Don't forget to Visit ", 'Endeavour to visit ', 'Click '];
  const randNum = Math.floor(Math.random() * 400) + 1;
  const randStr = Math.floor(Math.random() * str.length);
  
   await page.type('#body', `${str[randStr]} https://onenewspace.com/read-blog/${randNum} for the best, latest, trending news and entertainment info`)
  
   await page.click('input[value="Submit"]');
  
};
     await browser.close(); 

 //get the current time in Nigeria timezone & save it to a variable
 postPingTime = convertDate.getHours()+":"+convertDate.getMinutes()+":"+convertDate.getSeconds();

 nlModel = mongoose.model(nlModelName, nlSchema);
	 
	 const data = new nlModel({Time: postPingTime, done: 'yes'});
	 data.save().then( _ => null)
	 .catch( _ => {throw Error('error occcured data not saved')})
	 
} catch(err){
	console.log(err)
	
	 //get the current time in Nigeria timezone & save it to a variable
 postPingTime = convertDate.getHours()+":"+convertDate.getMinutes()+":"+convertDate.getSeconds();

 nlModel = mongoose.model(nlModelName, nlSchema);
 
	const data = new nlModel({Time: postPingTime, done: 'Nope'});
	data.save().then( _ => null)
	.catch( _ => {console.log('Even nope cannot be saved')})
}
   }
   
//updateNl() 
setTimeout( _ => updateNl(), 300000)

const pingHome = function(){
  fetch("quiet-castle-39903.herokuapp.com")
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


server.listen(process.env.PORT || 3000,()=>{console.log("server started succesfully")});
