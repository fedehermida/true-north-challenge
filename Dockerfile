FROM node:alpine
LABEL Version=1
LABEL Name="node-task-api"
WORKDIR /app
COPY ./package.json .
RUN npm install
COPY . .
EXPOSE 4500
CMD ["npm", "start"]