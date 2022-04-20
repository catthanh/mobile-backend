# Mobile backend

## các package sử dụng

-   **dotenv** lưu biến môi trường
-   **express** web framework
-   **morgan** log response
-   **http-errors** xử lý error message (404 not found, not authorized...)
-   **jsonwebtoken** token
-   **sequelize** kết nối db
-   **joi** form validation
-   **bcrypt** encode mật khẩu

## cấu trúc thư mục

```bash
|   .env # config variable
|   .gitignore # ignore file
|   .env_example # config variable example
|   app.js # khởi chạy server
|   package.json # thông tin package
|   README.md
|   rest.http # test api (cài extension REST Client VSCode)
|
+---config
|   config.json # config file
+---controllers
|       Auth.controller.js # controller auth
|       Rest.controller.js # controller rest
+---helpers
|       init_mongodb.js # kết nối mongodb
|       jwt_helper.js # xác thực, cấp token, chặn token
|       schema_validation.js # validate thông tin đăng kí
|
+---models
|       Food.model.js # model món ăn
|       index.js # tự động import các model trong thư mục này
|       Order.Food.model.js # liên kết m:n với số lượng
|       Order.model.js # model đơn hàng
|       Refresh.model.js # model refresh token
|       Restaurant.model.js # model nhà hàng
|       Review.model.js # model đánh giá
|       Role.model.js # model vai trò
|       User.model.js # model người dùng
|       Voucher.model.js # model voucher
|
\---routes
        auth.route.js # xử lý route login logout refresh token register
        res.route.js # xử lý api nhà hàng
```

## SET UP

-   clone
-   tạo file config.json (copy từ config.json_example)
-   lấy thông tin kết nối database từ [notion](https://www.notion.so/42ee4057adca4ed9b6071f9719eb5317?v=7b33a418f4b940d49f764b48e6bcb92f&p=d1f42e3a036e4036b2b69bb8be489b40)
-   chạy npm install
-   chạy npm start

## DONE

-   [x] authencation
-   [x] sequelize model
-   [x] sequelize associations
-   [x] sync model with cloud database

## TODO

-   [ ] encrypt password
-   [ ] thêm thông tin đăng kí
        tên tuổi địa chỉ ...
-   [ ] lưu trữ ảnh món ăn ?
-   [ ] api nhà hàng:

    -   [ ] thêm món ăn
    -   [ ] xóa món ăn
    -   [ ] cập nhật món ăn
    -   [ ] thêm chi nhánh
    -   [ ] xóa chi nhánh
    -   [ ] cập nhật chi nhánh
    -   [ ] nhận đơn hàng
    -   [ ] xem đơn hàng
    -   [ ] xem đánh giá
    -   [ ] thêm voucher
    -   [ ] xóa voucher
    -   [ ] cập nhật voucher
    -   [ ] xem voucher
    -   [ ] thêm vai trò
    -   [ ] xóa vai trò
    -   [ ] cập nhật vai trò

-   [ ] api người dùng:

    -   [ ] thêm đánh giá
    -   [ ] xóa đánh giá
    -   [ ] cập nhật đánh giá

    -   [ ] thêm đơn hàng
    -   [ ] xóa đơn hàng
    -   [ ] cập nhật đơn hàng
    -   [ ] thêm món ăn vào đơn hàng
    -   [ ] xóa món ăn khỏi đơn hàng
