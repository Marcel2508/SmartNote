package main

import (
	"log"
	"net/http"
)

func main() {
	fs := http.FileServer(http.Dir("../public"))
	http.Handle("/", fs)

	log.Println("HTTP Server started!")

	http.ListenAndServe(":5000", nil)
}
