# my-website-services

1. Install Java 17
    ```shell script
    $ sdk install java 17.0.12-amzn
    $ sdk use java 17.0.12-amzn
    ```
2. Config project to use SDK 17 in IDEA's Module Settings
3. Make sure IDEA also uses SDK 17

    In File > Settings > Build, Execution, Deployment > Build Tools > Gradle
4. Run project
    ```shell script
    $ ./gradlew build
    $ ./gradlew bootRun
    ```