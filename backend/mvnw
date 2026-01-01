#!/bin/sh
BASEDIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
WRAPPER_JAR="$BASEDIR/.mvn/wrapper/maven-wrapper.jar"
WRAPPER_PROPS="$BASEDIR/.mvn/wrapper/maven-wrapper.properties"

if [ ! -f "$WRAPPER_JAR" ]; then
  echo "Downloading Maven Wrapper jar..."
  WRAPPER_URL=$(grep -E '^wrapperUrl=' "$WRAPPER_PROPS" | sed 's/wrapperUrl=//')
  if [ -z "$WRAPPER_URL" ]; then
    echo "wrapperUrl not found in $WRAPPER_PROPS" >&2
    exit 1
  fi
  command -v curl >/dev/null 2>&1 && curl -fsSL "$WRAPPER_URL" -o "$WRAPPER_JAR" || \
  command -v wget >/dev/null 2>&1 && wget -qO "$WRAPPER_JAR" "$WRAPPER_URL" || \
  { echo "Neither curl nor wget is available to download Maven Wrapper jar." >&2; exit 1; }
fi

JAVA_EXE=${JAVA_HOME:+$JAVA_HOME/bin/java}
JAVA_EXE=${JAVA_EXE:-java}

exec "$JAVA_EXE" -Dmaven.multiModuleProjectDirectory="$BASEDIR" -classpath "$WRAPPER_JAR" org.apache.maven.wrapper.MavenWrapperMain "$@"
