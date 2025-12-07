const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Функция для получения папки загрузок по типу
const getUploadsDir = (type = 'services') => {
  const uploadsDir = path.join(__dirname, `../public/uploads/${type}`);
  // Создаем папку, если её нет
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  return uploadsDir;
};

// Создаем папки для категорий и услуг
getUploadsDir('services');
getUploadsDir('categories');

// Функция для создания storage multer с указанным типом
const createStorage = (type) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, getUploadsDir(type));
    },
    filename: (req, file, cb) => {
      // Генерируем уникальное имя файла
      const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    }
  });
};

// Фильтр для проверки типа файла
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Только изображения форматов JPEG, PNG и WebP разрешены'));
  }
};

// Настройка multer для услуг (по умолчанию для обратной совместимости)
const upload = multer({
  storage: createStorage('services'),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

// Настройка multer для категорий
const uploadCategory = multer({
  storage: createStorage('categories'),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

// Настройка multer для услуг
const uploadService = multer({
  storage: createStorage('services'),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

/**
 * Оптимизирует изображение и сохраняет его
 * @param {string} inputPath - путь к исходному файлу
 * @param {string} outputPath - путь для сохранения оптимизированного файла
 * @returns {Promise<string>} - путь к оптимизированному файлу
 */
async function optimizeImage(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .resize(800, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({ quality: 85 })
      .toFile(outputPath);
    
    // Удаляем исходный файл
    fs.unlinkSync(inputPath);
    
    return outputPath;
  } catch (error) {
    // Если ошибка, удаляем исходный файл
    if (fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath);
    }
    throw new Error(`Ошибка оптимизации изображения: ${error.message}`);
  }
}

/**
 * Обрабатывает загруженный файл: оптимизирует и возвращает URL
 * @param {string} filePath - путь к загруженному файлу
 * @returns {Promise<string>} - URL изображения
 */
async function processUploadedImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const dir = path.dirname(filePath);
  const baseName = path.basename(filePath, ext);
  // Всегда создаем файл с уникальным именем, добавляя суффикс -opt
  const optimizedPath = path.join(dir, `${baseName}-opt.jpg`);
  
  await optimizeImage(filePath, optimizedPath);
  
  // Возвращаем относительный путь от public
  const relativePath = path.relative(path.join(__dirname, '../public'), optimizedPath);
  return `/${relativePath.replace(/\\/g, '/')}`;
}

module.exports = {
  upload, // Для обратной совместимости
  uploadCategory,
  uploadService,
  processUploadedImage,
  optimizeImage
};

