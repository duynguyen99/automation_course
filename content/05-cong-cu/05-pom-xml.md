---
title: "pom.xml và dependency"
type: read
minutes: 8
---

`pom.xml` (*Project Object Model*) là "tờ danh sách nguyên liệu" của project. Nó viết bằng **XML**: một dạng văn bản dùng **thẻ** mở `<ten>` và thẻ đóng `</ten>` bọc lấy nội dung, khá giống HTML bạn sẽ học ở chương 7.

## Một pom.xml thật cho dự án automation

Đây là file `pom.xml` bạn có thể dùng cho cả khóa học (copy đè lên file IntelliJ đã tạo):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <!-- 1. Danh tính của project -->
    <groupId>vn.tramoc</groupId>
    <artifactId>tramoc-autotest</artifactId>
    <version>1.0-SNAPSHOT</version>

    <!-- 2. Cài đặt chung -->
    <properties>
        <maven.compiler.release>21</maven.compiler.release>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <!-- 3. Thư viện cần dùng -->
    <dependencies>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>6.1.3</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.assertj</groupId>
            <artifactId>assertj-core</artifactId>
            <version>3.27.7</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.seleniumhq.selenium</groupId>
            <artifactId>selenium-java</artifactId>
            <version>4.51.0</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <!-- 4. Plugin: công cụ Maven dùng khi build -->
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>3.5.4</version>
            </plugin>
        </plugins>
    </build>
</project>
```

Đừng sợ độ dài. Dòng đầu và thẻ `<project ...>` là phần "thủ tục" lần nào cũng giống nhau. Bạn chỉ cần hiểu 4 khối được đánh số.

## 1. Tọa độ: groupId, artifactId, version

Mỗi project và mỗi thư viện trên đời đều có một "địa chỉ" gồm 3 phần, gọi là **tọa độ** (*coordinates*):

| Phần | Ý nghĩa | Ví dụ |
|---|---|---|
| `groupId` | tổ chức làm ra nó, thường là tên miền viết ngược | `org.seleniumhq.selenium` |
| `artifactId` | tên thư viện / project | `selenium-java` |
| `version` | phiên bản | `4.51.0` |

Ba phần này giống như "Tỉnh, Phường, Số nhà": thiếu một phần là Maven không tìm được. Hậu tố `-SNAPSHOT` trong `1.0-SNAPSHOT` nghĩa là "bản đang phát triển, chưa chốt".

## 2. properties: cài đặt chung

- `maven.compiler.release` = `21`: biên dịch code theo chuẩn Java 21.
- `project.build.sourceEncoding` = `UTF-8`: đọc file code bằng UTF-8, để chữ tiếng Việt như `"Đăng nhập"` không bị lỗi font thành `"ÄÄƒng nháº­p"`. Với tester Việt Nam, dòng này **rất quan trọng**.

## 3. dependencies: thư viện

Mỗi khối `<dependency>` là một thư viện (gọi là **dependency**, "thứ mà project phụ thuộc vào"):

| Thư viện | Dùng để |
|---|---|
| `junit-jupiter` | viết và chạy test (`@Test`...). JUnit 6 cần Java 17 trở lên |
| `assertj-core` | viết kiểm tra dễ đọc: `assertThat(x).isEqualTo(y)` |
| `selenium-java` | điều khiển trình duyệt (chương 8) |

**`<scope>test</scope>`** nghĩa là "thư viện này chỉ dùng cho code trong `src/test`". Code ở `src/main` sẽ không nhìn thấy nó, và nó không bị đóng gói vào sản phẩm giao cho khách. Thư viện test thì luôn để scope `test`. Với một project chỉ chứa test automation, mọi code đều nằm trong `src/test/java`, nên Selenium cũng để `test` được.

Khi bạn thêm một dependency, Maven tự tải nó **và cả những thư viện mà nó cần** (gọi là *transitive dependency*). Ví dụ `selenium-java` kéo theo hàng chục thư viện nhỏ khác. Tất cả được lưu ở `C:\Users\<tên bạn>\.m2\repository` để lần sau khỏi tải lại.

## 4. build/plugins: maven-surefire-plugin

**Plugin** là công cụ mà Maven dùng để làm từng việc. **maven-surefire-plugin** là plugin **chạy test** khi bạn gõ `mvn test`. Maven có sẵn một bản surefire mặc định, nhưng ta ghi rõ phiên bản 3.5.x để chắc chắn nó chạy tốt với JUnit 6, và để máy ai chạy cũng giống nhau.

## Tìm dependency ở đâu?

Vào **central.sonatype.com** (Maven Central), gõ tên thư viện, ví dụ `assertj-core`. Trang của thư viện có sẵn đoạn `<dependency>` để copy, chỉ cần thêm `<scope>test</scope>`.

## Sau khi sửa pom.xml: nhớ "Load Maven Changes"

Mỗi lần sửa `pom.xml`, IntelliJ hiện một biểu tượng chữ **m** nhỏ có mũi tên xoay ở góc trên bên phải editor. Bấm vào đó (hoặc `Ctrl+Shift+O`) để Maven tải thư viện mới. Quên bước này, `import org.junit.jupiter.api.Test;` sẽ bị gạch đỏ dù bạn đã khai báo đúng.

> Lỗi hay gặp: copy thiếu thẻ đóng, ví dụ quên `</dependency>`. IntelliJ sẽ tô đỏ chỗ sai trong `pom.xml`, hãy nhìn kỹ từng cặp thẻ.
