const path = require("path");
const express = require("express");
const app = express();

const imageFolder = path.join(__dirname, "image");

app.use(express.static(path.join(__dirname)));
app.use('/image', express.static('image'));

// 서버 설정 및 기타 라우팅 설정...

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
