"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/profile', (req, res) => {
    res.status(501).json({ message: 'Get profile endpoint - Not implemented yet' });
});
router.put('/profile', (req, res) => {
    res.status(501).json({ message: 'Update profile endpoint - Not implemented yet' });
});
exports.default = router;
//# sourceMappingURL=users.js.map