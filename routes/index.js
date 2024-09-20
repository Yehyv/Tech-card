const express = require('express');
const router = require('express').Router(); 

router.get('/',(req,res)=>{
    res.send('Hello in home page');
})

module.exports = router;