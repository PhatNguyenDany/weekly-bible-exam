import fs from 'fs';

export function readFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    // Dữ liệu JSON đã được đọc
    return jsonData;
  } catch (error) {
    console.error('Lỗi khi đọc tệp JSON:', error);
  }
}

export function writeFile(filePath, newData) {
  try {
    const jsonData = JSON.stringify(newData);
    fs.writeFileSync(filePath, jsonData, 'utf8');
    console.log('Tệp JSON đã được ghi.');
    return true;
  } catch (error) {
    console.error('Lỗi khi ghi tệp JSON:', error);
    return false;
  }
}
