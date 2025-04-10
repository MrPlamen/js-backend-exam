import Sneakers from "../models/Sneakers.js";

async function create(sneakersData, userId) {
    sneakersData.owner = userId;
    await Sneakers.create(sneakersData);
}

async function getLatest() {
    const sneakers = await Sneakers.find({}).sort({ createdAt: 'desc' }).limit(3);

    return sneakers;
}

async function getAll(filter = {}) {
    let query = Sneakers.find({});

    if (filter.owner) {
        query = query.find({ owner: filter.owner });
    }

    if (filter.preferredBy) {
        query = query.find({ preferredList: filter.preferredBy });
    }

    return query;
}

async function getOne(sneakersId) {
    const sneakers = await Sneakers.findOne({ _id: sneakersId });

    return sneakers;
}

async function prefer(sneakersId, userId) {
    const sneakers = await Sneakers.findById(sneakersId);

    if (sneakers.owner.equals(userId)) {
        throw new Error('Cannot prefer own offers!');
    }

    if (sneakers.preferredList.includes(userId)) {
        throw new Error('You have already preferred this offer!');
    }

    sneakers.preferredList.push(userId);

    return sneakers.save();
}

async function deleteOffer(sneakersId, userId) {
    const sneakers = await Sneakers.findById(sneakersId);

    if (!sneakers.owner.equals(userId)) {
        throw new Error('Cannot delete offers of other users!');
    }

    return await Sneakers.findByIdAndDelete(sneakersId);
}

async function update(sneakersId, userId, sneakersData) {
    const sneakers = await Sneakers.findById(sneakersId);

    if (!sneakers.owner.equals(userId)) {
        throw new Error('Cannot edit offers of other users!');
    }

    return await Sneakers.findByIdAndUpdate(sneakersId, sneakersData, { runValidators: true })
}

const sneakersService = {
    create,
    getLatest,
    getAll,
    getOne,
    prefer,
    deleteOffer,
    update
}

export default sneakersService;