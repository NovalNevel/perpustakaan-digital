import express from 'express';
import { createBook, deleteBook, getBooks, updateBook } from '../controllers/book_controllers';
import { upload } from '../utils/multer';
import { isAdmin, verifyToken } from '../middlewares/auth';

const router = express.Router();

router.get('/', getBooks);
router.post('/', verifyToken, isAdmin, upload.single('image'), createBook);
router.put('/:id', verifyToken, isAdmin, upload.single('image'), updateBook);
router.delete('/:id', verifyToken, isAdmin, deleteBook);

export default router;