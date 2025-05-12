const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { handleMessage } = require('./message_handler');
const logger = require('../utils/logger');

class WhatsAppClient {
  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth({ clientId: 'portfolio-assistant' }),
      puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true
      }
    });

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.client.on('qr', (qr) => {
      // Display QR code in terminal
      qrcode.generate(qr, { small: true });
      logger.info('QR code generated. Scan with WhatsApp to authenticate.');
    });

    this.client.on('ready', () => {
      logger.info('WhatsApp client is ready! Bot is active and waiting for messages.');
    });

    this.client.on('message', async (message) => {
      if (!message.fromMe) {
        try {
          await handleMessage(this.client, message);
        } catch (error) {
          logger.error('Error handling message:', error);
          await message.reply('Sorry, I encountered an error processing your request.');
        }
      }
    });

    this.client.on('authenticated', () => {
      logger.info('WhatsApp client authenticated successfully.');
    });

    this.client.on('auth_failure', (error) => {
      logger.error('WhatsApp authentication failed:', error);
    });

    this.client.on('disconnected', (reason) => {
      logger.warn(`WhatsApp client was disconnected: ${reason}`);
      logger.info('Attempting to reconnect...');
      this.client.initialize();
    });
  }

  async initialize() {
    await this.client.initialize();
  }
}

module.exports = { Client: WhatsAppClient };