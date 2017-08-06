package markdown

import (
	"fmt"
	"strings"
)

const (
	symText = iota
	symHeader
	symHeaderOpt
	symUnorderList
	symOrderList
	symUnorderListOpen
	symUnorderListClose
	symOrderListOpen
	symOrderListClose
	symSepLine
)

type symbolData struct {
	name int
	num  int
}

type symbol struct {
	name  int
	level int
	line  int
	data  []*symbolData
}

type Engine struct {
	input            string
	output           string
	orderListLevel   int
	unorderListLevel int
	symbols          []*symbol
}

func (e *Engine) Input(input string) {
	e.input = input
}

func (e *Engine) Output() string {
	return e.output
}

func (e *Engine) isHeader(input string) (bool, int) {
	line := []rune(input)
	level := 0
	for _, c := range line {
		if c == '#' {
			level += 1
		} else {
			break
		}
	}
	if level >= len(line) || level == 0 {
		return false, 0
	}
	if line[level] == ' ' {
		return true, level
	}
	return false, 0
}

func (e *Engine) isHeaderOpt(input string) (bool, int) {
	line := []rune(input)
	if len(line) < 3 {
		return false, 0
	}
	sep := line[0]
	if sep != '-' && sep != '=' {
		return false, 0
	}
	for _, c := range line {
		if c != sep {
			return false, 0
		}
	}
	level := 1
	if sep == '=' {
		level = 1
	} else if sep == '-' {
		level = 2
	}
	return true, level
}

func (e *Engine) isUnorderList(line string) (bool, int) {
	if len(line) < 2 {
		return false, 0
	}
	rawLine := []rune(line)
	level := 0
	i := 0
	tabLen := 0
	for i = 0; i < len(rawLine); i++ {
		if rawLine[i] == rune('\t') {
			tabLen = 1
			level += 1
		} else if strings.Compare(string(rawLine[i:i+4]), "    ") == 0 {
			tabLen = 4
			level += 1
		} else {
			break
		}
	}
	if i+2 > len(rawLine) {
		return false, 0
	}
	if tabLen != 0 {
		i += tabLen - 1
	}
	if rawLine[i] == '-' || rawLine[i] == '*' || rawLine[i] == '+' {
		if rawLine[i+1] == ' ' {
			return true, level
		}
	}
	return false, 0
}

func (e *Engine) isNumber(c rune) bool {
	toCmp := int(c) - int('0')
	for cmp := 1; cmp < 7; cmp++ {
		if toCmp == cmp {
			return true
		}
	}
	return false
}

func (e *Engine) isOrderList(line string) (bool, int) {
	if len(line) < 3 {
		return false, 0
	}
	rawLine := []rune(line)
	level := e.orderListLevel
	i := 0
	for i = 0; i < len(rawLine); i++ {
		if rawLine[i] == rune('\t') || strings.Compare(string(rawLine[i:i+4]), "    ") == 0 {
			level += 1
		} else {
			break
		}
	}
	if i+3 > len(rawLine) {
		return false, 0
	}
	if e.isNumber(rawLine[i]) && rawLine[i+1] == rune('.') && rawLine[i+2] == rune(' ') {
		return true, level
	}
	return false, 0
}

func (e *Engine) isSepLine(lines []string, idx int) bool {
	if idx+2 > len(lines) {
		return false
	}
	if len(lines) < 3 {
		return false
	}
	rawLine := []rune(lines[idx])
	for _, c := range rawLine {
		if c != rune(' ') {
			return false
		}
	}
	rawLine = []rune(lines[idx+2])
	for _, c := range rawLine {
		if c != rune(' ') {
			return false
		}
	}
	rawLine = []rune(lines[idx+1])
	for _, c := range rawLine {
		if c == rune('-') {
			continue
		}
		if c == rune('*') {
			continue
		}
		return false
	}
	return true
}

func (e *Engine) renderHeader(line string, level int) string {
	rawLine := []rune(line)[level+1:]
	return fmt.Sprintf(`<h%d>%s</h%d>`, level, string(rawLine), level)
}

func (e *Engine) renderHeaderOpt(line string, level int) string {
	return fmt.Sprintf(`<h%d>%s</h%d>`, level, line, level)
}

func (e *Engine) renderUnorderList(line string, level int) string {
	rawLine := []rune(line)[level-1+3:]
	return fmt.Sprintf(`<li>%s</li>`, string(rawLine))
}

func (e *Engine) renderOrderList(line string, level int) string {
	rawLine := []rune(line)[level-1+4:]
	return fmt.Sprintf(`<li>%s</li>`, string(rawLine))
}

