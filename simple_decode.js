// Web开发与安全/前端安全/数据安全/代码保护/11.实践/4.反混淆"控制流"

const fs = require('fs');
const parser    = require("@babel/parser");
const traverse  = require("@babel/traverse").default;
const generator = require("@babel/generator").default;


//将源代码解析为AST
process.argv.length > 2?encodeFile = process.argv[2]:encodeFile = "./hooked.js";
process.argv.length > 3?decodeFile = process.argv[3]:decodeFile = "./decode_result.js";

sourceCode = fs.readFileSync(encodeFile, {encoding: "utf-8"});
ast    = parser.parse(sourceCode);


let result = {"11":[9,6,5],"12":[7,8]}   // simple.js [7,8,7,8,7,8]简化成[7,8]
//let result = {"7":[4,0,6,5,3,2,1]}   // obfuscator-1.js
//let result = {"7":[],"8":[0,2,5,3,1,6,4]}   // obfuscator-2.js

let case_map = {}


const rewriteProgram = {
    "Program" ({node,scope}){
        node.body = node.body.slice(2, node.body.length-1)
    }
}


const rewriteSwitchCase = {
    "SwitchCase" ({node,scope}){
        let literal = node.consequent[0].expression.value
        case_map[literal] = node
    }
}


function rewriteWhile(path){
    let node = path.node
    let literal = node.body.body[0].expression.value
    let cases = []
    if (literal in result){
        for(let i in result[literal]){
            let caseId = result[literal][i]
            //console.log(caseId)

            let caseNode = case_map[caseId]

            if (caseNode.consequent.length >= 4){
                caseNode.consequent = caseNode.consequent.slice(2, caseNode.consequent.length-1)

                // 将case块组合成顺序执行的语句
                for(let j in caseNode.consequent){
                    let node = caseNode.consequent[j]
                    cases.push(node)
                }
            }
        }
    } else {
        // throw Error("should not be here")
    }

    /*
    混淆的while-switch-case块，将被替换成顺序语句

    正常业务如果有while块,代码也会被插桩，因此还原代码时需要清理插桩代码
    * */
    if (cases.length !== 0){
        path.replaceInline(cases)
    } else {
        console.log(literal)
        node.body.body = node.body.body.slice(2, node.body.body.length-1)
    }
}


traverse(ast, rewriteSwitchCase);
traverse(ast, {WhileStatement: rewriteWhile});
traverse(ast, rewriteProgram);


let {code} = generator(ast);
fs.writeFile(decodeFile, code, (err) => {});
