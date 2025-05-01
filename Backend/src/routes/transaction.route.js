const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction.controller");

// Transaksi baru
router.post("/create", transactionController.createTransaction);

// Pembayaran transaksi (ubah status, kurangi stok & balance)
router.post("/pay/:id", transactionController.payTransaction);

// Hapus transaksi
router.delete("/:id", transactionController.deleteTransaction);

router.get('/', transactionController.getAllTransactions);

module.exports = router;