func (e *Engine) renderHref(line string) string {
	leader := -1
	leftBracket := -1
	rightBracket := -1
	leftParentheses := -1
	rightParentheses := -1
	rawLine := []rune(line)
	for i := 0; i < len(rawLine); i++ {
		if rawLine[i] == rune('!') && leader == -1 {
			leader = i
		}
		if rawLine[i] == rune('[') && leftBracket == -1 {
			leftBracket = i
		}
		if rawLine[i] == rune(']') && rightBracket == -1 {
			rightBracket = i
		}
		if rawLine[i] == rune('(') && leftParentheses == -1 {
			leftParentheses = i
		}
		if rawLine[i] == rune(')') && rightParentheses == -1 {
			rightParentheses = i
		}
	}
	symType := ""
	if leader != -1 && leader+1 == leftBracket {
		symType = "img"
	} else if leader+1 != leftBracket {
		if leftBracket != -1 && rightBracket != -1 &&
			leftParentheses != -1 && rightParentheses != -1 {
			symType = "url"
		}
	}
	if len(symType) == 0 {
		return line
	}
	if rightBracket+1 != leftParentheses {
		return line
	}
	if leader >= leftBracket {
		return line
	}
	if leftBracket >= rightBracket {
		return line
	}
	if rightBracket >= leftParentheses {
		return line
	}
	if leftParentheses >= rightParentheses {
		return line
	}
	if symType == "img" {
		return fmt.Sprintf(`%s<img src='%s' alt='%s'>%s`,
			string(rawLine[:leader]),
			string(rawLine[leftParentheses+1:rightParentheses]),
			string(rawLine[leftBracket+1:rightBracket]),
			string(rawLine[rightParentheses+1:]))
	} else if symType == "url" {
		return fmt.Sprintf(`%s<a href='%s'>%s</a>%s`,
			string(rawLine[:leftBracket]),
			string(rawLine[leftParentheses+1:rightParentheses]),
			string(rawLine[leftBracket+1:rightBracket]),
			string(rawLine[rightParentheses+1:]))
	}
	return line
}

func (e *Engine) renderFont(line string) string {
	rawLine := []rune(line)
	stars := []int{}
	for i := 0; i < len(rawLine); i++ {
		if rawLine[i] == rune('*') {
			stars = append(stars, i)
		}
	}
	if len(stars) == 2 {
		return fmt.Sprintf(`%s<i>%s</i>%s`,
			string(rawLine[:stars[0]]),
			string(rawLine[stars[0]+1:stars[1]]),
			string(rawLine[stars[1]+1:]))
	}
	if len(stars) == 4 {
		if stars[0]+1 == stars[1] && stars[2]+1 == stars[3] {
			return fmt.Sprintf(`%s<b>%s</b>%s`,
				string(rawLine[:stars[0]]),
				string(rawLine[stars[1]+1:stars[2]]),
				string(rawLine[stars[3]+1:]))
		}
	}
	return line
}

func (e *Engine) renderText(line string) string {
	output := line
	output = e.renderHref(output)
	output = e.renderFont(output)
	return output
}

func (e *Engine) preprocess() {
	symbols := []*symbol{}
	lines := strings.Split(e.input, "\n")
	for i := 0; i < len(lines); i++ {
		var is bool
		var level int
		if is, level = e.isHeaderOpt(lines[i]); is {
			symbols = append(symbols, &symbol{name: symHeaderOpt, level: level, line: i})
			continue
		}
		if is, level = e.isHeader(lines[i]); is {
			symbols = append(symbols, &symbol{name: symHeader, level: level, line: i})
			continue
		}
		if is, level = e.isUnorderList(lines[i]); is {
			symbols = append(symbols, &symbol{name: symUnorderList, level: level, line: i, data: make([]*symbolData, 0)})
			continue
		}
		if is, level = e.isOrderList(lines[i]); is {
			symbols = append(symbols, &symbol{name: symOrderList, level: level, line: i, data: make([]*symbolData, 0)})
			continue
		}
		if is = e.isSepLine(lines, i); is {
			symbols = append(symbols, &symbol{name: symSepLine, line: i})
			i += 2
		}
	}
	e.symbols = symbols
}

