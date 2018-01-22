class SymbolTypeClass {
    constructor() {
        this.Text = 1
        this.Header = 2
        this.HeaderOpt = 3
        this.UnorderList = 4
        this.OrderList = 5
        this.UnorderListOpen = 6
        this.UnorderListClose = 7
        this.OrderListOpen = 8
        this.OrderListClose = 9
    } 
}
let SymbolType = new SymbolTypeClass()
class Engine {
    constructor(input) {
        this.input = input
        this.output = ''
        this.orderListLevel = 0
        this.unorderListLevel = 0
        this.symbol = []
    }
    isHeaderOpt(line) {
        if (line.length < 3) {
            return [false, 0]
        }
        let sep = line[0]
        if ((sep != '-') && (sep != '=')) {
            return [false, 0]
        }
        for (let c of line) {
            if (c != sep) {
                return [false, 0]
            }
        }
        let level = 1;
        if (sep == '=') {
            level = 1
        }
        else if (sep == '-') {
            level = 2
        }
        return [true, level];
    }
    isHeader(line) {
        let level = 0
        for (let c of line) {
            if (c == '#') {
                level += 1
            }
        }
        if ((level >= line.length) || (level == 0)) {
            return [false, 0]
        }
        if (line[level] == ' ') {
            return [true, level]
        }
        return [false, 0]
    }
    renderHeaderOpt(input, level) {
        return `<h${level}>${input}</${level}>`
    }
    renderHeader(input, level) {
        return `<h${level}>${input.slice(level + 1, input.length)}</h${level}>`
    }
    isUnorderList(line) {
        if (line.length < 2) {
            return [false, 0]
        }
        let level = 0
        let i = 0
        let tabLen = 0
        for (i = 0; i < line.length; i++) {
            if (line[i] == '\t') {
                tabLen = 1
                level += 1
            }
            if (line.slice(i, 4) == '    ') {
                tabLen = 4
                level += 1
            }
            else {
                break
            }
        }
        if (i + 2 > line.length) {
            return [false, 0]
        }
        if (tabLen != 0) {
            i += tabLen - 1
        }
        if ((line[i] == '-') || (line[i] == '*')) {
            if (line[i + 1] == ' ') {
                return [true, level]
            }
        }
        return [false, 0]
    }
    renderUnorderList(line, level) {
        return `<li>${line.slice((level - 1) + 2, line.length)}</li>`
    }
    isNumber(c) {
        let toCmp = Number(c)
        for (let cmp = 1; cmp < 7; cmp++) {
            if (toCmp == cmp) {
                return true
            }
        }
        return false
    }
    isOrderList(line) {
        if (line.length < 3) {
            return [false, 0]
        }
        let level = this.orderListLevel
        let i = 0
        for (i = 0; i < line.length; i++) {
            if ((line[i] == '\t') || (line.slice(i, 4) == '    ')) {
                level += 1
            }
            else {
                break
            }
        }
        if (i + 3 > line.length) {
            return [false, 0]
        }
        if (this.isNumber(line[i]) && (line[i + 1] == '.') && (line[i + 2] == ' ')) {
            return [true, level]
        }
        return [false, 0]
    }
    renderOrderList(input, level) {
        return `<li>${input.slice((level - 1) + 3, input.length)}</li>`
    }
    renderHref(line) {
        let leader = -1
        let leftBracket = -1
        let rightBracket = -1
        let leftParentheses = -1
        let rightParentheses = -1
        for (let i = 0; i < line.length; i++) {
            if ((line[i] == '!') && (leader == -1)) {
                leader = i
            }
            if ((line[i] == '[') && (leftBracket == -1)) {
                leftBracket = i
            }
            if ((line[i] == ']') && (rightBracket == -1)) {
                rightBracket = i
            }
            if ((line[i] == '(') && (leftParentheses == -1)) {
                leftParentheses = i
            }
            if ((line[i] == ')') && (rightParentheses == -1)) {
                rightParentheses = i
            }
        }
        let symType = ''
        if (leader + 1 == leftBracket) {
            symType = 'img'
        }
        else if ((leader + 1 != leftBracket)) {
            if ((leftBracket != -1) && (rightBracket != -1) &&
                (leftParentheses != -1) && (rightParentheses != -1)) {
                symType = 'url'
            }
        }
        if (symType == '') {
            return line
        }
        if (rightBracket + 1 != leftParentheses) {
            return line
        }
        if (leader >= leftBracket) {
            return line
        }
        if (leftBracket >= rightBracket) {
            return line
        }
        if (rightBracket >= leftParentheses) {
            return line
        }
        if (leftParentheses >= rightParentheses) {
            return line
        }
        if (symType == 'img') {
            return `${line.slice(0, leader)}
            <img src='${line.slice(leftParentheses + 1, rightParentheses)}' alt='${line.slice(leftBracket + 1, rightBracket)}'>
            ${line.slice(rightParentheses + 1, line.length)}`
        }
        else if (symType == 'url') {
            return `${line.slice(0, leftBracket)}
            <a href='${line.slice(leftParentheses + 1, rightParentheses)}'>${line.slice(leftBracket + 1, rightBracket)}</a>
            ${line.slice(rightParentheses + 1, line.length)}`
        }
        return line
    }
    renderFont(line) {
        let stars = []
        for (let i = 0; i < line.length; i++) {
            if (line[i] == '*') {
                stars.push(i)
            }
        }
        if (stars.length == 2) {
            return `${line.slice(0, stars[0])}
            <i>${line.slice(stars[0] + 1, stars[1])}</i>
            ${line.slice(stars[1] + 1, line.length)}`
        }
        if (stars.length == 4) {
            if ((stars[0] + 1 == stars[1]) && (stars[2] + 1 == stars[3])) {
                return `${line.slice(0, stars[0])}
                <b>${line.slice(stars[1] + 1, stars[2])}</b>
                ${line.slice(stars[3] + 1, line.length)}`
            }
        }
        return line
    }
    renderText(line) {
        let output = line
        output = this.renderHref(output)
        output = this.renderFont(output)
        return output
    }
    isSepLine(lines, idx) {
        if (idx + 2 > lines.length) {
            return false
        }
        if (lines.length < 3) {
            return false
        }
        for (let c of lines[idx]) {
            if (c != ' ') {
                return false
            }
        }
        for (let c of lines[idx + 2]) {
            if (c != ' ') {
                return false
            }
        }
        for (let c of lines[idx + 1]) {
            if (c == '-') {
                continue
            }
            if (c == '*') {
                continue
            }
            return false
        }
        return true
    }
    Preprocess() {
        let symbol = []
        let outputLines = []
        let lines = this.input.split('\n')
        for (let i = 0; i < lines.length; i++) {
            // console.log(lines[i])
            let [bool, level] = this.isHeader(lines[i])
            if (bool) {
                symbol.push({ name: SymbolType.Header, level: level, line: i })
                continue
            }
            [bool, level] = this.isHeaderOpt(lines[i])
            if (bool) {
                symbol.push({ name: SymbolType.HeaderOpt, level: level, line: i })
                continue
            }
            [bool, level] = this.isUnorderList(lines[i])
            if (bool) {
                symbol.push({ name: SymbolType.UnorderList, level: level, line: i })
                continue
            }
            [bool, level] = this.isOrderList(lines[i])
            if (bool) {
                symbol.push({ name: SymbolType.OrderList, level: level, line: i })
                continue
            }
            bool = this.isSepLine(lines, i)
            if (bool) {
                symbol.push({ name: SymbolType.SepLine, line: i })
                i += 2
            }
        }
        this.symbol = symbol
    }
    Process() {
        let outputList = []
        let lines = this.input.split('\n')
        let symLine = -1
        let symIdx = 0
        if (this.symbol.length > 0) {
            symLine = this.symbol[0].line
        }
        let unorderList = []
        let orderList = []
        let lastLine = -1
        let lastLevel = -1
        for (let sym of this.symbol) {
            if (sym.name == SymbolType.UnorderList) {
                if (sym.line > lastLine) {
                    if (sym.level > lastLevel) {
                        unorderList.push({ name: SymbolType.UnorderListOpen, line: sym.line })
                    }
                    else if (sym.level < lastLevel) {
                        unorderList.push({ name: SymbolType.UnorderListClose, line: sym.line })
                    }
                    lastLevel = sym.level
                }
            }
            else {
                while (lastLevel != -1) {
                    unorderList.push({ name: SymbolType.UnorderListClose, line: sym.line })
                    lastLevel -= 1
                }
            }
        }
        lastLine = -1
        lastLevel = -1
        for (let sym of this.symbol) {
            if (sym.name == SymbolType.OrderList) {
                if (sym.line > lastLine) {
                    if (sym.level > lastLevel) {
                        orderList.push({ name: SymbolType.OrderListOpen, line: sym.line })
                    }
                    else if (sym.level < lastLevel) {
                        orderList.push({ name: SymbolType.OrderListClose, line: sym.line })
                    }
                    lastLevel = sym.level
                }
            }
            else {
                while (lastLevel != -1) {
                    orderList.push({ name: SymbolType.OrderListClose, line: sym.line })
                    lastLevel -= 1
                }
            }
        }
        for (let i = 0; i < lines.length; i++) {
            for (let sym of unorderList) {
                if (i > sym.line) {
                    continue
                }
                if (i == sym.line) {
                    if (sym.name == SymbolType.UnorderListOpen) {
                        outputList.push(`<ul>`)
                    }
                    else {
                        outputList.push(`</ul>`)
                    }
                }
            }
            for (let sym of orderList) {
                if (i > sym.line) {
                    continue
                }
                if (i == sym.line) {
                    if (sym.name == SymbolType.OrderListOpen) {
                        outputList.push(`<ol>`)
                    }
                    else {
                        outputList.push(`</ol>`)
                    }
                }
            }
            if (i == symLine) {
                let level = this.symbol[symIdx].level
                switch (this.symbol[symIdx].name) {
                    case SymbolType.Header:
                        outputList.push(this.renderHeader(lines[i], level))
                        break
                    case SymbolType.HeaderOpt:
                        outputList.pop()
                        outputList.push(this.renderHeaderOpt(lines[i - 1], level))
                        break
                    case SymbolType.UnorderList:
                        outputList.push(this.renderUnorderList(lines[i], level))
                        break
                    case SymbolType.OrderList:
                        outputList.push(this.renderOrderList(lines[i], level))
                        break
                    case SymbolType.SepLine:
                        outputList.push(`<hr/>`)
                        i += 2
                        break
                }
                symIdx += 1
                if (symIdx < this.symbol.length) {
                    symLine = this.symbol[symIdx].line
                }
                else {
                    symLine = -1
                }
                continue
            }
            outputList.push(this.renderText(lines[i]))
        }
        this.output = outputList.join('')
    }
    Input(input) {
        this.input = input
    }
    Output() {
        return this.output
    }
}
let hasInput = false
let textarea = document.getElementById('textarea')
let markdown_iframe = document.getElementById('markdown-iframe')
let mdEngine = new Engine('')
function dealWithInput() {
    if (hasInput) {
        hasInput = false
        let text = textarea.value
        mdEngine.Input(text)
        mdEngine.Preprocess()
        mdEngine.Process()
        let output = mdEngine.Output()
        // console.log(output)
        markdown_iframe.srcdoc = output
    }
}
window.onload = function () {
    markdown_iframe.style.height = (window.innerHeight).toString() + "px"
    markdown_iframe.style.width = (window.innerWidth / 2).toString() + "px"
    textarea.style.height = (window.innerHeight).toString() + "px"
    textarea.style.width = (window.innerWidth / 2).toString() + "px"
    textarea.oninput = function () { 
        hasInput = true
        // console.log(this.innerHTML) 
    }
    let text = `
大标题<br>
======<br>
小标题<br>
---<br>
# 一级标题<br>
###### 六级标题<br>
普通文本<br>
*斜体*<br>
**粗体**<br>
 <br>
-----<br>
 <br>
![图片](https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=538188260,366145546&fm=58&u_exp_0=4266121941,32840136&fm_exp_0=86&bpow=512&bpoh=512)<br>
链接[百度](http://www.baidu.com)<br>
- 无须列表<br>
    - 嵌套<br>
* 无序列表2<br>
1. 有序列表<br>
2. 有序列表2<br>
1. 有序列表3<br>
`
    text = text.replace(/<br>/g, '')
    mdEngine.Input(text)
    mdEngine.Preprocess()
    mdEngine.Process()
    let output = mdEngine.Output()
    textarea.value = text
    markdown_iframe.srcdoc = output
    // console.log(output)
    window.setInterval(dealWithInput, 100)
}
