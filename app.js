const express=require("express");
const bodyParser=require("body-parser");
const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");

var items=["Buy Food", "Cook Food", "Eat Foot"];
var workItems=[];

var today=new Date();
var day="";
var indx=0;
var fullyear=today.getFullYear();
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

for(let i=0;i<7;i++){
    if(today.getDay()==i){
            day=days[i];
            // indx=i;
            break;
    }
}

app.get("/",function(req,res){
    // res.send("Welcome to todolist app")
    
    res.render("list",{listName:day, iteamArray:items, year:fullyear});
});

app.get("/workList",function(req,res){
    // 
    // console.log();
    res.render("list",{listName:"Work" , iteamArray:workItems, year:fullyear});
});

app.post("/",function(req, res){
    console.log(req.body.remove);
    var iteam=req.body.newItm;

    if(req.body.remove==="Work" || req.body.remove===day){
        if(req.body.remove==="Work"){
            workItems.pop();
            res.redirect("/workList");
        }
        else{
            items.pop();
            res.redirect("/");
        }
    }

    else if(req.body.button==="Work"){
        workItems.push(iteam);
        res.redirect("/workList");
    }
    else{
        items.push(iteam);
        res.redirect("/");
    }
});

app.listen(2000,function(){
    console.log("You are live in port 2000");
});