func (e *Engine) Process() {
	e.preprocess()

	lines := strings.Split(e.input, "\n")
	outputLines := []string{}
	symLine := -1
	if len(e.symbols) > 0 {
		symLine = e.symbols[0].line
	}
	symIdx := 0

	for i, sym := range e.symbols {
		if sym.name == symUnorderList {
			if i > 0 {
				if e.symbols[i-1].name != symUnorderList {
					e.symbols[i].data = append(e.symbols[i].data, &symbolData{name: symUnorderListOpen, num: 1})
				} else {
					if e.symbols[i-1].level < sym.level {
						e.symbols[i].data = append(e.symbols[i].data, &symbolData{name: symUnorderListOpen, num: 1})
					}
				}
			} else {
				if e.symbols[0].name == symUnorderList {
					e.symbols[i].data = append(e.symbols[i].data, &symbolData{name: symUnorderListOpen, num: 1})
				}
			}

			if i < len(e.symbols)-1 {
				if e.symbols[i+1].name != symUnorderList {
					e.symbols[i].data = append(e.symbols[i].data, &symbolData{name: symUnorderListClose, num: sym.level})
				} else {
					if e.symbols[i+1].level < sym.level {
						e.symbols[i].data = append(e.symbols[i].data, &symbolData{name: symUnorderListClose, num: sym.level - e.symbols[i+1].level})
					}
				}
			} else {
				if e.symbols[len(e.symbols)-1].name == symUnorderList {
					e.symbols[i].data = append(e.symbols[i].data, &symbolData{name: symUnorderListClose, num: sym.level})
				}
			}
		} else if sym.name == symOrderList {
			if i > 0 {
				if e.symbols[i-1].name != symOrderList {
					e.symbols[i].data = append(e.symbols[i].data, &symbolData{name: symOrderListOpen, num: 1})
				} else {
					if e.symbols[i-1].level < sym.level {
						e.symbols[i].data = append(e.symbols[i].data, &symbolData{name: symOrderListOpen, num: 1})
					}
				}
			} else {
				if e.symbols[0].name == symOrderList {
					e.symbols[i].data = append(e.symbols[i].data, &symbolData{name: symOrderListOpen, num: 1})
				}
			}

			if i < len(e.symbols)-1 {
				if e.symbols[i+1].name != symOrderList {
					e.symbols[i].data = append(e.symbols[i].data, &symbolData{name: symOrderListClose, num: sym.level})
				} else {
					if e.symbols[i+1].level < sym.level {
						e.symbols[i].data = append(e.symbols[i].data, &symbolData{name: symOrderListClose, num: sym.level - e.symbols[i+1].level})
					}
				}
			} else {
				if e.symbols[len(e.symbols)-1].name == symOrderList {
					e.symbols[i].data = append(e.symbols[i].data, &symbolData{name: symOrderListClose, num: sym.level})
				}
			}
		}
	}

	for i := 0; i < len(lines); i++ {
		if i == symLine {
			level := e.symbols[symIdx].level
			switch e.symbols[symIdx].name {
			case symHeaderOpt:
				outputLines = outputLines[:len(outputLines)-1]
				outputLines = append(outputLines, e.renderHeaderOpt(lines[i-1], level))
			case symHeader:
				outputLines = append(outputLines, e.renderHeader(lines[i], level))
			case symUnorderList:
				data := e.symbols[symIdx].data
				if len(data) > 0 {
					openNum := 0
					closeNum := 0
					for i := range data {
						if data[i].name == symUnorderListOpen {
							openNum += 1
						}
						if data[i].name == symUnorderListClose {
							closeNum += 1
						}
					}
					str := ""
					for i := 0; i < openNum; i++ {
						str += `<ul>`
					}
					str += e.renderUnorderList(lines[i], level)
					for i := 0; i < closeNum; i++ {
						str += `</ul>`
					}
					outputLines = append(outputLines, str)
				} else {
					outputLines = append(outputLines, e.renderUnorderList(lines[i], level))
				}
			case symOrderList:
				data := e.symbols[symIdx].data
				if len(data) > 0 {
					openNum := 0
					closeNum := 0
					for i := range data {
						if data[i].name == symOrderListOpen {
							openNum += 1
						}
						if data[i].name == symOrderListClose {
							closeNum += 1
						}
					}
					str := ""
					for i := 0; i < openNum; i++ {
						str += `<ol>`
					}
					str += e.renderOrderList(lines[i], level)
					for i := 0; i < closeNum; i++ {
						str += `</ol>`
					}
					outputLines = append(outputLines, str)
				} else {
					outputLines = append(outputLines, e.renderOrderList(lines[i], level))
				}
			case symSepLine:
				outputLines = append(outputLines, `<hr/>`)
				i += 2
			}
			symIdx += 1
			if symIdx < len(e.symbols) {
				symLine = e.symbols[symIdx].line
			} else {
				symLine = -1
			}
			continue
		}
		outputLines = append(outputLines, e.renderText(lines[i]))
	}
	e.output = strings.Join(outputLines, "\n")
}

//NewEngine return markdown engine
func NewEngine() *Engine {
	return &Engine{}
}
