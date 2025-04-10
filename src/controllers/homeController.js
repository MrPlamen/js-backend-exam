import { Router } from "express";

import sneakersService from "../services/sneakersService.js";
import { getErrorMessage } from "../utils/errorUtils.js";
import { isAuthRouteGuard } from "../middlewares/authMiddleware.js";

const homeController = Router();

homeController.get('/', async (req, res) => {
    try {
        const sneakers = await sneakersService.getLatest();

        res.render('home', { sneakers });
    } catch (error) {
        const currentError = getErrorMessage(error);
        res.render('home', { error: currentError });
    }
})

homeController.get('/about', (req, res) => {
    res.render('about');
});

homeController.get('/profile', isAuthRouteGuard, async (req, res) => {
    const ownSneakers = await sneakersService.getAll({ owner: req.user._id });
    const preferredSneakers = await sneakersService.getAll({ preferredBy: req.user._id });
    
    res.render('profile', {
        ownSneakers,
        preferredSneakers
    });
});

export default homeController;