import multer from 'multer';

// Configuração do multer para upload de imagem
const storage = multer.memoryStorage();  // Armazena a imagem na memória

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



export default upload;
