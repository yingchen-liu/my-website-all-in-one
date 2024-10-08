# Use the official Gradle image to build the application
FROM gradle:8.7-jdk17 AS builder

# Set the working directory
WORKDIR /app

# Copy the Gradle build files first to leverage caching
COPY build.gradle settings.gradle ./

# Download the dependencies (this layer will be cached)
RUN gradle dependencies --no-daemon --build-cache

# Copy the source code
COPY src ./src

# Build the application
RUN gradle build --no-daemon --build-cache

# Use the official Amazon Corretto JDK image for the runtime
FROM amazoncorretto:17.0.12-alpine

# Set the working directory
WORKDIR /app

# Copy the built JAR file from the builder image
COPY --from=builder /app/build/libs/*.jar app.jar

# Set environment variables for Neo4j connection
ENV NEO4J_URI=neo4j+s//4093d524.databases.neo4j.io:7687
ENV NEO4J_USERNAME=neo4j
ENV NEO4J_PASSWORD=X_v0XWz1H3m0HOqHiOPdNxu2ufh6HNbbCvodAB69Zn8

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]