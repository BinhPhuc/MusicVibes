# FROM openjdk:21-jdk-slim

# WORKDIR /app

# COPY ./target/musicapp-0.0.1-SNAPSHOT.jar app.jar

# EXPOSE 8088

# ENTRYPOINT ["java","-jar","app.jar"]

FROM openjdk:21-jdk-slim
 
WORKDIR /app
 
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline
 
COPY src ./src
 
CMD ["./mvnw", "spring-boot:run"]
