# ---------- Builder Stage ----------
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


# ---------- Runtime Stage ----------
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/renderer ./renderer
COPY --from=builder /app/pages ./pages
COPY --from=builder /app/features ./features
COPY --from=builder /app/components ./components
COPY --from=builder /app/controller ./controller
COPY --from=builder /app/dto ./dto
COPY --from=builder /app/misc ./misc
COPY --from=builder /app/screens ./screens
COPY --from=builder /app/services ./services
COPY --from=builder /app/skeleton ./skeleton

COPY --from=builder /app/*.ts ./
COPY --from=builder /app/vite.config.ts ./
COPY --from=builder /app/tsconfig.json ./

ENV NODE_ENV=production
ENV USE_HTTPS=false
ENV PORT=3000

EXPOSE 3000

CMD ["npm","run","server:prod"]
