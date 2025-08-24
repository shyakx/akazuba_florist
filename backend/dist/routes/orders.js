"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.status(501).json({ message: 'Get orders endpoint - Not implemented yet' });
});
router.post('/', (req, res) => {
    res.status(501).json({ message: 'Create order endpoint - Not implemented yet' });
});
exports.default = router;
//# sourceMappingURL=orders.js.map