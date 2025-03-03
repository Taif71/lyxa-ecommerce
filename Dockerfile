# Builder Stage
FROM node:14-buster AS builder

WORKDIR /app

# Install dependencies for Sharp and other tools
RUN apt-get update && apt-get install -y \
    bash \
    wget \
    libvips-dev \
    build-essential

# Download wait-for-it script
RUN wget -O /bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh && chmod +x /bin/wait-for-it.sh


# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source
COPY . .

CMD ["npm", "start"]
