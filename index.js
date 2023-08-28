const express = require("express");
const { users } = require("./data/users.json");

const app = express();

const PORT = 8081;

app.use(express.json());


app.get("/", (req, res) => {
    res.status(200).json({
        message: "server is up and running sucessfully",
    });
});

/**
 * Routes:/users
 * Method:GET
 * Description:Get all users
 * Access:Public
 * Parameters:None
 */


app.get("/users", (req, res) => { 
    res.status(200).json({
        success: true,
        data: users,
    });
});

/**
 * Routes:/users/:id
 * Method:GET
 * Description:Get user by their id
 * Access:Public
 * Parameters:id
 */

app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const user = users.find((each) => each.id === id);
    if (!users) {
        return res.status(404).json({
            success: false,
            message: "User nort found",
        });
    }
    return res.status(200).json({
        success: true,
        message: "User Found",
        data: user,
    });
});


app.get("*", (req, res) => {
    res.status(404).json({
        message: "This route doesn't exist",
    });
});

/**
 * Routes:/users
 * Method:POST
 * Description:Create a new user 
 * Access:Public
 * Parameters:None
 */

app.post("/users", (req,res) =>{
    const {id,name,surname,email,subscriptionType,subscriptionDate} =
    req.body;
    
const user = users.find((each) =>each.id === id);

if(user){
    return res.status(404).json({
        success: false,
        message: "User Exist with this Id ",
    });
}

users.push({
    id,
    name,
    surname,
    email,
    subscriptionType,
    subscriptionDate
});
    return res.status(201).json({
        success: true,
        data: users
    })
})


app.listen(PORT, () => {
    console.log(`server is up and running at PORT ${PORT}`);
})