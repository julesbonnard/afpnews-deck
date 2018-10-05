FROM node:alpine

RUN mkdir /usr/src/app

# Set the default working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the relevant files to the working directory
COPY . .

# Build and export the app
RUN npm run build && cp -r dist ../public

WORKDIR /usr/src
