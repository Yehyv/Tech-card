const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = require('express').Router(); 


//Generate JWT token
const generateToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '1h'})
};


//create user
router.post('/createUser',async(req,res)=>{
    const{username, password} = req.body;
    try {
        const user = await User.create({username,password});
        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        res.status(400).json({error:error.message});
    }
})
