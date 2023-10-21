const Router = require('express');
const router = new Router();
const authMiddleWare = require('../Middleware/auth.middleware');
const fileController = require('../FileController/FileController');

router.post('', authMiddleWare, fileController.createDir);
router.post('/upload', authMiddleWare, fileController.uploadFile);
router.post('/avatar', authMiddleWare, fileController.uploadAvatar);
router.get('', authMiddleWare, fileController.getFiles);
router.get('/download', authMiddleWare, fileController.downloadFile);
router.get('/search', authMiddleWare, fileController.searchFile);
router.delete('/', authMiddleWare, fileController.deleteFile);
router.delete('/avatar', authMiddleWare, fileController.deleteAvatar);

module.exports = router;