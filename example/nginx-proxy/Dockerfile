FROM nginx:1.11.3

ENV RANCHER_GEN_VERSION=v1.2.0

RUN apt-get update \
    && apt-get install -y -q --no-install-recommends --fix-missing \
        ca-certificates \
        wget \
        curl \
        openssl \
        git \
        ssh \
     && apt-get clean \
     && rm -r /var/lib/apt/lists/*

RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get update \
    && apt-get install -y -q \
        nodejs \
    && npm -g update npm

# Install Forego
ADD https://github.com/jwilder/forego/releases/download/v0.16.1/forego /usr/local/bin/forego
RUN chmod u+x /usr/local/bin/forego

COPY app /app
WORKDIR /app/

RUN git clone --branch $RANCHER_GEN_VERSION https://github.com/wlatanowicz/rancher-gen.git

RUN cd rancher-gen \
    && npm install --production

CMD ["forego", "start", "-r"]
