let express = require('express');
let router = express.Router();

const taskController = require('../../controllers/taskController');

router.post('/completeTask', taskController.completeTask);
router.post('/createTask', taskController.createTask);
router.post('/createTaskNote', taskController.createTaskNote);
router.get('/getAllTasks', taskController.getAllTasks);
router.get('/getUserTasks/:id', taskController.getUserTasks);
router.post('/updateTask', taskController.updateTask);
router.post('/updateTaskNote', taskController.updateTaskNote);

module.exports = router;