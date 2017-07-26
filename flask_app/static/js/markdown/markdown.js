let text = `
big header
======
little header
---
# head-1
###### head-6
text
- list1
    - list1-1
- list2
    - list2-1
* list2
1.  hello
2. world
1. good
3. bye
`;
var SymbolType;
(function (SymbolType) {
    SymbolType[SymbolType["Text"] = 1] = "Text";
    SymbolType[SymbolType["Header"] = 2] = "Header";
    SymbolType[SymbolType["HeaderOpt"] = 3] = "HeaderOpt";
    SymbolType[SymbolType["UnorderList"] = 4] = "UnorderList";
    SymbolType[SymbolType["OrderList"] = 5] = "OrderList";
    SymbolType[SymbolType["UnorderListOpen"] = 6] = "UnorderListOpen";
    SymbolType[SymbolType["UnorderListClose"] = 7] = "UnorderListClose";
    SymbolType[SymbolType["OrderListOpen"] = 8] = "OrderListOpen";
    SymbolType[SymbolType["OrderListClose"] = 9] = "OrderListClose";
})(SymbolType || (SymbolType = {}));
class Engine {
    constructor(input) {
        this.input = input;
        this.output = '';
        this.orderListLevel = 0;
        this.unorderListLevel = 0;
        this.symbol = [];
    }
    isHeaderOpt(line) {
        if (line.length < 3) {
            return [false, 0];
        }
        let sep = line[0];
        if ((sep != '-') && (sep != '=')) {
            return [false, 0];
        }
        for (let c of line) {
            if (c != sep) {
                return [false, 0];
            }
        }
        let level = 1;
        if (sep == '=') {
            level = 1;
        }
        else if (sep == '-') {
            level = 2;
        }
        return [true, level];
    }
    isHeader(line) {
        let level = 0;
        for (let c of line) {
            if (c == '#') {
                level += 1;
            }
        }
        if ((level >= line.length) || (level == 0)) {
            return [false, 0];
        }
        if (line[level] == ' ') {
            return [true, level];
        }
        return [false, 0];
    }
    renderHeaderOpt(input, level) {
        return `<h${level}>${input}</${level}>`;
    }
    renderHeader(input, level) {
        return `<h${level}>${input.slice(level + 1, input.length)}</h${level}>`;
    }
    isUnorderList(line) {
        if (line.length < 2) {
            return [false, 0];
        }
        let level = 0;
        let i = 0;
        let tabLen = 0;
        for (i = 0; i < line.length; i++) {
            if (line[i] == '\t') {
                tabLen = 1;
                level += 1;
            }
            if (line.slice(i, 4) == '    ') {
                tabLen = 4;
                level += 1;
            }
            else {
                break;
            }
        }
        if (i + 2 > line.length) {
            return [false, 0];
        }
        if (tabLen != 0) {
            i += tabLen - 1;
        }
        console.log(line.slice(i, line.length));
        if ((line[i] == '-') || (line[i] == '*')) {
            if (line[i + 1] == ' ') {
                return [true, level];
            }
        }
        return [false, 0];
    }
    renderUnorderList(line, level) {
        return `<li>${line.slice((level - 1) + 2, line.length)}</li>`;
    }
    isNumber(c) {
        let toCmp = Number(c);
        for (let cmp = 1; cmp < 7; cmp++) {
            if (toCmp == cmp) {
                return true;
            }
        }
        return false;
    }
    isOrderList(line) {
        if (line.length < 3) {
            return [false, 0];
        }
        let level = this.orderListLevel;
        let i = 0;
        for (i = 0; i < line.length; i++) {
            if ((line[i] == '\t') || (line.slice(i, 4) == '    ')) {
                level += 1;
            }
            else {
                break;
            }
        }
        if (i + 3 > line.length) {
            return [false, 0];
        }
        if (this.isNumber(line[i]) && (line[i + 1] == '.') && (line[i + 2] == ' ')) {
            return [true, level];
        }
        return [false, 0];
    }
    renderOrderList(input, level) {
        return `<li>${input.slice((level - 1) + 3, input.length)}</li>`;
    }
    Preprocess() {
        let symbol = [];
        let outputLines = [];
        let lines = this.input.split('\n');
        for (let i = 0; i < lines.length; i++) {
            let [bool, level] = this.isHeader(lines[i]);
            if (bool) {
                symbol.push({ name: SymbolType.Header, level: level, line: i });
                continue;
            }
            [bool, level] = this.isHeaderOpt(lines[i]);
            if (bool) {
                symbol.push({ name: SymbolType.HeaderOpt, level: level, line: i });
                continue;
            }
            [bool, level] = this.isUnorderList(lines[i]);
            if (bool) {
                symbol.push({ name: SymbolType.UnorderList, level: level, line: i });
                continue;
            }
            [bool, level] = this.isOrderList(lines[i]);
            if (bool) {
                symbol.push({ name: SymbolType.OrderList, level: level, line: i });
                continue;
            }
        }
        this.symbol = symbol;
        // for (let obj of symbol) {
        //     console.log(obj)
        // }
    }
    Process() {
        let outputList = [];
        let lines = this.input.split('\n');
        let symLine = -1;
        let symIdx = 0;
        if (this.symbol.length > 0) {
            symLine = this.symbol[0].line;
        }
        let unorderList = [];
        let orderList = [];
        let lastLine = -1;
        let lastLevel = -1;
        for (let sym of this.symbol) {
            if (sym.name == SymbolType.UnorderList) {
                if (sym.line > lastLine) {
                    if (sym.level > lastLevel) {
                        unorderList.push({ name: SymbolType.UnorderListOpen, line: sym.line });
                    }
                    else if (sym.level < lastLevel) {
                        unorderList.push({ name: SymbolType.UnorderListClose, line: sym.line });
                    }
                    lastLevel = sym.level;
                }
            }
            else {
                while (lastLevel != -1) {
                    unorderList.push({ name: SymbolType.UnorderListClose, line: sym.line });
                    lastLevel -= 1;
                }
            }
        }
        lastLine = -1;
        lastLevel = -1;
        for (let sym of this.symbol) {
            if (sym.name == SymbolType.OrderList) {
                if (sym.line > lastLine) {
                    if (sym.level > lastLevel) {
                        orderList.push({ name: SymbolType.OrderListOpen, line: sym.line });
                    }
                    else if (sym.level < lastLevel) {
                        orderList.push({ name: SymbolType.OrderListClose, line: sym.line });
                    }
                    lastLevel = sym.level;
                }
            }
            else {
                while (lastLevel != -1) {
                    orderList.push({ name: SymbolType.OrderListClose, line: sym.line });
                    lastLevel -= 1;
                }
            }
        }
        // for (let obj of unorderList) {
        //     console.log(obj)
        // }
        // for (let obj of orderList) {
        //     console.log(obj)
        // }
        // console.log(symLine)
        for (let i = 0; i < lines.length; i++) {
            for (let sym of unorderList) {
                if (i > sym.line) {
                    continue;
                }
                if (i == sym.line) {
                    if (sym.name == SymbolType.UnorderListOpen) {
                        outputList.push(`<ul>`);
                    }
                    else {
                        outputList.push(`</ul>`);
                    }
                }
            }
            for (let sym of orderList) {
                if (i > sym.line) {
                    continue;
                }
                if (i == sym.line) {
                    if (sym.name == SymbolType.OrderListOpen) {
                        outputList.push(`<ol>`);
                    }
                    else {
                        outputList.push(`</ol>`);
                    }
                }
            }
            if (i == symLine) {
                let level = this.symbol[symIdx].level;
                switch (this.symbol[symIdx].name) {
                    case SymbolType.Header:
                        outputList.push(this.renderHeader(lines[i], level));
                        break;
                    case SymbolType.HeaderOpt:
                        outputList.pop();
                        outputList.push(this.renderHeaderOpt(lines[i - 1], level));
                        break;
                    case SymbolType.UnorderList:
                        outputList.push(this.renderUnorderList(lines[i], level));
                        break;
                    case SymbolType.OrderList:
                        outputList.push(this.renderOrderList(lines[i], level));
                        break;
                }
                symIdx += 1;
                if (symIdx < this.symbol.length) {
                    symLine = this.symbol[symIdx].line;
                }
                else {
                    symLine = -1;
                }
                continue;
            }
            console.log("text: ", lines[i]);
            outputList.push(lines[i]);
        }
        this.output = outputList.join('');
    }
    Output() {
        return this.output;
    }
}
let md = new Engine(text);
md.Preprocess();
md.Process();
document.getElementById('text').innerHTML = md.Output();
console.log(md.Output());
