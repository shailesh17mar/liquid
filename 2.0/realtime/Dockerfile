FROM node:latest
 
MAINTAINER Shailesh Srivastava "shailesh@liquid.so"

WORKDIR "/usr/src/liquid"
COPY . .

RUN npm install
RUN npm run build

EXPOSE 8080

ENTRYPOINT ["npm", "run"]
CMD ["start:staging"]

