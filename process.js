// process.js - آپلود و انکریپت خودکار
const fs = require('fs');
const path = require('path');
const Arweave = require('arweave');
const CryptoJS = require('crypto-js');

// دریافت اطلاعات از GitHub Actions
const payload = JSON.parse(process.env.GITHUB_EVENT_PAYLOAD || '{}');
const password = payload.client_payload?.password || '1234';
const fileNames = payload.client_payload?.files || [];

// تنظیمات Arweave
const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});

const wallet = JSON.parse(process.env.ARWEAVE_JWK); // از سکرت میاد

// ساخت HTML ساده برای تست (بعداً واقعی می‌شه)
let htmlContent = `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head><meta charset="UTF-8"><title>گالری خصوصی</title></head>
<body style="background:#000;color:#0ff;text-align:center;padding:50px;font-family:Tahoma;">
  <h1>گالری خصوصی شما با موفقیت ساخته شد!</h1>
  <p>رمز: <strong>${password}</strong></p>
  <p>فایل‌های آپلود شده: ${fileNames.join(', ')}</p>
</body>
</html>`;

const encrypted = CryptoJS.AES.encrypt(htmlContent, password).toString();

(async () => {
  try {
    const tx = await arweave.createTransaction({ data: encrypted }, wallet);
    tx.addTag('Content-Type', 'text/plain');
    tx.addTag('App', 'CryptoArt.ir');
    await arweave.transactions.sign(tx, wallet);
    await arweave.transactions.post(tx);

    console.log('آپلود موفق!');
    console.log(`لینک گالری: https://arweave.net/${tx.id}`);
    console.log(`لینک دیکریپتر: https://ahmadjavan.github.io/cryptoarttest/decryptor.html?tx=${tx.id}`);
  } catch (err) {
    console.error('خطا:', err.message);
    process.exit(1);
  }
})();
