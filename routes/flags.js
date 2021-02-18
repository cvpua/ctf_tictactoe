const express = require('express');
const router = express.Router();
const flags = require('../Flags');




router.get('/tictactoe', (req,res) =>{

    res.json(flags);

});


router.post('/tictactoe',(req,res) =>{

    const result = req.body.result;
    if(result == "win" ){
        res.status(200).json({msg: "U so good", tictac:flags.tictactoe});
    }else{
        res.status(200).json({msg: "Better luck next time!"})
    }
});

module.exports = router;