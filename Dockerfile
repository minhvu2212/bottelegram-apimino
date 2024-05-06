# Sử dụng image Node.js chính thức từ Docker Hub
FROM node:14

# Thiết lập thư mục làm việc trong container
WORKDIR /usr/src/app

# Sao chép file package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt các phụ thuộc
RUN npm install

# Sao chép tất cả các file mã nguồn còn lại vào thư mục làm việc
COPY . .

# Khai báo port mà container sẽ lắng nghe
EXPOSE 3000

# Chạy ứng dụng khi container được khởi động
CMD ["node", "bot.js"]