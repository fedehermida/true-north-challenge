const express = require('express')

const {getTasks, updateTaskCompletion} = require('../../controllers/taskController')
const router = express.Router();

router.get('/tasks', getTasks)
router.put('/tasks', updateTaskCompletion)

module.exports = router