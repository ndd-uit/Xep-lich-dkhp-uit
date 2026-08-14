# Công cụ hỗ trợ xếp TKB đăng ký học phần UIT

Ứng dụng hỗ trợ đọc thời khóa biểu Excel, chọn lớp và xem thời khóa biểu trực quan.

## Yêu cầu

- Node.js 22.12 trở lên
- npm 10 trở lên

## Phát triển local

```bash
cd react
npm ci
npm start
```

Mở <http://localhost:3000> trong trình duyệt.

## Kiểm tra trước khi commit

Lệnh dưới đây kiểm tra format, ESLint, TypeScript và test:

```bash
cd react
npm run check
```

Tạo production bundle:

```bash
cd react
npm run build
```

## Deploy GitHub Pages

Workflow [deploy-pages.yml](.github/workflows/deploy-pages.yml) tự động kiểm tra và deploy khi có thay đổi trên nhánh `master`.

1. Tạo repository trên GitHub và thêm remote nếu dự án chưa có:

   ```bash
   git remote add origin https://github.com/OWNER/REPOSITORY.git
   git push -u origin master
   ```

2. Mở `Settings > Pages` trong repository.
3. Tại `Build and deployment`, chọn `GitHub Actions`.
4. Push lại nhánh `master` hoặc chạy workflow thủ công trong tab `Actions`.

Workflow tự lấy base path từ GitHub Pages nên không cần hard-code tên tài khoản hoặc repository.

## Lưu ý

Chọn file Excel thời khóa biểu từ cổng đào tạo UIT để dữ liệu được đọc đúng định dạng.
