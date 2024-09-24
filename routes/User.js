require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = require('express').Router();
const bcrypt = require('bcrypt');
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');




console.log('JWT Secret:', process.env.JWT_SECRET); // Add this line for debugging

//Generate JWT token
const generateToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '1h'})
};


//create user
router.post('/createUser', authMiddleware, authorizeRoles('admin'),async(req,res)=>{
    const{name,username, password,role} = req.body;
    try {
        const user = await User.create({name,username,password,role});
        res.status(200).json({ message: 'User registered successfully',user });

    } catch (error) {
        res.status(400).json({error:error.message});
    }
})


//getting all users
router.get('/users', authMiddleware, authorizeRoles('admin'),async(req,res)=>{
    try {
        const users= await User.find({active:true}).select('-password') //exclude password from response
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({error:error.message});
    }
});


//getting specific user
router.get('/user/:id', authMiddleware, authorizeRoles('admin'),async(req,res)=>{
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
router.put('/user/:id', authMiddleware, authorizeRoles('admin'),async(req,res)=>{
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
router.delete('/user/:id', authMiddleware, authorizeRoles('admin'),async(req,res)=>{
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
        if(user.role == 'admin'){
            return res.json({token, redirect: '/dashboard'});
        }
        else{
            return res.json({token , redirect:'/app'});
        }
    } catch (error) {
        res.status(500).json({error:error.message});
    }
});

//logout
router.post('/logout', authMiddleware, authorizeRoles('admin','user'),(req,res)=>{
    res.json({message:'logout successfully'});
})

//change password
router.put('/change-password/:id', authMiddleware, authorizeRoles('admin'),async(req,res)=>{
    const {oldPassword, newPassword} = req.body;
    const{id} = req.params;
    console.log("test1")

    try {
        const user = await User.findById(id);
        if(!user || !user.active){
            return res.status(404).json({message:'user not found or inactive'});
        }
        const isMatch = await user.comparePassword(oldPassword);
        
        if(!isMatch){
            return res.status(404).json({message:'Old password is incorrect'});
        }
        console.log(newPassword);

        const hashedPassword = await bcrypt.hash(newPassword,10);
        console.log("test2")

        user.password = hashedPassword;
        console.log("test3")

        await user.save();
        console.log("test4")

        console.log("Old Password:", oldPassword);
        console.log("New Password:", newPassword);
        res.json({message: 'password changed successfully'});

    } catch (error) {
        res.status(500).json({error:error.message});
    }



})
module.exports = router;