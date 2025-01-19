FROM node:20.11.1-alpine AS build
LABEL user-management=build

WORKDIR /app

COPY userManagement/package*.json /app/
COPY userManagement/.eslintrc.js /app/
COPY userManagement/tsconfig.json /app/
COPY userManagement/tsconfig.build.json /app/

RUN npm install

COPY userManagement/ /app/

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
