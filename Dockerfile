# prod
FROM node as builder
WORKDIR /app
COPY package*.json ./

RUN yarn install

COPY . .
RUN yarn run build

FROM node
WORKDIR /app
COPY package*.json ./

RUN yarn install --production=true
COPY --from=builder /app/build ./build

EXPOSE 8000
CMD [ "node", "build/app.js" ]


# dev
# FROM node
# WORKDIR /app
# COPY package*.json ./
# RUN yarn install
# COPY . .
# CMD [ "yarn", "run", "start"]

# docker run -v $(pwd):/app:ro -v app/node_modules -d -p 8000:8000 --name ${name container} ${name image}