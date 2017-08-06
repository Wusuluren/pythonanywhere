package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"strings"

	"../markdown"
)

func main() {
	flag.Parse()
	inputFiles := flag.Args()
	for _, inputFile := range inputFiles {
		fin, err := os.Open(inputFile)
		if err != nil {
			log.Fatalln(err)
		}
		defer fin.Close()
		rawTxt, err := ioutil.ReadAll(fin)
		if err != nil {
			log.Fatalln(err)
		}

		e := markdown.NewEngine()
		e.Input(string(rawTxt))
		e.Process()

		// fmt.Println(e.Output())
		outputFile := strings.Replace(inputFile, ".md", ".html", -1)
		fmt.Println(outputFile)
		fout, err := os.OpenFile(outputFile, os.O_CREATE|os.O_TRUNC|os.O_WRONLY, 0777)
		if err != nil {
			log.Fatalln(err)
		}
		defer fout.Close()
		fout.WriteString(fmt.Sprintf(`
		<html>
		<head><meta charset="UTF-8"></head>
		<body>
		%s
		</body>
		</html>`,
			e.Output()))
	}
}
