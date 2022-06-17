const express=require("express");
const bodyParser=require("body-parser");
const app=express();

//Mongoose packege:
const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/todolistDB");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");

// Features of v-1.0 i.e array
// var items=["Buy Food", "Cook Food", "Eat Foot"];
// var workItems=[];

// in v-2.0 we will use Database MongoDB and Mongoose to store data

const iteamSchema=new mongoose.Schema({
    name:String
});
const Iteam=mongoose.model("toDoList",iteamSchema);
const iteam1=new Iteam({
    name:"This is iteam 1"
});
const iteam2=new Iteam({
    name:"This is iteam 2"
});
const iteam3=new Iteam({
    name:"This is iteam 3"
});

// successfully model objects are created

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
  
// added into database successfully
    Iteam.find({},function(err,foundIteam){
        if(foundIteam.length===0){
            Iteam.insertMany([iteam1,iteam2,iteam3], function(err){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("Successfully added to database");
                }
            });
            res.redirect("/");
        }
        else{
            res.render("list",{listName:day, iteamArray:foundIteam, year:fullyear});
        }
// added into database successfully
    });
    
});

app.get("/workList",function(req,res){
    res.render("list",{listName:"Work" , iteamArray:workItems, year:fullyear});
});

app.post("/",function(req, res){
    console.log(req.body.remove);
    var Added=req.body.newItm;
// making new model obj for newly added iteam:
    const newAdded=new Iteam({
        name:Added
    });
    newAdded.save();
    res.redirect("/");

// these are for work todolist i will see it later
    // if(req.body.remove==="Work" || req.body.remove===day){
    //     if(req.body.remove==="Work"){
    //         workItems.pop();
    //         res.redirect("/workList");
    //     }
    //     else{
    //         items.pop();
    //         res.redirect("/");
    //     }
    // }

    // else if(req.body.button==="Work"){
    //     workItems.push(iteam);
    //     res.redirect("/workList");
    // }
    // else{
    //     items.push(iteam);
    //     res.redirect("/");
    // }
});

app.post("/delete",function(req,res){
    const removeId=req.body.remove;
    Iteam.findByIdAndRemove(removeId,function(err){
        if(!err){
            console.log("successfully removed the id");
            res.redirect("/");
        }
    });
});

app.listen(2000,function(){
    console.log("You are live in port 2000");
});