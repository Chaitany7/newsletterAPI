const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
	res.sendFile(__dirname+"/signup.html");
})

app.post("/",function(req,res){
	var fname=req.body.fname;
	var lname=req.body.lname;
	var email=req.body.email;
	console.log(fname,lname,email);

	const data = {
		members:[
		{
			email_address:email,
			status:"subscribed",
			merge_fields:{
				FNAME:fname,
				LNAME:lname
			}
		}
	  ]
	};
	const jsonData = JSON.stringify(data);

	const url= "https://us10.api.mailchimp.com/3.0/lists/1228daf7cb";
	const options={
		method:"POST",
		auth:"chaitanya:41d1c5843911acfcef84bab4b8edd679-us10"
	}
	const request=https.request(url,options,function(response){

		if(response.statusCode===200)
			res.sendFile(__dirname+"/success.html");
		else
			res.sendFile(__dirname+"/failure.html");

		response.on("data",function(data){
			console.log(JSON.parse(data));
		})
	})
	request.write(jsonData);
	request.end();
})

app.post("/failure",function(req,res){
	res.redirect("/");
})
app.listen(process.env.PORT || 3000,function(){
	console.log("server running on port 3000")
}) 

// 41d1c5843911acfcef84bab4b8edd679-us10
// 1228daf7cb