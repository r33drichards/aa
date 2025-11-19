# Use Node.js 22 Alpine as the base image
FROM node:22-alpine

# Install dependencies for node-canvas (required by prismarine-viewer)
RUN apk add --no-cache \
    build-base \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev \
    librsvg-dev \
    pixman-dev \
    freetype-dev \
    fontconfig \
    ttf-dejavu \
    ttf-freefont \
    python3

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install pnpm and dependencies
RUN npm install -g pnpm && \
    pnpm config set enable-pre-post-scripts true && \
    pnpm install --frozen-lockfile && \
    cd /app/node_modules/.pnpm/canvas@*/node_modules/canvas && npm run install

# Copy the rest of the application code
COPY . .

# Expose ports for inventory viewer and prismarine-viewer
EXPOSE 3001 3002

# Start the application
CMD ["node", "attack.js"]
