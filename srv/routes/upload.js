const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/admin');
const { uploadService, uploadCategory, processUploadedImage } = require('../utils/imageUpload');

// Загрузка изображения услуги (admin only)
router.post('/service-image', adminAuth, uploadService.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не был загружен' });
    }

    // Обрабатываем и оптимизируем изображение
    const imageUrl = await processUploadedImage(req.file.path);

    res.json({ imageUrl });
  } catch (error) {
    console.error('Upload service image error:', error);
    
    // Удаляем файл в случае ошибки
    if (req.file && req.file.path) {
      const fs = require('fs');
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    
    res.status(500).json({ 
      error: 'Ошибка загрузки изображения',
      message: error.message 
    });
  }
});

// Загрузка изображения категории (admin only)
router.post('/category-image', adminAuth, uploadCategory.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не был загружен' });
    }

    // Обрабатываем и оптимизируем изображение
    const imageUrl = await processUploadedImage(req.file.path);

    res.json({ imageUrl });
  } catch (error) {
    console.error('Upload category image error:', error);
    
    // Удаляем файл в случае ошибки
    if (req.file && req.file.path) {
      const fs = require('fs');
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    
    res.status(500).json({ 
      error: 'Ошибка загрузки изображения',
      message: error.message 
    });
  }
});

module.exports = router;

