# build stage
FROM node:stretch-slim
#FROM node:10

#RUN npm install npm@5.3.0 -G
#RUN mv node_modules/npm /usr/local/lib/node_modules/npm
#RUN rm -rf /usr/local/lib/node_modules/npm
ARG NPM_TOKEN
RUN echo //registry.npmjs.org/:_authToken=${NPM_TOKEN} > ./.npmrc
RUN npm --version

#requirements for npm install
#RUN apk add --update \
#    python \
#    python-dev \
#    py-pip \
#    build-base \
#  && pip install virtualenv \
#  && rm -rf /var/cache/apk/*

#WORKDIR /app
#COPY package*.json ./
#RUN npm install
COPY . .
#RUN npm run build

# production stage
#FROM node:8

# Create app directory
WORKDIR .

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
#COPY package*.json ./

RUN npm install

RUN npm run build


# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

CMD [ "npm", "start" ]
