const db = require("../database/pg.database");

exports.createUser = async ({ email, password, name }) => {
    try {
        const res = await db.query(
            "INSERT INTO users (name, email, password, balance) VALUES ($1, $2, $3, 0) RETURNING *",
            [name, email, password]
        );        
        return res.rows[0] || null;
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.getUserByEmail = async (email) => {
    try {
        const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        return res.rows[0] || null;
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.updateUser = async ({ id, email, password, name }) => {
    try {
        const res = await db.query(
            "UPDATE users SET email = $1, password = $2, name = $3 WHERE id = $4 RETURNING *",
            [email, password, name, id]
        );
        return res.rows[0] || null;
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.deleteUser = async (id) => {
    try {
        const res = await db.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
        return res.rows[0] || null;
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.topUp = async ({ id, amount }) => {
    try {
        const res = await db.query(
            "UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING *",
            [amount, id]
        );
        return res.rows[0] || null;
    } catch (error) {
        console.error("Error executing query", error);
    }
};
