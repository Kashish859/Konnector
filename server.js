//=========   Modules Used Start =====================================//

var express = require("express");
var mysql2 = require("mysql2");
var cloudinary = require("cloudinary").v2;
var fileuploader = require("express-fileupload");
var nodemailer = require("nodemailer");
const { GoogleGenerativeAI } = require("@google/generative-ai");

//=========   Modules Used End =====================================//


var app = express(); //(Sign express module to app object)


//============ Creating Port For Local Host Starts ==============//

app.listen(2006, function () { // listen is inbuilt function to create port
    console.log("server started at port 2006")
})

//============ Creating Port For Local Host End ==============//



//========= Generative AI Setup With Google Studio Keys Starts =======//

const genAI = new GoogleGenerativeAI("AIzaSyDIbh4Emy0SfA3wsBmXv3t3bM6DuiRbZw4");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

//========= Generative AI Setup With Google Studio Keys Ends =======//



//============ Cloudinary Setup Starts =========//

cloudinary.config({ 
            cloud_name: 'dtr0h973p', 
            api_key: '635696216546912', 
            api_secret: 'LUb-ToRpHmQPZeKl8S4bpn3yI34' // Click 'View API Keys' above to copy your API secret
        });

//============ Cloudinary Setup Ends =========//


app.use(fileuploader());//for receiving files from client(html side) and save on server(server.js) files
app.use(express.static("public"));//for accessing javascript, css files or images
app.use(express.urlencoded(true)); //convert POST(to send data securily or with security) data to JSON object

// JSON - javascript object notation when we use curly braces{} 


//========= Database Connectivity With AIVen Starts ========//

let dbConfig = "mysql://avnadmin:AVNS_IzQjQCofLEiw7gKfZwh@mysql-18ae301b-coke5173-fedc.c.aivencloud.com:21159/defaultdb";

let mySqlVen = mysql2.createConnection(dbConfig);
mySqlVen.connect(function (errkuch) {
    if (errkuch == null)
        console.log("AIven Connected Successfully");
    else
        console.log(errkuch.messsage)
})

//========= Database Connectivity With AIVen Ends ========//



//======= Sending Files To The Browser/Localhost Starts ==========//

app.get("/", function (req, resp) {
    // resp.send("Hello")
    let path = __dirname + "/public/index.html";
    resp.sendFile(path);
})


app.get("/org-det", function (req, resp) {
    let path = __dirname + "/public/organiser-details.html";
    resp.sendFile(path);
})


app.get("/user-console", function (req, resp) {
    resp.sendFile( __dirname + "/public/user-console.html");
})

app.get("/player-data", function (req, resp) {
    resp.sendFile( __dirname + "/public/player-data.html");
})

app.get("/organiser-data", function (req, resp) {
    resp.sendFile( __dirname + "/public/organiser-data.html");
})


app.get("/bce2001", function (req, resp) {
    resp.sendFile( __dirname + "/public/admin-dashboard.html");
})

app.get("/orgdash", function (req, resp) {
    let path = __dirname + "/public/organiser-dashboard.html";
    resp.sendFile(path);
})

app.get("/posttournament", function (req, resp) {
    let path = __dirname + "/public/post-tournament.html";
    resp.sendFile(path);
})
app.get("/profileplayer", function (req, resp) {
    let path = __dirname + "/public/profile-player.html";
    resp.sendFile(path);
})

app.get("/tournamentfinder", function (req, resp) {
    let path = __dirname + "/public/tournament-finder.html";
    resp.sendFile(path);
})

//======= Sending Files To The Browser/Localhost Ends ==========//


//========= Signup Modal Button Exists On Index.html File Signup Into The User Table Starts ======//

app.get("/Signup", function (req, resp) {
    let email = req.query.txtemail;
    let pwd = req.query.txtpwd;
    let utype = req.query.utype;

    mySqlVen.query("insert into user values(?,?,?,current_date(),?)", [email, pwd, utype, 1], function (error) {
        if (error == null)
            resp.send("Signup Successfully");
        else
            resp.send(error.message);
    })

    // console.log(email);
})

