const { Router } = require('express');
const { addSchool, listSchools } = require('../controllers/schoolController');
const { addSchoolRules, listSchoolsRules, validate } = require('../middleware/validators');

const router = Router();

// POST /addSchool
router.post('/addSchool', addSchoolRules, validate, addSchool);

// GET /listSchools?latitude=<lat>&longitude=<lon>
router.get('/listSchools', listSchoolsRules, validate, listSchools);

module.exports = router;
