import path from 'path';
import { readFile } from '../../utils/fileIO.js';
import { verifyToken } from './auth.service.js';
// Điều này tạo ra đường dẫn tới tệp data.json trong cùng thư mục với tệp mã nguồn của bạn.
const __dirname = path.resolve();
const fileUserPath = path.join(__dirname, './data/user.json');
export async function isAuth(req, resp, next) {
  const accessToken = req.headers.authorization;
  console.log('accessToken', accessToken);
  if (!accessToken) {
    return resp.status(401).send({ msg: 'Invalid access token' });
  }
  const tokenVerified = await verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET);
  if (!tokenVerified) {
    return resp.status(401).send({ msg: 'Invalid access token' });
  }
  console.log('verifiedToken', tokenVerified);
  const userData = readFile(fileUserPath);
  const user = userData.find(user => user.username === tokenVerified.username);
  if (!user) {
    return resp.status(404).send({ msg: 'User not found' });
  }
  req.user = user;
  next();
}
