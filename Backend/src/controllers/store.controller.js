const storeRepository = require('../repositories/store.repository');
const baseResponse = require('../utils/baseResponse.util');

exports.getAllStores = async (req, res) => {
    try {
        const stores = await storeRepository.getAllStores();
        baseResponse(res, true, 200, "Stores retrieved successfully", stores);
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while retrieving stores", error);
    }
};

exports.createStore = async (req, res) => {
    if(!req.body.name || !req.body.address) {
        return baseResponse(res, false, 400, "Invalid request. Please provide a name and address for the store");
    }
    try {
        const store = await storeRepository.createStore(req.body);
        baseResponse(res, true, 201, 'Store created successfully', store);
    } catch (error) {
        baseResponse(res, false, 500, error.message || "An error occurred while creating the store", error);
    }     
};

exports.getStoreById = async (req, res) => {
    try {
        const { id } = req.params;
        const store = await storeRepository.getStoreById(id);

        if (!store) {
            return baseResponse(res, false, 404, "Store not found", null);
        }
        baseResponse(res, true, 200, "Store found", store);
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while retrieving store", error);
    }
};

exports.updateStore = async (req, res) => {
    const { id, name, address } = req.body;

    if (!id || !name || !address) {
        return baseResponse(res, false, 400, "Invalid request. Please provide store id, name, and address.");
    }

    try {
        const updatedStore = await storeRepository.updateStore({ id, name, address });

        if (!updatedStore) {
            return baseResponse(res, false, 404, "Store not found", null);
        }

        baseResponse(res, true, 200, "Store updated successfully", updatedStore);
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while updating store", error);
    }
};

exports.deleteStore = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedStore = await storeRepository.deleteStore(id);

        if (!deletedStore) {
            return baseResponse(res, false, 404, "Store not found", null);
        }
        baseResponse(res, true, 200, "Store deleted successfully", deletedStore);
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while deleting store", error);
    }
};
