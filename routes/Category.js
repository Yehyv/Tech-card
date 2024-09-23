const express = require('express');
const Category = require('../models/Category');
const router = require('express').Router(); 
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');


//create new category
router.post('/CreateCategory', authMiddleware, authorizeRoles('admin'),async(req,res)=>{
    try {
        const  category = await Category.create(req.body);
        res.status(200).json(category);

    } catch (error) {
        res.status(400).json({error:error.message});
    }
});

//getting all categories
router.get('/categories', authMiddleware, authorizeRoles('admin','user'),async(req,res)=>{
    try {
        const category = await Category.find({})
        res.status(200).json(category);

    } catch (error) {
        res.status(400).json({error:message.error});
    }

})

module.exports = router;