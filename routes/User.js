require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = require('express').Router(); 

console.log('JWT Secret:', process.env.JWT_SECRET); // Add this line for debugging

//Generate JWT token
const generateToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '1h'})
};


//create user
router.post('/createUser',async(req,res)=>{
    const{name,username, password,role} = req.body;
    try {
        const user = await User.create({name,username,password,role});
        res.status(200).json({ message: 'User registered successfully',user });

    } catch (error) {
        res.status(400).json({error:error.message});
    }
})


//getting all users
router.get('/users',async(req,res)=>{
    try {
        const users= await User.find({active:true}).select('-password') //exclude password from response
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({error:error.message});
    }
});


//getting specific user
router.get('/user/:id',async(req,res)=>{
    const{id} = req.params;
    try {
       const user = await User.findById(id).select('-password'); //exclude password from response
       if(!user || !user.active){
            return res.status(404).json(`can't find user with this id: ${req.params.id}`)
       }
       res.status(200).json(user);
    } catch (error) {
        res.status(400).json({error:error.message});
    }
});


//update user
router.put('/user/:id',async(req,res)=>{
    const{id} = req.params;
    const updates = req.body;
    try {
        const user = await User.findByIdAndUpdate(id,updates).select('-password')
        if(!user || !user.active){
            return res.status(400).json({message:`can't find user with this id : ${id}`});
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({error:error.message});
    }
})

//soft delete user (make it inactive)
router.delete('/user/:id',async(req,res)=>{
    const{id} = req.params;
    try {
        const user = await User.findByIdAndUpdate(id,{active:false},{new:true}).select('-password');
        if(!user){
           return res.status(404).json({message:`Cannot find user with this id: ${id}`});
        }
        res.status(200).json({message: 'User deleted successfully'})
    } catch (error) {
        res.status(400).json({error:error.messge})
    }
});

//login
router.post('/login',async(req,res)=>{
    const{username,password} =req.body;
    try {
        const user = await User.findOne({username});
        if(!user || !user.active){
            return res.status(401).json({error:'Invalid credentials or user is inactive'})
        }
        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(401).json({error: 'invalid credentials'})
        }
        const token = generateToken(user._id);
        res.json({token});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
});

//logout
router.post('/logout',(req,res)=>{
    res.json({message:'logout successfully'});
})

//change password
router.put('/change-password/:id',async(req,res)=>{
    const {oldPassword, newPassowrd} = req.body;
    const{id} = req.params;
    try {
        const user = await User.findById(id);
        if(!user || !user.active){
            return res.status(404).json({message:'user not found or inactive'});
        }
        const isMatch = await user.comparePassword(oldPassword);
        if(!isMatch){
            return res.status(404).json({message:'Old password is incorrect'});
        }
        user.password = newPassowrd;
        await user.save();
        res.json({message: 'password changed successfully'});

    } catch (error) {
        res.status(500).json({error:error.message});
    }



})
module.exports = router;