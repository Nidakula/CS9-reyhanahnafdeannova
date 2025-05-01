const db = require("../database/pg.database");

exports.createItem = async ({ name, price, store_id, image_url, stock }) => {
    try {
        const res = await db.query(
            "INSERT INTO items (name, price, store_id, image_url, stock) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [name, price, store_id, image_url, stock]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
        throw error;
    }
};

exports.getAllItems = async () => {
    try {
        const res = await db.query("SELECT * FROM items");
        return res.rows;
    } catch (error) {
        console.error("Error executing query", error);
        throw error;
    }
};

exports.getItemById = async (id) => {
    try {
        const res = await db.query("SELECT * FROM items WHERE id = $1", [id]);
        return res.rows[0] || null;
    } catch (error) {
        console.error("Error executing query", error);
        throw error;
    }
};

exports.getItemsByStoreId = async (store_id) => {
    try {
        const res = await db.query("SELECT * FROM items WHERE store_id = $1", [store_id]);
        return res.rows;
    } catch (error) {
        console.error("Error executing query", error);
        throw error;
    }
};

exports.updateItem = async ({ id, name, price, store_id, image_url, stock }) => {
    try {
        const res = await db.query(
            "UPDATE items SET name = $1, price = $2, store_id = $3, image_url = COALESCE($4, image_url), stock = $5 WHERE id = $6 RETURNING *",
            [name, price, store_id, image_url, stock, id]
        );
        return res.rows[0] || null;
    } catch (error) {
        console.error("Error executing query", error);
        throw error;
    }
};

exports.deleteItem = async (id) => {
    try {
        const res = await db.query("DELETE FROM items WHERE id = $1 RETURNING *", [id]);
        return res.rows[0] || null;
    } catch (error) {
        console.error("Error executing query", error);
        throw error;
    }
};