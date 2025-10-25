FROM --platform=$BUILDPLATFORM gradle:8-jdk-21-and-22-alpine AS builder

WORKDIR /home/gradle/project

COPY . .

RUN gradle assemble


FROM --platform=$BUILDPLATFORM eclipse-temurin:25-alpine

WORKDIR /app

COPY --from=builder /home/gradle/project/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
