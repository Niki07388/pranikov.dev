@ECHO OFF
SETLOCAL ENABLEEXTENSIONS

SET "BASEDIR=%~dp0"
REM Remove trailing backslash for safe quoting in java args (Windows escaping rules)
IF "%BASEDIR:~-1%"=="\" SET "BASEDIR=%BASEDIR:~0,-1%"

SET "WRAPPER_JAR=%BASEDIR%\.mvn\wrapper\maven-wrapper.jar"
SET "WRAPPER_URL=https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.2/maven-wrapper-3.3.2.jar"

IF EXIST "%WRAPPER_JAR%" GOTO RUN

ECHO Downloading Maven Wrapper jar...
POWERSHELL -NoProfile -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri '%WRAPPER_URL%' -OutFile '%WRAPPER_JAR%'"
IF ERRORLEVEL 1 (
  ECHO Failed to download Maven Wrapper jar.
  EXIT /B 1
)

:RUN
REM Prefer JAVA_HOME if set
IF NOT "%JAVA_HOME%"=="" (
  SET "JAVA_EXE=%JAVA_HOME%\bin\java.exe"
) ELSE (
  SET "JAVA_EXE=java"
)

"%JAVA_EXE%" -Dmaven.multiModuleProjectDirectory="%BASEDIR%" -classpath "%WRAPPER_JAR%" org.apache.maven.wrapper.MavenWrapperMain %*
