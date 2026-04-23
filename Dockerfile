FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL
ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_COC_API_TOKEN

RUN VITE_API_URL="$VITE_API_URL" \
    VITE_CLERK_PUBLISHABLE_KEY="$VITE_CLERK_PUBLISHABLE_KEY" \
    VITE_COC_API_TOKEN="$VITE_COC_API_TOKEN" \
    npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5173

COPY server.js ./server.js
COPY --from=builder /app/dist ./dist

EXPOSE 5173

CMD ["node", "server.js"]
