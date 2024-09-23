const express = require('express');
const Category = require('../models/Category');
const router = require('express').Router(); 
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');


//create new category
router.post('/CreateCategory', authMiddleware, authorizeRoles('admin'),async(req,res)=>{
    try {
        const  category = await Category.create(req.body);
        const CatMap = {
            id: category._id,
            name: category.name,
            image: category.image
        }
        res.status(200).json(category._id);

    } catch (error) {
        res.status(400).json({error:error.message});
    }
});

//getting all categories
router.get('/categories', authMiddleware, authorizeRoles('admin','user'),async(req,res)=>{
    try {
        const category = await Category.find({})
        const catMap = category.map(cat => ({
            id: cat._id,
            name: cat.name,
            image: cat.image
        }));
        res.status(200).json(catMap);

    } catch (error) {
        res.status(400).json({error:message.error});
    }

})

module.exports = router;