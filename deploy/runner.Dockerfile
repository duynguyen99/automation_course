# QA Academy runner: Node + Java 21 + Chromium under Xvfb, so learner Selenium code can use a
# plain `new ChromeDriver()` and the live view can screencast the real (headed) browser.
# Works on amd64 and arm64 (Oracle Cloud Ampere): Chromium and its driver come from Debian,
# because Google Chrome / Selenium Manager have no Linux ARM64 builds.
FROM node:22-bookworm-slim

RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates wget gpg unzip \
 && wget -qO- https://packages.adoptium.net/artifactory/api/gpg/key/public | gpg --dearmor > /usr/share/keyrings/adoptium.gpg \
 && echo "deb [signed-by=/usr/share/keyrings/adoptium.gpg] https://packages.adoptium.net/artifactory/deb bookworm main" > /etc/apt/sources.list.d/adoptium.list \
 && apt-get update \
 && apt-get install -y --no-install-recommends \
      temurin-21-jdk chromium chromium-driver xvfb xauth procps \
      fonts-noto-core fonts-noto-color-emoji fonts-dejavu-core \
 && rm -rf /var/lib/apt/lists/*

# Debian's chromium launcher reads extra flags from /etc/chromium.d. Containers have no user
# namespaces for Chrome's sandbox and a tiny /dev/shm, hence these flags.
COPY deploy/chromium-flags /etc/chromium.d/qa-academy

RUN useradd --create-home --shell /usr/sbin/nologin runner
WORKDIR /app
COPY runner/ ./runner/
# Fetches Maven + the Java libraries learners use (JUnit, AssertJ, Selenium, Cucumber...).
RUN node runner/setup.mjs && rm -rf runner/.tools /root/.m2 && chown -R runner:runner /app
COPY --chmod=755 deploy/entrypoint.sh /usr/local/bin/entrypoint.sh

USER runner
ENV RUNNER_HOST=0.0.0.0 \
    RUNNER_PORT=4000 \
    RUNNER_CONCURRENCY=2 \
    CHROMEDRIVER_PATH=/usr/bin/chromedriver \
    DISPLAY=:99
EXPOSE 4000
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
