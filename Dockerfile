FROM node:15-alpine as builder
RUN mkdir -p /srv/app
COPY package*.json /srv/
RUN cd /srv && npm install
ENV PATH /srv/node_modules/.bin:$PATH
WORKDIR /srv/app
COPY . .
RUN npm run build

##########################

FROM node:15-alpine
RUN mkdir -p /srv/app/dist
COPY --from=builder /srv/app/dist/ /srv/app/dist/
WORKDIR /srv/app
COPY package*.json ./
RUN npm install --only=prod && npm cache clean --force
COPY . .
RUN echo $PORT
EXPOSE $PORT
CMD npm run start:prod
