"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.status(501).json({ message: 'Get cart endpoint - Not implemented yet' });
});
router.post('/items', (req, res) => {
    res.status(501).json({ message: 'Add item to cart endpoint - Not implemented yet' });
});
exports.default = router;
//# sourceMappingURL=cart.js.map