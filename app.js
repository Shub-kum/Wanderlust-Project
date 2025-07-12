const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); 

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
  
main()
.then(()=>{
console.log("connected to DB");
})
.catch((err)=>{
console.log(err);
}); 
async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extends:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req, res)=>{
res.send("hii i am port");
});

app.get("/listings",async (req, res)=>{
const allLinstings = await Listing.find({})
res.render("listings/index.ejs",{allLinstings});
 
});

app.get("/listings/new",(req, res)=>{
    res.render("listings/new.ejs");
})

app.get("/listings/:id", async (req, res)=>{
   let {id} = req.params;
   const listing = await Listing.findById(id); 
   res.render("listings/show.ejs",{listing})
});
app.post("/listings",async (req, res)=>{
    const newListing = new Listing(req.body);
    await newListing.save();
    res.redirect("/listings");
    });

app.get("/listings/:id/edit", async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id); 
    res.render("listings/edit.ejs",{listing});
});

app.put("/listings/:id", async (req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body});
    res.redirect(`/listings/${id}`);
});

app.delete("/listings/:id", async (req, res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});


// app.get("/testlisting", async (req, res)=>{
// let sampleListing = new Listing({
//     title : "My Hello Villa",
//     description : "By the beach",
//     price : 1200,
//     location : "Goa", 
//     country : "India",
// });
// await sampleListing.save()
// console.log("sample was saved");
// res.send("succsessfull testing");
// });

app.listen(8080, ()=>{
console.log("server is listen in 8080");
});