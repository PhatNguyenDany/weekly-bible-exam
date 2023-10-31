import bodyParser from 'body-parser';
import express from 'express';
import groupRouters from './src/group/group.routes.js';
import userRouters from './src/user/user.routes.js';
import authRouters from './src/auth/auth.routes.js';
import weekRouters from './src/week/week.routes.js';
import questionRouters from './src/question/question.routes.js';
// import { group } from 'console';
const app = express();
const port = process.env.PORT;

// Middleware body-parser giúp xử lý dữ liệu được gửi đến máy chủ từ các yêu cầu HTTP
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/group', groupRouters);
app.use('/user', userRouters);
app.use('/auth', authRouters);
app.use('/question', questionRouters);
app.use('/week', weekRouters);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
