const express = require("express")
const mongoose = require('mongoose')
const cors = require("cors")
const EmployeeModel = require('./models/Employee')

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb+srv://gokulprakash1109:NzNmyDtk24ESrRy7@cluster0.rlx96.mongodb.net/votingsystem")

// Pre-approved voter IDs
const validVoterIds = ['VID123456', 'VID789012', 'VID345678']; // Add your list of approved voter IDs here

app.post("/login", (req, res) => {
    const { email, password, voterId } = req.body;
    
    // Find user by email and voter ID
    EmployeeModel.findOne({ email: email, voterId: voterId })
    .then(user => {
        if (user) {
            if (user.password === password) {
                res.json("success")
            } else {
                res.json("The password is incorrect")
            }
        } else {
            res.json("No record exists with this email and voter ID")
        }
    })
})

app.post('/register', (req, res) => {
    const { voterId } = req.body;
    
    // Check if voter ID is in the pre-approved list
    if (!validVoterIds.includes(voterId)) {
        return res.json({ error: "Invalid voter ID" });
    }
    
    // Check if voter ID is already registered
    EmployeeModel.findOne({ voterId: voterId })
    .then(existingUser => {
        if (existingUser) {
            return res.json({ error: "This voter ID is already registered" });
        }
        
        // If voter ID is valid and not yet registered, create the new user
        EmployeeModel.create(req.body)
        .then(employee => res.json(employee))
        .catch(err => res.json(err))
    })
    .catch(err => res.json(err));
})

app.listen(3001, () => {
    console.log("server is running")
})