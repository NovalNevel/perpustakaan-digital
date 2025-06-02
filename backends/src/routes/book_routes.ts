import express from 'express';
import { getBooks, getBookById, createBook, deleteBook, updateBook, getCategories } from '../controllers/book_controllers';
import { upload } from '../utils/multer';
import { isAdmin, verifyToken } from '../middlewares/auth';
import {borrowBook, getUserLoans, returnBook} from "../controllers/loan_controllers";

const router = express.Router();

router.get('/', getBooks);
router.get('/categories', getCategories);
router.get('/:id', async (req, res) => {
    await getBookById(req, res);
});

router.post('/', verifyToken, isAdmin, upload.single('image'), createBook);
router.put('/:id', verifyToken, isAdmin, upload.single('image'), updateBook);
router.delete('/:id', verifyToken, isAdmin, deleteBook);
router.post('/borrow', verifyToken, isAdmin, borrowBook);
router.post('/return', verifyToken, isAdmin, returnBook);
router.get('/my-loans', verifyToken, getUserLoans);


export default router;