//========= Signup Modal Button Exists On Index.html File Signup Into The User Table Ends ======//


//========= Login Modal Button Exists On Index.html File Login From The User Table Starts ======//

app.get("/Login", function (req, resp) {
    let email = req.query.txtemail;
    let pwd = req.query.txtpwd;

    mySqlVen.query("select * from user where emailid=? and password=?", [email, pwd], function (error, records) {
        if (records.length == 0)
            resp.send("Invalid User");
        else if (records[0].status == 1)
            resp.send(records[0].utype);
        else
            resp.send("You Are Blocked By Admin");
    })
})

//========= Login Modal Button Exists On Index.html File Login Into The User Table Ends ======//


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////// Organiser Dashboard Starts ///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//========================================================= Organiser-Detail.html Page Full Process Starts ====================================================//


//======== Organisation Details(SendToServer) Button Starts ========//

app.post("/sendtoserver", async function (req, resp) {

    let txtmail=req.body.txtmail;
    let orgname = req.body.orgname;
    let regname = req.body.regname;
    let address = req.body.address;
    let address2 = req.body.address2;
    let city = req.body.city;
    let select = req.body.select;
    let code = req.body.code;
    let types = req.body.types;
    let web = req.body.web;
    let insta = req.body.insta;
    let head = req.body.head;
    let contact = req.body.contact;
    let otherinfo = req.body.otherinfo;

    let picurl="";
    if(req.files!=null)
    {
        let fName=req.files.filepic.name;
        let fullPath=__dirname+"/public/uploads/"+fName;
        req.files.filepic.mv(fullPath);

        await cloudinary.uploader.upload(fullPath).then(function(picUrlResult)
        {
            picurl=picUrlResult.url;   //will give u the url of ur pic on cloudinary server

            console.log(picurl);
      });
    }
    else
        picurl="nopic.jpg";

    // console.log(txtmail+orgname+regname+address+address2+city+select+code+types+web+insta+head+contact+filepic+otherinfo);

    mySqlVen.query("insert into organiser values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [txtmail,orgname,regname,address,address2,city,select,code,types,web,insta,head,contact,picurl,otherinfo], function (error) {
        if (error == null)
            resp.send("Record Saved Successfully");
        else
            resp.send(error.message);
    })
})

//======== Organisation Details(SendToServer) Button Ends ========//



//======== Modify Organisation Details(Modify) Button Starts ========//

app.post("/modify", async function (req, resp) {

    let txtmail=req.body.txtmail;
    let orgname = req.body.orgname;
    let regname = req.body.regname;
    let address = req.body.address;
    let address2 = req.body.address2;
    let city = req.body.city;
    let select = req.body.select;
    let code = req.body.code;
    let types = req.body.types;
    let web = req.body.web;
    let insta = req.body.insta;
    let head = req.body.head;
    let contact = req.body.contact;
    let otherinfo = req.body.otherinfo;

    let picurl="";
    if(req.files!=null)
    {
        let fName=req.files.filepic.name;
        let fullPath=__dirname+"/public/uploads/"+fName;
        req.files.filepic.mv(fullPath);

        await cloudinary.uploader.upload(fullPath).then(function(picUrlResult)
        {
            picurl=picUrlResult.url;   //will give u the url of ur pic on cloudinary server

            console.log(picurl);
      });
    }
    else
        picurl="nopic.jpg";

    // console.log(txtmail+orgname+regname+address+address2+city+select+code+types+web+insta+head+contact+filepic+otherinfo);

    mySqlVen.query("update organiser set orgname=?,regname=?,address=?,address2=?,city=?,state=?,post=?,sports=?,web=?,insta=?,head=?,contact=?,picurl=?,otherinfo=? where txtmail=?", [orgname,regname,address,address2,city,select,code,types,web,insta,head,contact,picurl,otherinfo,txtmail], function (error) {
        if (error == null)
            resp.send("Record Modify");
        else
            resp.send(error.message);
    })
})

//======== Modify Organisation Details(Modify) Button Ends ========//


