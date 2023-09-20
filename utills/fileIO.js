import fs from 'fs';

export function readFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    // Dữ liệu JSON đã được đọc
    return jsonData;
  } catch (err) {
    console.error('Lỗi khi đọc tệp JSON:', err);
  }
}

export function writeFile(filePath, newData) {
  try {
    // console.log('newData', newData);
    const jsonData = JSON.stringify(newData);
    fs.writeFileSync(filePath, jsonData, 'utf8');
    console.log('Tệp JSON đã được ghi.');
    return true;
  } catch (err) {
    console.error('Lỗi khi ghi tệp JSON:', err);
    return false;
  }
}
