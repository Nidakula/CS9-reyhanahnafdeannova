const transactionRepository = require("../repositories/transaction.repository");
const itemRepository = require("../repositories/item.repository");
const userRepository = require("../repositories/user.repository");
const baseResponse = require("../utils/baseResponse.util");

exports.createTransaction = async (req, res) => {
    try {
        const { item_id, quantity, user_id } = req.body;

        // Validasi input
        if (quantity <= 0) {
            return baseResponse(res, false, 400, "Quantity must be larger than 0", null);
        }
        if (!item_id || !quantity || !user_id) {
            return baseResponse(res, false, 400, "Invalid request. Provide item_id, quantity, and user_id.");
        }

        // Ambil detail item untuk hitung total transaksi
        const item = await itemRepository.getItemById(item_id);
        if (!item) {
            return baseResponse(res, false, 404, "Item not found", null);
        }

        // Total transaksi dihitung dari price * quantity
        const total = item.price * quantity;

        // Buat transaksi baru dengan status "pending"
        const newTransaction = await transactionRepository.createTransaction({
            user_id,
            item_id,
            quantity,
            total,
            status: "pending"
        });

        baseResponse(res, true, 201, "Transaction created", newTransaction);
    } catch (error) {
        console.error("Error creating transaction:", error);
        baseResponse(res, false, 500, "An error occurred while creating transaction", error.message);
    }
};

exports.payTransaction = async (req, res) => {
    try {
        const id = req.params.id.trim(); // pastikan tidak ada spasi

        // Ambil data transaksi
        const transaction = await transactionRepository.getTransactionById(id);
        if (!transaction) {
            return baseResponse(res, false, 404, "Transaction not found", null);
        }

        // Jika transaksi sudah dibayar, kembalikan response (opsional)
        if (transaction.status === "paid") {
            return baseResponse(res, false, 400, "Transaction already paid", null);
        }

        // Ambil data item terkait
        const item = await itemRepository.getItemById(transaction.item_id);
        if (!item) {
            return baseResponse(res, false, 404, "Item not found", null);
        }

        // Validasi: periksa apakah stok mencukupi
        if (item.stock < transaction.quantity) {
            return baseResponse(res, false, 400, "Insufficient item stock", null);
        }

        // Perbarui transaksi menjadi "paid"
        const updatedTransaction = await transactionRepository.updateTransactionStatus(id, "paid");

        // Kurangi stok item
        const newStock = item.stock - transaction.quantity;
        await itemRepository.updateItem({
            id: item.id,
            name: item.name,
            price: item.price,
            store_id: item.store_id,
            image_url: item.image_url,
            stock: newStock
        });

        // Kurangi saldo user dengan menggunakan topUp dan nilai negatif
        // topUp telah dimodifikasi untuk validasi: jika saldo tidak mencukupi, update tidak terjadi
        const updatedUser = await userRepository.topUp({
            id: transaction.user_id,
            amount: -transaction.total
        });
        if (!updatedUser) {
            return baseResponse(res, false, 400, "Insufficient user balance", null);
        }

        baseResponse(res, true, 200, "Payment successful", updatedTransaction);
    } catch (error) {
        console.error("Error paying transaction:", error);
        baseResponse(res, false, 500, "Failed to pay", error.message);
    }
};


exports.deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedTransaction = await transactionRepository.deleteTransaction(id);
        if (!deletedTransaction) {
            return baseResponse(res, false, 404, "Transaction not found", null);
        }

        baseResponse(res, true, 200, "Transaction deleted", deletedTransaction);
    } catch (error) {
        console.error("Error deleting transaction:", error);
        baseResponse(res, false, 500, "An error occurred while deleting transaction", error.message);
    }
};

exports.getAllTransactions = async (req, res) => {
    try {
      const transactions = await transactionRepository.getAllTransactions();
      res.status(200).json({
        success: true,
        message: "Transactions found",
        payload: transactions
      });
    } catch (err) {
      console.error("Error getting transactions:", err);
      res.status(500).json({
        success: false,
        message: "Failed to get transactions"
      });
    }
  };
  
