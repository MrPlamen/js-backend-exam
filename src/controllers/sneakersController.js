import { Router } from "express";

import sneakersService from "../services/sneakersService.js";
import { isAuthRouteGuard } from "../middlewares/authMiddleware.js";
import { getErrorMessage } from "../utils/errorUtils.js";

const sneakersController = Router();

sneakersController.get('/', async (req, res) => {
    try {
        const sneakers = await sneakersService.getAll();

        res.render('sneakers/catalog', { sneakers });
    } catch (error) {
        const currentError = getErrorMessage(error);
        res.render('sneakers/catalog', { error: currentError });
    }
});

sneakersController.get('/create', isAuthRouteGuard, (req, res) => {
    res.render('sneakers/create');
});

sneakersController.post('/create', isAuthRouteGuard, async (req, res) => {
    const sneakersData = req.body;
    const userId = req.user._id;

    try {
        await sneakersService.create(sneakersData, userId);

        res.redirect('/sneakers');
    } catch (error) {
        const currentError = getErrorMessage(error);
        res.render('sneakers/create', { error: currentError, sneakers: sneakersData })
    }
});

sneakersController.get('/:sneakersId/details', async (req, res) => {
    const sneakersId = req.params.sneakersId;
    const sneakers = await sneakersService.getOne(sneakersId);

    try {
        const isOwner = sneakers.owner.equals(req.user?._id);
        const isPreferred = sneakers.preferredList.includes(req.user?._id);

        res.render('sneakers/details', { sneakers, isOwner, isPreferred })
    } catch (error) {
        const currentError = getErrorMessage(error);
        res.render('/', { error: currentError })
    }
});

sneakersController.get('/:sneakersId/prefer', isAuthRouteGuard, async (req, res) => {
    const sneakersId = req.params.sneakersId;
    const userId = req.user._id;

    try {
        await sneakersService.prefer(sneakersId, userId);
        res.redirect(`/sneakers/${sneakersId}/details`);
    } catch (error) {
        const currentError = getErrorMessage(error);
        res.render('404', { error: currentError })
        // res.redirect(`/sneakers/${sneakersId}/details`);
    }
});

sneakersController.get('/:sneakersId/delete', isAuthRouteGuard, async (req, res) => {
    const sneakersId = req.params.sneakersId;
    const userId = req.user._id;

    try {
        await sneakersService.deleteOffer(sneakersId, userId);
        res.redirect('/sneakers');
    } catch (error) {
        const currentError = getErrorMessage(error);
        res.render('404', { error: currentError });
    }
});

sneakersController.get('/:sneakersId/edit', isAuthRouteGuard, async (req, res) => {
    const sneakersId = req.params.sneakersId;
    const sneakers = await sneakersService.getOne(sneakersId);
    const userId = req.user._id;

    try {
        if (!sneakers.owner.equals(userId)) {
            throw new Error('Cannot edit offers of other users!');
        }

        res.render('sneakers/edit', { sneakers })
    } catch (error) {
        const currentError = getErrorMessage(error);
        res.render('404', { error: currentError });
        //Look if the examers want to display or redirect to 404
        // res.redirect(`/sneakers/${sneakersId}/details`) 
    }

});

sneakersController.post('/:sneakersId/edit', isAuthRouteGuard, async (req, res) => {
    const sneakersId = req.params.sneakersId;
    const sneakersData = req.body;
    const userId = req.user._id;

    try {
        await sneakersService.update(sneakersId, userId, sneakersData);

        res.redirect(`/sneakers/${sneakersId}/details`);
    } catch (error) {
        const currentError = getErrorMessage(error);
        res.render('sneakers/edit', { sneakers: sneakersData, error: currentError });
    }
});

export default sneakersController;