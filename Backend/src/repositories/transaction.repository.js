const db = require("../database/pg.database");

exports.createTransaction = async ({ user_id, item_id, quantity, total, status }) => {
    try {
        const res = await db.query(
            `INSERT INTO transactions (user_id, item_id, quantity, total, status)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [user_id, item_id, quantity, total, status]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query in createTransaction", error);
        throw error;
    }
};

exports.getTransactionById = async (id) => {
    try {
        const res = await db.query("SELECT * FROM transactions WHERE id = $1", [id]);
        return res.rows[0] || null;
    } catch (error) {
        console.error("Error executing query in getTransactionById", error);
        throw error;
    }
};

exports.updateTransactionStatus = async (id, status) => {
    try {
        const res = await db.query(
            "UPDATE transactions SET status = $1 WHERE id = $2 RETURNING *",
            [status, id]
        );
        return res.rows[0] || null;
    } catch (error) {
        console.error("Error executing query in updateTransactionStatus", error);
        throw error;
    }
};

exports.deleteTransaction = async (id) => {
    try {
        const res = await db.query(
            "DELETE FROM transactions WHERE id = $1 RETURNING *",
            [id]
        );
        return res.rows[0] || null;
    } catch (error) {
        console.error("Error executing query in deleteTransaction", error);
        throw error;
    }
};

exports.getAllTransactions = async () => {
  const query = `
    SELECT 
      t.*,
      to_jsonb(u) AS user,
      to_jsonb(i) AS item
    FROM transactions t
    JOIN users u ON t.user_id = u.id
    JOIN items i ON t.item_id = i.id
  `;
  const result = await db.query(query);
  return result.rows;
};
