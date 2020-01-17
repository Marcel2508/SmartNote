FROM alpine:latest
RUN apk add --update go nodejs npm
RUN mkdir /var/app
WORKDIR /var/app
COPY . /var/app
RUN addgroup -S app && adduser -S app -G app
RUN chown -R app /var/app 
USER app
RUN npm install && npm run build
WORKDIR /var/app/server
RUN go build -o server . && chmod +x server
EXPOSE 5000
CMD ./server