//=========== Fetch Organiser Data Using Search Button Starts ==========//

app.get("/fetchorganiser",function(req,resp){
    let email=req.query.txtemail;
    // console.log(email);

    
    mySqlVen.query("select * from organiser where txtmail=?", [email], function (error,jsonarray) {
        if (error == null)
            resp.send(jsonarray);
        else
            resp.send(error.message);
})
})

//=========== Fetch Organiser Data Using Search Button Endss ==========//

//========================================================= Organiser-detail.html Page Full Process Ends ====================================================//



//=================================================== Post Tournament.html Page Full Process Starts =============================================//


//=========== Publish Event Button Starts ===========//

app.get("/publishevent",  function (req, resp) {

    let mail=req.query.mail;
    let title = req.query.title;
    let date = req.query.date;
    let time = req.query.time;
    let address = req.query.address;
    let city = req.query.city;
    let sports = req.query.sports;
    let min = req.query.min;
    let max = req.query.max;
    let reg = req.query.reg;
    let fee = req.query.fee;
    let money = req.query.money;
    let person = req.query.person;

    console.log(mail+title+date+time+address+city+sports+min+max+reg+fee+money+person);

    mySqlVen.query("insert into tournament values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [null,mail,title,date,time,address,city,sports,min,max,reg,fee,money,person], function (error) {
        if (error == null)
            resp.send("Record Saved Successfully");
        else
            resp.send(error.message);
    })
})


//=========== Publish Event Button Ends ===========//

//==================================================== Post Tournament.html Page Full Process Ends =============================================//


//==================================================== Tournament Manager.html Page Full Process Starts =============================================//


//============ When tournament Manager Page Load All Tournaments Are Fetched Starts============//

app.get("/do-fetch-all",function(req,resp){
     let mailid = req.query.txtmail;
     console.log(mailid);
    
    mySqlVen.query("select * from tournament where emailid = ?  ",[mailid], function (error,jsonarray) {
        if (error == null)
            resp.send(jsonarray);
        else
            resp.send(error.message);
})
})

//============ When tournament Manager Page Load All Tournaments Are Fetched Ends ============//


//============ Delete Tournament Click On Delete Tournament Using RID Starts ============//

app.get("/dodelete",function(req,resp){
// console.log(req.query.rid);
   let rid=req.query.rid;
    mySqlVen.query("delete from tournament where rid=?",[rid], function (error,jsonarray) {
        if (error == null)
            resp.send("Delete Tournament Successfully");
        else
            resp.send(error.message);
})
})

//============ Delete Tournament Click On Delete Tournament Using RID Ends ============//



//============ Change User Password In Organiser And Player Setting Modal Starts ============//


app.get("/Change-Password",function(req,resp){
// console.log(req.query.rid);
   let email=req.query.txtemail;
   let oldpassword=req.query.txtpwd;
   let newpassword=req.query.npwd;
    mySqlVen.query("update user set password=? where emailid=? and password=?",[newpassword,email,oldpassword], function (error,jsonarray) {
        if (error == null)
            resp.send("Password Updated");
        else
            resp.send(error.message);
})
})

//============ Change User Password In Organiser And Player Setting Modal Ends ============//


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////// Organiser Dashboard Ends ///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////// PLayer Dashboard Starts ///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




//==================== Genrative AI Function Starts ====================//

async function GenrativeAI(imgurl) {
    const myprompt = "Read the text on picture and tell all the information in adhaar card and give output STRICTLY in JSON format {adhaar_number:'', name:'', gender:'', dob:''}. Dont give output as string.";

    const imageResp = await fetch(imgurl).then(r => r.arrayBuffer());

    const result = await model.generateContent([
        {
            inlineData: {
                data: Buffer.from(imageResp).toString("base64"),
                mimeType: "image/jpeg",
            },
        },
        myprompt,
    ]);

    const rawText = await result.response.text();
    console.log("RAW TEXT FROM GEMINI:", rawText);

    // clean up Gemini formatting
    const cleaned = rawText.replace(/```json|```/gi, '').trim();
    const jsonData = JSON.parse(cleaned);
    return jsonData;
}

