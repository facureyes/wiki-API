const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.listen(3000, ()=>{
    console.log("Server running on port 3000.");
})

//  Connect to DB
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true });

// Define a schema for articles
const articleSchema = {
    title: {
        type: String,
        required: [true, "Set a title."]
    },
    content: {
        type: String,
        required: [true, "Set a content."]
    }
};

// Create model 
const Article = mongoose.model("Article", articleSchema);


app.route('/articles')
    .get((req, res)=>{
        Article.find({},(err, items)=>{
            if(!err){
                res.send(items);
            } else {
                res.send(err);
            }
        });
    })
    .post((req, res)=>{
        const newArticle = new Article({title: req.body.title, content: req.body.content})
        newArticle.save((err)=>{
            if(!err){
                res.send("Successfully added new article.");
            } else {
                res.send(err);
            }
        })  
    })
    .delete((req, res)=>{
        Article.deleteMany({},(err)=>{
            if(!err){
                res.send("Successfully deleted all articles.");
            }
        });
    })

app.route('/articles/:title')
    .get((req,res)=>{
        Article.findOne({title: req.params.title}, (err, item)=>{
            if(!err){
                res.send(item);
            } else {
                res.send(err);
            }
        });
    })
    .put((req,res)=>{
        Article.updateOne(  
        {title: req.params.title}, 
        {tile: req.body.title, content: req.body.content}, 
        (err)=>{
            if(!err){
                res.send("Successfully updated");
            } else {
                res.send(err);
            }
        });
    })
    .patch((req,res)=>{
        Article.updateOne(
        {title: req.params.tile}, 
        {$set: req.body}, 
        (err)=>{
            if(!err){
                res.send("Successfully updated.");
            } else {
                res.send(err);
            }
        });
    })
    .delete((req,res)=>{
        Article.deleteOne({title: req.params.title}, (err)=>{
            if(!err){
                res.send("Successfully deleted.");
            } else {
                res.send(err);
            }
        })
    })