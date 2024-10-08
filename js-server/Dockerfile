FROM node:16-alpine

ENV HOME=/home/node/app
ENV NODE_ENV=production
ENV NODE_PORT=8199

RUN mkdir $HOME && chown -R node:node $HOME
WORKDIR $HOME
COPY package*.json ./

USER root
RUN apk add --no-cache procps 
#https://stackoverflow.com/questions/48655709/how-can-i-get-process-name-of-specific-pid-with-ps-command-in-alpine 
RUN npm install 

USER node
COPY --chown=node:node ./app-express.js .

EXPOSE $NODE_PORT
CMD ["node", "app-express.js"]