//==================== Genrative AI Function Ends ====================//



//==================================================== Player Profile.html Page Starts =============================================//

app.post("/uploaddata", async function (req, resp) {
    try {
        let acardpicurl = "nopic.jpg";
        let profilepicurl = "nopic.jpg";
        let jsonData = {};

        if (req.files?.card) {
            let fName = req.files.card.name;
            let locationtosave = __dirname + "/public/uploads/" + fName;
            await req.files.card.mv(locationtosave);

            const cardUploadResult = await cloudinary.uploader.upload(locationtosave);
            acardpicurl = cardUploadResult.url;

            jsonData = await GenrativeAI(acardpicurl);
        }

        if (req.files?.profile) {
            let fName = req.files.profile.name;
            let locationtosave = __dirname + "/public/uploads/" + fName;
            await req.files.profile.mv(locationtosave);

            const profileUploadResult = await cloudinary.uploader.upload(locationtosave);
            profilepicurl = profileUploadResult.url;
        }

        let email = req.body.txtmail;
        let address = req.body.address;
        let contact = req.body.contact;
        let game = req.body.types;
        let otherinfo = req.body.otherinfo;

        mySqlVen.query(
            "insert into player values(?,?,?,?,?,?,?,?,?,?)",
            [email, acardpicurl, profilepicurl, jsonData.name, jsonData.gender, jsonData.dob, address, contact, game, otherinfo],
            function (errKuch) {
                if (errKuch == null) {
                    resp.send("profile complete");
                } else {
                    resp.send(errKuch.message);
                }
            }
        );

    } catch (err) {
        console.error("ERROR:", err);
        resp.status(500).send("Something went wrong");
    }
});


app.post("/modify-profile", async function (req, resp) {
    try {
        let acardpicurl = "nopic.jpg";
        let profilepicurl = "nopic.jpg";
        let jsonData = {};

        if (req.files?.card) {
            let fName = req.files.card.name;
            let locationtosave = __dirname + "/public/uploads/" + fName;
            await req.files.card.mv(locationtosave);

            const cardUploadResult = await cloudinary.uploader.upload(locationtosave);
            acardpicurl = cardUploadResult.url;

            jsonData = await GenrativeAI(acardpicurl);
        }

        if (req.files?.profile) {
            let fName = req.files.profile.name;
            let locationtosave = __dirname + "/public/uploads/" + fName;
            await req.files.profile.mv(locationtosave);

            const profileUploadResult = await cloudinary.uploader.upload(locationtosave);
            profilepicurl = profileUploadResult.url;
        }

        let email = req.body.txtmail;
        let address = req.body.address;
        let contact = req.body.contact;
        let game = req.body.types;
        let otherinfo = req.body.otherinfo;

        mySqlVen.query(
            "update  player set picurl1=?,picurl=?,name=?,gender=?,dob=?,address=?,contactnumber=?,games=?,info = ? where emailid = ?",
            [ acardpicurl, profilepicurl, jsonData.name, jsonData.gender, jsonData.dob, address, contact, game, otherinfo,email],
            function (errKuch) {
                if (errKuch == null) {
                    resp.send(" update profile");
                } else {
                    resp.send(errKuch.message);
                }
            }
        );

    } catch (err) {
        console.error("ERROR:", err);
        resp.status(500).send("Something went wrong");
    }
})

//====================== Fetch Data From Database When Click On Getdata Button Starts ======================//

app.get("/getdata",function(req,resp){
    let email=req.query.txtmail;
    // console.log(email);

    
    mySqlVen.query("select * from player where emailid=?", [email], function (error,jsonarray) {
        if (error == null)
            resp.send(jsonarray);
        else
            resp.send(error.message);
})
})

//====================== Fetch Data From Database When Click On Getdata Button Ends ======================//


//==================================================== Player Profile.html Page Ends =============================================//



//==================================================== Tournament Finder.html Page Starts =============================================//

