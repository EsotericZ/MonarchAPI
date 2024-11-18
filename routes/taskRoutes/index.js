let express = require('express');
let router = express.Router();

const taskController = require('../../controllers/taskController');

router.get('/getAllTasks', taskController.getAllTasks);
router.post('/createTask', taskController.createTask);
router.post('/updateTaskNote', taskController.updateTaskNote);

module.exports = router;