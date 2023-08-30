const express = require("express");
const {users} = require("../data/users.json");

const router = express.Router();


/**
 * Routes:/users
 * Method:GET
 * Description:Get all users
 * Access:Public
 * Parameters:None
 */


router.get("/", (req, res) => {
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

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const user = users.find((each) => each.id === id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }
    return res.status(200).json({
        success: true,
        // message: "User Found",
        data: user,
    });
});

/**
 * Routes:/users
 * Method:POST
 * Description:Create a new user 
 * Access:Public
 * Parameters:None
 */

router.post("/", (req, res) => {
    const { id, name, surname, email, subscriptionType, subscriptionDate } =
        req.body;

    const user = users.find((each) => each.id === id);

    if (user) {
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

/**
 * Routes:/users:id
 * Method:PUT
 * Description:updating user by their id
 * Access:Public
 * Parameters:id
 */

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    const user = users.find((each) => each.id === id);

    if (!user)
        return res.status(400).json({ success: false, message: "User Does Not Exit" });

    const updatedUser = users.map((each) => {
        if (each.id === id) {
            return {
                ...each,
                ...data
            }
        }
        return each;
    })
    return res.status(200).json({
        success: true,
        data: updatedUser
    })
})


/**
 * Routes:/users:id
 * Method:DELETE
 * Description:deleting a user by ID
 * Access:Public
 * Parameters:ID
 */
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const user = users.find((each) => each.id === id);

    if (!user)
        return res.status(404).json({ success: false, message: "User Not Found" });

    const index = users.indexOf(user);
    users.splice(index, 1);

    return res.status(200).json({ success: true, data: users });
})

/**
 * Routes:/users/subscription-details/:id
 * Method:GET
 * Description:Get all user subscription details by their ID
 * Access:Public
 * Parameters:ID
 */

router.get('/subscription-details/:id',(req,res) =>{
    const {id} = req.params;
    const user  = user.find((each) => each.id === id);
    if(!user)
    return res.status(404).json({success:false, message:"User with the given Id Doesn't exist"});

    const getDateInDays = (data = "") =>{

        let date;
        if(data  === ""){
            // current Date
            data = new Date();
    }
        else{
            // gettiing date on a basis of data variable
            date = new Date(data);
    }  
    let days = Math.floor(data / (1000* 60 *60 * 24));
    return days;  
    };

      const subscriptionType = (date) => {
        if(user.subscriptionType === "Basic"){
            date  = date + 90;

        }
        else if (user.subscriptionType === "Standard") {
            date = date + 270;

        }
        else if (user.subscriptionType === "Premium") {
            date = date + 365;

        }
        return date;  
      };
    // Subscription expiration calcus
    // Jan 1, 1970 ,UTC //milliseconds
    let returnDate = getDateInDays(user.returnDate);
    let currentDate = getDateInDays();
    let subscriptionDate = getDateInDays(user.subscriptionDate);
    let subscriptionExpiration  = subscriptionType(subscriptionDate);

    const data = {
        ...user,
        subscriptionExpired: subscriptionExpiration < currentDate,
        daysLeftForExpiration:subscriptionExpiration <= currentDate ? 0: subscriptionDate  - currentDate,
        fine: returnDate < currentDate ? subscriptionExpiration <= currentDate ? 200:100:0,
    }
      res._construct.status(200).json({
        success:true,
        data,
      })        
})

module.exports = router;