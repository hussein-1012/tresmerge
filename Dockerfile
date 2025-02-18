FROM node:18

WORKDIR /app  
COPY package.json .

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "production" ];\
    then npm install --onlyproduction;\
    else npm install;\
    fi
    
COPY . .
EXPOSE 4000
#containers are isolated environment.
CMD [ "npm","run" , "start-dev" ]
