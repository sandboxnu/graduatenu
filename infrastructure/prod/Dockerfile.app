# docker build -f infrastructure/prod/Dockerfile.frontend -t frontend .
# docker run -p 3002:3002 frontend
# docker run --rm frontend ls -la
# 

FROM node:16-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# package.json of root and of needed packages
COPY package.json yarn.lock babel.config.js .yarnrc.yml ./
COPY .yarn .yarn
COPY packages/frontend-v2/package.json packages/frontend-v2/package.json
COPY packages/api-client/package.json packages/api-client/package.json
COPY packages/common/package.json packages/common/package.json

# Install at root level
RUN yarn install

# Get src files
COPY packages/frontend-v2 packages/frontend-v2
COPY packages/api-client packages/api-client
COPY packages/common packages/common

RUN yarn packages/api-client build
RUN yarn packages/common build
RUN yarn packages/frontend-v2 build

# Production image 
FROM node:16-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/packages/frontend-v2/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/packages/frontend-v2/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/packages/frontend-v2/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
