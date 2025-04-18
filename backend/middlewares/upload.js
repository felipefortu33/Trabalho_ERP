import multer from 'multer';

// Configuração do multer para upload de imagem
const storage = multer.memoryStorage();  // Armazena a imagem na memória

const upload = multer({ storage: storage });



export default upload;
