var express = require('express');
var router = express.Router();
var quizController = require ('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
/* GET home page. */
router.get('/', function(req, res, next) {
res.render('index');
});
router.get('/author', function(req, res, next) {
res.render('author', { title: 'Author' });
});
router.param('quizId', quizController.load);
router.get('/quizzes:format?', quizController.index);
router.get('/quizzes/:quizId(\\d+):format?', quizController.show);
router.get('/quizzes/:quizId(\\d+)/check', quizController.check);
router.get('/quizzes/:quizId(\\d+)/edit', quizController.edit);
router.put('/quizzes/:quizId(\\d+)', quizController.update);
router.get('/quizzes/new', quizController.new);
router.post('/quizzes', quizController.create);
router.delete('/quizzes/:quizId(\\d+)', quizController.destroy);
router.get('/quizzes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizzes/:quizId(\\d+)/comments', commentController.create);
module.exports = router;