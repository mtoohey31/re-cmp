JS := build/generated/teavm/js/java-util-regex.js

all: $(JS)

$(JS): build.gradle.kts src/main/java/org/recmp/Regex.java
	./gradlew :generateJavaScript

.PHONY: clean
clean:
	./gradlew clean
