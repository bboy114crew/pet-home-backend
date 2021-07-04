require('dotenv').config();

CONFIG = {};

CONFIG.JWT_ENCRYPTION = process.env.JWT_ENCRYPTION;
CONFIG.JWT_EXPIRATION = process.env.JWT_EXPIRATION || '10000';

CONFIG.SPEED_SMS_URL = process.env.SPEED_SMS_URL;
CONFIG.SPEED_SMS_AUTH_TOKEN = process.env.SPEED_SMS_AUTH_TOKEN;
CONFIG.SPEED_SMS_TYPE = process.env.SPEED_SMS_TYPE || 2;
CONFIG.EXPIRATION_SMS_CODE = process.env.EXPIRATION_SMS_CODE || 600000;

CONFIG.UPLOAD_FOLDER = '../client/public/images';

CONFIG.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

CONFIG.CLOUD_NAME = process.env.CLOUD_NAME || 'pet-home-fu';

CONFIG.API_KEY = process.env.API_KEY;
CONFIG.API_SECRET = process.env.API_SECRET;

