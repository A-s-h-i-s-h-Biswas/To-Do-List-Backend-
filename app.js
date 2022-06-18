const express=require("express");
const bodyParser=require("body-parser");
const app=express();

const _=require("lodash");

//Mongoose packege:
const mongoose=require("mongoose");
mongoose.connect("mongodb+srv://admin-ashishbiswas__:adminAtlasashish1%40@cluster0.yqcdngn.mongodb.net/todolistDB");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");

// Features of v-1.0 i.e array
// var items=["Buy Food", "Cook Food", "Eat Foot"];
// var workItems=[];

// in v-2.0 we will use Database MongoDB and Mongoose to store data

//schema for home root:
const iteamSchema=new mongoose.Schema({
    name:String
});
// schema for multiple dynamic templetes todolist:
const topicSchema=new mongoose.Schema({
    name:String,
    iteam:[iteamSchema]
});

//mongoose model obj for home root:
const Iteam=mongoose.model("toDoList",iteamSchema);
//mongoose model obj for home dynamic templetes:
const dyList=mongoose.model("dyList",topicSchema);

const iteam1=new Iteam({
    name:"This is iteam 1"
});
const iteam2=new Iteam({
    name:"This is iteam 2"
});
const iteam3=new Iteam({
    name:"This is iteam 3"
});

const arr=[iteam1,iteam2,iteam3];

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
            Iteam.insertMany(arr, function(err){
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

app.get("/:topic",function(req,res){
    const topicName=_.capitalize(req.params.topic);
    dyList.findOne({name:topicName},function(err,topicListFound){
        if(!err){
            if(!topicListFound){
                const newList=new dyList({
                    name:topicName,
                    iteam: arr
                });
                newList.save();
                res.redirect("/"+topicName);
            }
            else{
                res.render("list",{listName:topicName, iteamArray:topicListFound.iteam, year:fullyear});
            }
        }
    });
});

app.post("/",function(req, res){
    const Added=req.body.newItm;
    const _lName=req.body.button;
// making new model obj for newly added iteam:
    const newAdded=new Iteam({
    name:Added
    });
    if(_lName===day){
        newAdded.save();
        res.redirect("/");
    }
    else{
        dyList.findOne({name:_lName},function(err,foundList){
            if(!err){
                foundList.iteam.push(newAdded);
                foundList.save();
                // console.log(foundList.iteam.push(newAdded));
                res.redirect("/"+_lName);
            }
        });
    }

    
});

app.post("/delete",function(req,res){
    const removeId=req.body.remove;
    const removeTitle=req.body.listTitle;
    // console.log(removeTitle);
    //  console.log(removeId);
    if(removeTitle===day){
        Iteam.findByIdAndRemove(removeId,function(err){
            if(!err){
                console.log("successfully removed the id");
                res.redirect("/");
            }
        });
    }
    else{
        dyList.findOneAndUpdate({name: removeTitle}, {$pull: {iteam: {id: removeId}}}, function(err, foundList){
            if (!err){
              res.redirect("/" + removeTitle);
            }
          });
    }
    
});

app.listen(2000,function(){
    console.log("You are live in port 2000");
});