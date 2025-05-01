const userRepository = require("../repositories/user.repository");
const baseResponse = require("../utils/baseResponse.util");
const bcrypt = require("bcrypt");

const emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

exports.register = async (req, res) => {
    try {
        const { email, password, name } = req.query;

        if (!email || !password || !name) {
            return baseResponse(res, false, 400, "Invalid request. Provide email, password, and name.");
        }

        // Validasi dengan regex
        if (!emailRegex.test(email)) {
            return baseResponse(res, false, 400, "Format email tidak valid.");
        }
        if (!passwordRegex.test(password)) {
            return baseResponse(res, false, 400, "Password harus minimal 8 karakter dengan kombinasi huruf dan angka.");
        }

        const existingUser = await userRepository.getUserByEmail(email);
        if (existingUser) {
            return baseResponse(res, false, 400, "Email already used", null);
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await userRepository.createUser({ email, password: hashedPassword, name });
        baseResponse(res, true, 201, "User created", newUser);
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while creating user", error);
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body || req.query; // Ambil data dari body

        if (!email || !password) {
            return baseResponse(res, false, 400, "Invalid request. Provide email and password.");
        }

        const user = await userRepository.getUserByEmail(email);
        if (!user) {
            return baseResponse(res, false, 401, "Invalid email or password", null);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return baseResponse(res, false, 401, "Invalid email or password", null);
        }

        // Hapus password sebelum mengirim respons
        const { password: _, ...userWithoutPassword } = user;

        baseResponse(res, true, 200, "Login success", userWithoutPassword);
    } catch (error) {
        console.error("Error in login:", error);
        baseResponse(res, false, 500, "An error occurred while logging in", error.message);
    }
};
exports.getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;

        const user = await userRepository.getUserByEmail(email);
        if (!user) {
            return baseResponse(res, false, 404, "User not found", null);
        }

        baseResponse(res, true, 200, "User found", user);
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while retrieving user", error);
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id, email, password, name } = req.body;

        if (!id || !email || !password || !name) {
            return baseResponse(res, false, 400, "Invalid request. Provide id, email, password, and name.");
        }

                // Validasi dengan regex
        if (!emailRegex.test(email)) {
            return baseResponse(res, false, 400, "Format email tidak valid.");
        }
        if (!passwordRegex.test(password)) {
            return baseResponse(res, false, 400, "Password harus minimal 8 karakter dengan kombinasi huruf dan angka.");
        }

        // Hash password sebelum update
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const updatedUser = await userRepository.updateUser({ id, email, password: hashedPassword, name });
        if (!updatedUser) {
            return baseResponse(res, false, 404, "User not found", null);
        }

        baseResponse(res, true, 200, "User updated", updatedUser);
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while updating user", error);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUser = await userRepository.deleteUser(id);
        if (!deletedUser) {
            return baseResponse(res, false, 404, "User not found", null);
        }

        baseResponse(res, true, 200, "User deleted", deletedUser);
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while deleting user", error);
    }
};

exports.topUp = async (req, res) => {
    try {
        // Mengambil parameter dari query
        const { id, amount } = req.query;

        // Validasi: pastikan id dan amount ada serta amount > 0
        if (!id || !amount) {
        return baseResponse(res, false, 400, "Invalid request. Provide id and amount.");
        }

        const topUpAmount = parseFloat(amount);
        if (topUpAmount <= 0) {
        return baseResponse(res, false, 400, "Amount must be larger than 0");
        }

        // Memperbarui balance di database
        const updatedUser = await userRepository.topUp({id, amount: topUpAmount});
        if (!updatedUser) {
            return baseResponse(res, false, 404, "User not found", null);
        }

        baseResponse(res, true, 200, "Top up successful", updatedUser);
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while topping up", error.message);
    }
};
