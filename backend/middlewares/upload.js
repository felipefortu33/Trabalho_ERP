import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';

export const uploadsDirectory = path.resolve(process.cwd(), 'uploads');
fs.mkdirSync(uploadsDirectory, { recursive: true });

const extensionsByMimeType = {
	'image/jpeg': '.jpg',
	'image/png': '.png',
	'image/webp': '.webp',
};

const storage = multer.diskStorage({
	destination: uploadsDirectory,
	filename: (req, file, callback) => {
		const extension = extensionsByMimeType[file.mimetype];
		callback(null, `${Date.now()}-${crypto.randomUUID()}${extension}`);
	},
});

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

const upload = multer({
	storage,
	limits: {
		fileSize: 5 * 1024 * 1024,
		files: 1,
	},
	fileFilter: (req, file, callback) => {
		if (!allowedMimeTypes.has(file.mimetype)) {
			const error = new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname);
			error.message = 'Tipo de imagem nao permitido';
			return callback(error);
		}

		callback(null, true);
	},
});

export const getUploadedFileUrl = (file) => (file ? `/uploads/${file.filename}` : null);

export const removeUploadedFile = async (fileUrl) => {
	if (!fileUrl || !fileUrl.startsWith('/uploads/')) return;

	const filePath = path.resolve(uploadsDirectory, path.basename(fileUrl));
	if (path.dirname(filePath) !== uploadsDirectory) return;

	try {
		await fs.promises.unlink(filePath);
	} catch (error) {
		if (error.code !== 'ENOENT') throw error;
	}
};

export default upload;
