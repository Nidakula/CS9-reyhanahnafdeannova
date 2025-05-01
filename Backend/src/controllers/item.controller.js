const axios = require("axios");
const itemRepository = require("../repositories/item.repository");
const storeRepository = require("../repositories/store.repository");
const baseResponse = require("../utils/baseResponse.util");
const stream = require("stream");
const FormData = require("form-data");

exports.createItem = async (req, res) => {
    try {
        const { name, price, store_id, stock } = req.body;
        const image = req.file;

        if (!name || !price || !store_id || !stock || !image) {
            return baseResponse(res, false, 400, "Invalid request. Provide all required fields.");
        }

        // Check if store exists
        const storeExists = await storeRepository.getStoreById(store_id);
        if (!storeExists) {
            return baseResponse(res, false, 404, "Store doesnt exist", null);
        }

        // UPLOAD IMAGE TO ZIPLINE
        const formData = new FormData();
        const bufferStream = new stream.PassThrough();
        bufferStream.end(image.buffer);
        formData.append("file", bufferStream, {
            filename: image.originalname,
            contentType: image.mimetype,
        });

        // In your createItem function where you handle the Zipline response:
        const imageResponse = await axios.post(
            `${process.env.BASE_URL_ZIPLINE}/api/upload`,
            formData,
            {
                headers: {
                    Authorization: `${process.env.TOKEN_ZIPLINE}`,
                    ...formData.getHeaders(),
                },
            }
        );

        // This is where the change is needed
        if (!imageResponse.data || !imageResponse.data.files || imageResponse.data.files.length === 0) {
            console.error("Invalid or empty response from Zipline:", imageResponse.data);
            return baseResponse(res, false, 500, "Failed to upload image to Zipline");
        }

        // Use the first URL from the files array
        const imageUrl = imageResponse.data.files[0];

        // INSERT DATA TO DATABASE
        const newItem = await itemRepository.createItem({
            name,
            price,
            store_id,
            image_url: imageUrl,
            stock
        });

        baseResponse(res, true, 201, "Item created", newItem);
    } catch (error) {
        console.error("Error creating item:", error);
        baseResponse(res, false, 500, "An error occurred while creating item", error.message);
    }
};

exports.getAllItems = async (req, res) => {
    try {
        const items = await itemRepository.getAllItems();
        baseResponse(res, true, 200, "Items found", items);
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while retrieving items", error);
    }
};

exports.getItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await itemRepository.getItemById(id);

        if (!item) {
            return baseResponse(res, false, 404, "Item not found", null);
        }
        baseResponse(res, true, 200, "Item found", item);
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while retrieving item", error);
    }
};

exports.getItemsByStoreId = async (req, res) => {
    try {
        const { store_id } = req.params;
        
        // Check if store exists
        const storeExists = await storeRepository.getStoreById(store_id);
        if (!storeExists) {
            return baseResponse(res, false, 404, "Store doesnt exist", null);
        }
        
        const items = await itemRepository.getItemsByStoreId(store_id);
        baseResponse(res, true, 200, "Items found", items);
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while retrieving items", error);
    }
};

exports.updateItem = async (req, res) => {
    try {
        const { id, name, price, store_id, stock } = req.body;
        const image = req.file;
        let image_url = null;

        if (!id || !name || !price || !store_id || !stock) {
            return baseResponse(res, false, 400, "Invalid request. Provide all required fields.");
        }

        // Check if item exists
        const itemExists = await itemRepository.getItemById(id);
        if (!itemExists) {
            return baseResponse(res, false, 404, "Item not found", null);
        }

        // Check if store exists
        const storeExists = await storeRepository.getStoreById(store_id);
        if (!storeExists) {
            return baseResponse(res, false, 404, "Store doesnt exist", null);
        }

        // Upload image if provided
        if (image) {
            const formData = new FormData();
            const bufferStream = new stream.PassThrough();
            bufferStream.end(image.buffer);
            formData.append("file", bufferStream, {
                filename: image.originalname,
                contentType: image.mimetype,
            });

        // In your updateItem function:
        const imageResponse = await axios.post(
            `${process.env.BASE_URL_ZIPLINE}/api/upload`,
            formData,
            {
                headers: {
                    Authorization: `${process.env.TOKEN_ZIPLINE}`,
                    ...formData.getHeaders(),
                },
            }
        );

        if (!imageResponse.data || !imageResponse.data.files || imageResponse.data.files.length === 0) {
            console.error("Invalid or empty response from Zipline:", imageResponse.data);
            return baseResponse(res, false, 500, "Failed to upload image to Zipline");
        }

        image_url = imageResponse.data.files[0];
        }

        // Update item in database
        const updatedItem = await itemRepository.updateItem({
            id,
            name,
            description: itemExists.description, // Preserve existing description
            price,
            store_id,
            image_url,
            stock
        });

        baseResponse(res, true, 200, "Item updated", updatedItem);
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while updating item", error);
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        
        const deletedItem = await itemRepository.deleteItem(id);
        if (!deletedItem) {
            return baseResponse(res, false, 404, "Item not found", null);
        }
        
        baseResponse(res, true, 200, "Item deleted", deletedItem);
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while deleting item", error);
    }
};