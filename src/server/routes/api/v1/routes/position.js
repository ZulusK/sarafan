"use strict";
const express = require('express');
const router = express.Router();
const Utils = require('@utils');
const passport = require('passport');

const PositionDB = require('@DBfolder/position');
const ReviewDB = require('@DBfolder/review');

router.get('/:id', async (req, res, next) => {
    try {
        let position = await PositionDB.get.byID(req.params.id);

        if (position) {
            return res.json({
                success: true,
                item: position
            });
        } else {
            return Utils.sendError(res, 404, 'Not found');
        }
    } catch (err) {
        console.log(err)
        return Utils.sendError(res, 500, err)
    }
});

router.get('/:id/rating', async (req, res, next) => {
    try {

        let position = await PositionDB.get.byID(req.params.id);
        console.log(1,position)
        let stats = await position.calculateRating();
        let average = 0;
        for(let key in stats){
            average += stats[key];
        }
        average /= 5;
        stats.average = average;
        return res.json({
            success: true,
            item: stats
        })
    } catch (error) {
        console.log(error)
        return Utils.sendError(res, 500, error)
    }
});

router.get('/:id/reviews', async (req, res, next) => {
    try {
        let position = await PositionDB.get.byID(req.params.id);

        if (position) {
            return res.json({
                success: true,
                item: await ReviewDB.get.byTarget(position.id)
            });
        } else {
            return Utils.sendError(res, 404, 'Not found');
        }
    } catch (err) {
        console.log(err)
        return Utils.sendError(res, 500, err);
    }
});

module.exports = router;