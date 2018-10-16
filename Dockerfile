FROM node:6-alpine
ENTRYPOINT [ "harp" ]
WORKDIR /app
COPY . /opt/harp
RUN npm install -g /opt/harp
