const Arweave = require('arweave');
const CryptoJS = require('crypto-js');

const arweave = Arweave.init({ host: 'arweave.net', port: 443, protocol: 'https' });
const wallet = JSON.parse(process.env.ARWEAVE_WALLET);

// برای تست: یه HTML ساده انکریپت می‌کنیم (بعداً فایل واقعی مشتری رو می‌گیریم)
const password = '1234';  // از payload می‌گیریم
const sampleHTML = '<!DOCTYPE html><html><body><h1>تست موفق از کیف احمدجوان! رمز: ' + password + '</h1><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==" alt="Test Image"></body></html>';  // یه عکس ۱۰۰ بایت تست

const encrypted = CryptoJS.AES.encrypt(sampleHTML, password).toString();

(async () => {
  const tx = await arweave.createTransaction({ data: encrypted }, wallet);
  tx.addTag('Content-Type', 'text/html');
  tx.addTag('App-Name', 'CryptoArt-Test');
  await arweave.transactions.sign(tx, wallet);
  const response = await arweave.transactions.post(tx);
  console.log('TX ID: ' + tx.id);
  console.log('لینک انکریپت‌شده: https://arweave.net/' + tx.id);
  console.log('لینک دیکریپتر: https://ahmadjavan.github.io/cryptoarttest/decryptor.html?tx=' + tx.id);  // decryptor.html رو بعداً اضافه می‌کنیم
})();
