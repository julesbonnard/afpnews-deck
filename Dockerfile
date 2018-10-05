FROM node:alpine

# Set the default working directory
WORKDIR /usr/src

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the relevant files to the working directory
COPY . .

# Build and export the app
RUN npm run build && cp -R -f dist /public
