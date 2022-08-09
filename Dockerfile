FROM node:16
ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./


# Copy app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Set the container port 
EXPOSE 8080

# Start the aplication
CMD ["npm", "run", "start" ]