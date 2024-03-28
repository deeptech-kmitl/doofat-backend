FROM node:16.14.2 as builder

WORKDIR /app

COPY tsconfig.json ./

COPY . .

RUN npm install \
  --prefer-offline \
  --frozen-lockfile \
  --non-interactive \
  --production=false

RUN npm run build

RUN npx prisma generate

RUN rm -rf node_modules && \
  NODE_ENV=production npm install \
  --prefer-offline \
  --pure-lockfile \
  --non-interactive \
  --production=true

FROM node:16.14.2

WORKDIR /app

COPY --from=builder /app  .
COPY --from=builder /app/prisma ./prisma
# COPY --from=builder /app/.env ./.env

ARG DATABASE_URL
ARG SESSION_SECRET
ARG SECRET_KEY
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG FACEBOOK_CLIENT_ID
ARG FACEBOOK_CLIENT_SECRET

ENV HOST=0.0.0.0
ENV DATABASE_URL=$DATABASE_URL
ENV SESSION_SECRET=$SESSION_SECRET
ENV SECRET_KEY=$SECRET_KEY
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
ENV FACEBOOK_CLIENT_ID=$FACEBOOK_CLIENT_ID
ENV FACEBOOK_CLIENT_SECRET=$FACEBOOK_CLIENT_SECRET


EXPOSE 80

CMD npx prisma migrate deploy && npm start
