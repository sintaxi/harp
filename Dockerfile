FROM node:6-alpine
ENTRYPOINT [ "harp" ]
WORKDIR /app
COPY . /opt/harp
RUN npm config set unsafe-perm true 
RUN npm install -g /opt/harp
