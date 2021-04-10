const express = require('express');
const router = express.Router();
const flags = require('../Flags');
const gameJs = require('../public/game');


router.get('/',(req,res) => {
   
    res.render('main',{layout: 'index'});
});

router.get('/secretPath',(req,res) => {
   
    res.render('secretPath',{layout: 'index'});
});

router.post('/tictactoe',(req,res) =>{

    const result = req.body.result;
    if(result == "win" ){
        res.status(200).json({msg: "Thank you for playing", tictac:flags.tictactoe});
    }
    else if(result == "draw"){
        res.status(200).json({msg: "Draw", tictac:"Try again"});
    }
    else{
        res.status(200).json({msg: "Better luck next time!", tictac:"Try again"})
    }
});

module.exports = router;