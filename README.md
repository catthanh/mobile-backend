# Mobile backend

## các package sử dụng

-   dotenv lưu biến môi trường
-   express web framework
-   morgan log response
-   http-errors xử lý error message (404 not found, not authorized...)
-   jsonwebtoken token
-   mongoose kết nối db
-   joi form validation
-   bcrypt encode mật khẩu

## cấu trúc thư mục

```bash
|   .env # config variable
|   app.js # khởi chạy server
|   package.json # thông tin pakage
|   README.md
|   rest.http # test api (cài extension REST Client VSCode)
|
+---helpers
|       init_mongodb.js # kết nối môngdb
|       jwt_helper.js # xác thực, cấp token, chặn token
|       schema_validation.js # validate thông tin đăng kí
|
+---models
|       Refresh.model.js # lưu các token đã cấp/ bị chặn
|       User.model.js #
|
\---routes
        auth.route.js # xử lý route login logout refresh token register
```
