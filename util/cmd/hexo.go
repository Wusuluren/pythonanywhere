package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"strings"
	"time"

	"../markdown"
)

func main() {
	flag.Parse()
	args := flag.Args()
	if len(args) > 0 {
		switch args[0] {
		case "n", "new":
			if len(args) > 1 {
				for _, title := range args[1:] {
					new_template(title)
				}
			}
			os.Exit(0)
		case "g", "generate":
			if len(args) > 1 {
				for _, inputFile := range args[1:] {
					convert(inputFile)
				}
			}
		}
	}
}

func new_template(title string) {
	fp, err := os.OpenFile(title+".md", os.O_CREATE|os.O_TRUNC|os.O_RDWR, 0777)
	if err != nil {
		log.Fatalln(err)
	}
	defer fp.Close()
	fp.WriteString("/*\n")
	fp.WriteString("title: " + title + "\n")
	now := time.Now().Format("2006-01-02 15:04:05")
	fp.WriteString(fmt.Sprintf("date: %s\n", now))
	fp.WriteString("tags: \n")
	fp.WriteString("*/\n")
}

func convert(inputFile string) {
	fileTemplate, err := os.Open("./template.html")
	if err != nil {
		log.Fatalln(err)
	}
	defer fileTemplate.Close()
	rawTemplate, err := ioutil.ReadAll(fileTemplate)
	if err != nil {
		log.Fatalln(err)
	}
	template := string(rawTemplate)

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
	fileTitle := strings.Replace(inputFile, ".md", "", -1)
	outputFile := strings.Replace(inputFile, ".md", ".html", -1)
	fmt.Println(outputFile)
	fout, err := os.OpenFile(outputFile, os.O_CREATE|os.O_TRUNC|os.O_WRONLY, 0777)
	if err != nil {
		log.Fatalln(err)
	}
	defer fout.Close()

	oldItem := `<div class="item"></div>`
	newItem := fmt.Sprintf(`<div class="item">
				<a class="title" href="blog/%s">%s</a>
                <div class="status">发布于：%s | 标签： #%s</div>
				<div class="content">%s</div>
				</div>`, fileTitle, fileTitle, time.Now(), tags, content)
	newHtml := strings.Replace(template, oldItem, newItem, -1)
	fout.WriteString(newHtml)
}
