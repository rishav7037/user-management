FROM node:20.11-alpine AS build
LABEL userManagement=build

WORKDIR /userManagement
RUN npm i  -g @nestjs/cli
COPY package*.json .eslintrc.js tsconfig.json tsconfig.build.json /userManagement/
RUN  npm i
COPY / /userManagement/
RUN  npm run build && npm prune --production

FROM node:20.11-alpine AS production
LABEL userManagement=production
ARG APP_VERSION
RUN apk add --no-cache bash
RUN npm install pm2 -g
WORKDIR /userManagement
COPY --from=build userManagement/node_modules userManagement/node_modules
COPY --from=build userManagement/dist userManagement/dist
ENV APP_VERSION=${APP_VERSION}
CMD ["node", "--max-old-space-size=4096", "./userManagement/index.js", "--trace-warnings", "--name", "userManagement"]

