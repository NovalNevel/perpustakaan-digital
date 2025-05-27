import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary } from './cloudinary';

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: 'book-images',
        format: 'jpg',
        public_id: `${Date.now()}-${file.originalname}`,
    }),
});

export const upload = multer({ storage });
