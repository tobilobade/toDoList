// jshint esversion:6

require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require("mongoose");
const app = express();


app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true});


const itemsSchema={
    name: String
}

const Item= mongoose.model("Item", itemsSchema);



const Item1= new Item({
    name: "Hit the + button to add item"
})

const Item2= new Item({
    name: "Check box to delete item"
})

const defaultItem=[Item1, Item2];





app.get('/', function(req, res){
 



    let today= new Date();
    let options={
        weekday:"long",
        day: "numeric",
        month: "short",
        year:"numeric"
    };
    let day= today.toLocaleDateString("en-US" , options)

Item.find({}, function(err, founditems){

    if (founditems.length===0){
        Item.insertMany(defaultItem, function(err){
            if(err){
                console.log (err)
                }
            else{
                console.log("successfully updated to Database")
            }
});

    res.redirect("/");

    }else{
       res.render("list", {kindOfDay:day, newListItems: founditems}); 
    }

   
});



    
})

app.post('/', function(req,res){
    const itemName= req.body.newItem;

    const item = new Item({
        name:itemName
    });
    
    item.save();
    res.redirect("/")
})

app.post("/delete", function(req,res){
    const checkBoxItemId= req.body.checkbox

    Item.findByIdAndRemove(checkBoxItemId,function(err){
        if(err){
            console.log(err)
        }else{
            console.log("checkbox removed successfully")
        }
        res.redirect('/')
    })

})


app.listen(3000, function(){
    console.log("server is running on port 3000")
})