const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
    res.send(200,"Hello World");
})
router.get('/:id',(req,res)=>{
    res.send(200,"Hello World "+req.params.id);
})

module.exports=router