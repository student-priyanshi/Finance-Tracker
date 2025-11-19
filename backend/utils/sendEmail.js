const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text) => {
  try {
    // Development mode - just log to console
    console.log('=== DEVELOPMENT MODE: Email Log ===');
    console.log('To:', email);
    console.log('Subject:', subject);
    console.log('Body:', text);
    console.log('OTP Code:', text.match(/\d{6}/)?.[0] || 'Check the message above');
    console.log('==================================');
    
    // For now, just return true to simulate successful email
    return true;
  } catch (error) {
    console.log('Email simulation error:', error);
    return false;
  }
};

module.exports = sendEmail;