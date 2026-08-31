# ==========================================
# STAGE 1: Build source code với Maven
# ==========================================
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Cache dependency layer để tăng tốc độ build CI/CD
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy mã nguồn và đóng gói
COPY src ./src
RUN mvn clean package -DskipTests

# ==========================================
# STAGE 2: Runtime Image gọn nhẹ
# ==========================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Tạo non-root user để tăng tính bảo mật
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy file jar từ build stage
COPY --from=builder --chown=appuser:appgroup /app/target/*.jar app.jar

EXPOSE 8080

# Cấu hình JVM tối ưu cho container
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
