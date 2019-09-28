const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");


const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true });

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "welcome to your todolist"
});

const item2 = new Item({
    name: "Hit the + button to add a new item"
});

const item3 = new Item({
    name: "<-- Hit this to delete an item"
});

const defaultItems = [item1, item2, item3];

app.get("/", function(req, res) {

    let day = date();

    Item.find({}, function(err, foundItems) {

        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("added default Items");
                }
            });
            res.redirect("/");
        } else {
            res.render("list", { listTitle: day, newListItems: foundItems });
        }
    });
});

app.post("/", function(req, res) {

    const itemName = req.body.newItem;

    const item = new Item ({
    	name: itemName
    });
    item.save();

    res.redirect("/");
});

app.post("/delete", function(req,res){
	const checkedItemId = (req.body.checkbox);

	Item.findByIdAndRemove(checkedItemId, function(err){
		if (err) {
			console.log(err)
		} else {
			console.log("deleted checked item");
			res.redirect("/");
		}
	});

});

app.get("/work", function(req, res) {
    res.render("list", { listTitle: "Work List", newListItems: workItems });
});


app.listen(3000, function() {
    console.log("Server is running on port 3000");
});