app.get("/do-fetch-city",function(req,resp){
    let email=req.query.txtemail;
    // console.log(email);

    
    mySqlVen.query("select distinct city from tournament", function (error,jsonarray) {
        if (error == null)
            resp.send(jsonarray);
        else
            resp.send(error.message);
})
})

app.get("/do-fetch-games",function(req,resp){
    let email=req.query.txtemail;
    // console.log(email);

    
    mySqlVen.query("select distinct sports from tournament", function (error,jsonarray) {
        if (error == null)
            resp.send(jsonarray);
        else
            resp.send(error.message);
})
})

app.get("/do-fetchtournament",function(req,resp){
    let sports=req.query.sports;
     let city=req.query.city;
    // console.log(email);

    
    mySqlVen.query("select * from tournament where sports=? and city=?",[sports,city], function (error,jsonarray) {
        if (error == null)
            resp.send(jsonarray);
        else
            resp.send(error.message);
})
})

app.get("/do-fetchorganiser",function(req,resp){
// console.log(req.query.rid);
   let email=req.query.mail;
   console.log(email);
    mySqlVen.query("select * from organiser where txtmail=?",[email], function (error,jsonarray) {
        if (error == null)
            resp.send(jsonarray);
        else
            resp.send(error.message);
})
})

//==================================================== Tournament Finder.html Page Ends =============================================//


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////// Player Dashboard Ends ///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////// Admin Dashboard Starts ///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//==================================================== User Console.html Page Starts =============================================//


app.get("/do-fetch-all-users",function(req,resp){
    let email=req.query.txtemail;
    // console.log(email);

    mySqlVen.query("select * from user", function (error,jsonarray) {
        if (error == null)
            resp.send(jsonarray);
        else
            resp.send(error.message);
})
})

app.get("/do-resume-users",function(req,resp){
    let email=req.query.emailid;
    // console.log(email);

    mySqlVen.query("update user set status=1 where emailid=?",[email], function (error,jsonarray) {
        if (error == null)
            resp.send("User Resumed Successfully");
        else
            resp.send(error.message);
})
})

app.get("/do-block-users",function(req,resp){
    let email=req.query.emailid;
    // console.log(email);

    mySqlVen.query("update user set status=0 where emailid=?",[email], function (error,jsonarray) {
        if (error == null)
            resp.send("User blocked Successfully");
        else
            resp.send(error.message);
})
})

//==================================================== User Console.html Page Ends =============================================//


//==================================================== Player Data.html Page Starts =============================================//

app.get("/do-fetch-all-players",function(req,resp){
 
 

    mySqlVen.query("select * from player", function (error,jsonarray) {
        if (error == null)
            resp.send(jsonarray);
        else
            resp.send(error.message);
})
})

//==================================================== Player Data.html Page Ends =============================================//


//==================================================== Organiser Data.html Page Starts =============================================//

app.get("/do-fetch-organiser-data",function(req,resp){
    let email=req.query.txtemail;
    // console.log(email);

    mySqlVen.query("select * from organiser", function (error,jsonarray) {
        if (error == null)
            resp.send(jsonarray);
        else
            resp.send(error.message);
})
})

//==================================================== Organiser Data.html Page Ends =============================================//



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////// Admin Dashboard Ends ///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//======================= NODEMAILER STARTS =======================================//

// Set up the nodemailer transporter=====================================//
var transporter = nodemailer.createTransport({
    secure: false,
    host: 'smtp.gmail.com',
    auth: {
        user: 'kashis3333@gmail.com',
        pass: 'vtknwpqisyancdse', 
    }
})


app.post("/sendfeedback",function (req,resp){
    var name=req.body.name;// ethe ohi textboxes de names 
    var email=req.body.mail;
    var feedback=req.body.feedback; //ethe v 
//  email content
var subject = "Feedback from "+name ;
var message = "<b> Email : <b>"+email+"<br><b> Feedback: <b><br>"+feedback;
// Send email
transporter.sendMail({
    to:"kashis3333@gmail.com",
    subject: subject,
    html: message
})
    console.log("Email sent");
    resp.send("Feedback sent successfully!");
})

//======================= NODEMAILER ENDS =======================================//



















































