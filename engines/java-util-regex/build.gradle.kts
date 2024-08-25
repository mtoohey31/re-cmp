plugins {
    java
    id("org.teavm") version "0.10.1"
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.teavm:teavm-jso:0.10.1")
    implementation("org.teavm:teavm-jso-apis:0.10.1")
}

teavm {
    js {
        mainClass = "org.recmp.Regex"
        moduleType = org.teavm.gradle.api.JSModuleType.ES2015
    }
}
