# =========================================
# 🧩 STEP 1: Build app (dành cho NestJS)
# =========================================
FROM node:18-alpine AS builder

# Tạo thư mục làm việc
WORKDIR /app

# Copy file khai báo dependencies
COPY package*.json ./

# Cài dependencies (npm ci nhanh và sạch hơn)
RUN npm ci

# Copy toàn bộ source code
COPY . .

# Build NestJS sang JS (dist/)
RUN npm run build

# =========================================
# 🚀 STEP 2: Run app (production image)
# =========================================
FROM node:18-alpine AS runner

WORKDIR /app

# Copy file cần thiết từ builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/proto ./proto

# Cài đặt dependencies cho production
RUN npm ci 

# Expose port Gateway
EXPOSE 3000

# Lệnh khởi động
CMD ["npm", "run", "start:prod"]


# Nếu dùng .env

# thêm dòng:

# COPY --from=builder /app/.env ./