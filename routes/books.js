const express = require("express");

//Data import
const {books} = require("../data/books.json");
const {users} = require("../data/users.json");
const {route} = require("./users");

//Local Router
const router  = express.Router();

/**
 * Routes:/books
 * Method:GET
 * Description:Get all books
 * Access:Public
 * Parameters:None
 */
router.get("/", (req,res) =>{
    res.status(200).json({success:true, data:books});
})

/**
 * Routes:/books/:id
 * Method:GET
 * Description:Get a book by its id
 * Access:Public
 * Parameters:id
 */


router.get("/:id",(req,res) =>{
    const {id} = req.params;
    const book = books.find((each) => each.id === id);
    if (!book) {
        return res.status(404).json({
            success: false,
            message: "book not found",
        });
    }
    return res.status(200).json({
        success: true,
        data: book,
    });
});

/**
 * Routes:/books/issued/by-user
 * Method:GET
 * Description:Get all issued books
 * Access:Public
 * Parameters:None
 */

router.get("/issued/by-user", (req,res) =>{
    const usersWithIssuedBooks = users.filter((each) =>{
        if(each.issuedBook) return each;

    });

    const issuedBooks = [];
    usersWithIssuedBooks.forEach((each) =>{
        const book = books.find((book) => book.id === each.issuedBook);

        book.issuedBy = each.name;
        book.issuedDate = each.issuedDate;
        book.returnDate = each.returnDate;

        issuedBooks.push(book);
    });
    if(issuedBooks.length === 0){
        return res.status(404).json({success:false, message:"No books issued yet."});
    }
    return res.status(200).json({success:true, data:issuedBooks})


});

/**
 * Routes:/books/
 * Method:POST
 * Description:Create/Add a new book
 * Access:Public
 * Parameters:None
 * Data:Author,Name,Genre,Price,Publisher,id
 */

router.post("/", (req,res) =>{
    const {data} = req.body;

    if(!data){
        return res.status(400).json({
            success:false,
            message: "No data provided to add a book"
        }) 
    }

    const book = books.find((each) => each.id === data.id);
    if(book){
        return res.status(404).json({success:false, message:"Books with the given ID already exits"})
    }
    const allBooks = [...books,data];
    return res.status(200).json({success:true, data:allBooks})
})

/**
 * Routes:/books/:id
 * Method:PUT
 * Description:Update a book by its ID
 * Access:Public
 * Parameters:Id
 */

router.put("/:id",(req,res) =>{
    const {id} = req.params;
    const {data} = req.body;

    const  book = books.find((each) =>each.id === id)
    if(!book){
        return res.status(400).json({success:false, message:"Book with the given id doesn't exist"});

    }
    const updatedBook = users.map((each) => {
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
        data: updatedBook
    })

})

//Default Export
module.exports = router;