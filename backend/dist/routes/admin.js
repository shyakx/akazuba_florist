"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/products', (req, res) => {
    res.status(501).json({ message: 'Admin get products endpoint - Not implemented yet' });
});
router.get('/orders', (req, res) => {
    res.status(501).json({ message: 'Admin get orders endpoint - Not implemented yet' });
});
exports.default = router;
//# sourceMappingURL=admin.js.map