const express = require('express');
const router = express.Router();
const { uploadLog, getAnalysis, getAllLogs } = require('../controllers/logController');

router.post('/', uploadLog);
router.get('/', getAllLogs);
router.get('/:id', getAnalysis);

module.exports = router;