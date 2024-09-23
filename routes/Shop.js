const express = require('express');
const Shops = require('../models/Shop');
const Category = require('../models/Category');
const router = require('express').Router(); 
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');


//creating new shop
router.post('/CreateShop', authMiddleware, authorizeRoles('admin'),async(req,res)=>{
    try {
        const shop = await Shops.create(req.body);
        res.status(200).json(shop);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:error.message});
    }
})


//getting all shops (Latest offers)
router.get('/shops', authMiddleware, authorizeRoles('admin','user'),async(req,res)=>{
    try {
        const shops = await Shops.find({}).sort({updatedAt:-1}).populate('category');
        res.status(200).json(shops);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:error.message});
    }
})

//getting shops according to specific category
router.get('/category/:categoryId/shops', authMiddleware, authorizeRoles('admin','user'),async(req,res)=>{
    try {
        const shops = await Shops.find({category: req.params.categoryId}).populate('category');
        if(!shops){
            return res.status(404).json(`no shops found for this category`);
        }
        res.status(200).json(shops);
    } catch (error) {
        res.status(500).json({message:message.error});
    }
});


//getting specefic shop
router.get('/shop/:id', authMiddleware, authorizeRoles('admin','user'),async(req,res)=>{
    try {
        const{id} = req.params;
        const shop = await Shops.findById(id);
        res.status(200).json(shop);
    } catch (error) {
        res.status(500).json({message:message.error});
    }
})


//update shop details
router.put('/shop/:id', authMiddleware, authorizeRoles('admin'),async(req,res)=>{
    try {
        const{id} = req.params;
        const shop = await Shops.findByIdAndUpdate(id,req.body);
        if(!shop){
            return res.status(404).json({message:`cannot find any products with id ${id}`});
        }
        const updatedShop = await Shops.findById(id);
        res.status(200).json(updatedShop);
    } catch (error) {
        res.status(500).json({message:message.error});
    }
})

//deleting specefic shop
router.delete('/shop/:id', authMiddleware, authorizeRoles('admin'),async(req,res)=>{
    try {
        const {id} = req.params;
        const shop = await Shops.findByIdAndDelete(id);
        if(!shop){
            return res.status(404).json({message: `cannot find shop with id ${id}`});
            
        }
        res.status(200).json(shop);
    } catch (error) {
        res.status(500).json({message:message.error});
    }
})

module.exports = router;