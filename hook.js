// Web开发与安全/前端安全/数据安全/代码保护/11.实践/4.反混淆"控制流"

const fs = require('fs');
const parser    = require("@babel/parser");
const traverse  = require("@babel/traverse").default;
const types     = require("@babel/types");
const generator = require("@babel/generator").default;

//将源代码解析为AST
process.argv.length > 2?encodeFile = process.argv[2]:encodeFile = "./encode.js";
process.argv.length > 3?decodeFile = process.argv[3]:decodeFile = "./hooked.js";

//encodeFile = "./tests/encoded_js/simple.js"
//encodeFile = "./tests/encoded_js/obfuscator-1.js"
encodeFile = "./tests/encoded_js/obfuscator-2.js";

sourceCode = fs.readFileSync(encodeFile, {encoding: "utf-8"});
ast    = parser.parse(sourceCode);


let count_flag = 0

let hook_str = `
if(localStorage.test){
    localStorage.test += "," + {{count_flag}}
} else {
    localStorage.test = {{count_flag}}
}
`

let template_str_1 = `
let case_statement_id = {{count_flag}}
while_id_on_stack_op = while_id_stack[while_id_stack.length-1]
collection[while_id_on_stack_op].push(case_statement_id)
`

let template_str = `
let while_statement_id= {{count_flag}}


if (while_statement_id in collection) {
    if (while_statement_id !== while_id_stack[while_id_stack.length-1]){
        //alert("bad")  // 不应该发生循环调用
    }  // 循环调用
} else {
    // collection[while_statement_id] = [case_statement_id]
    collection[while_statement_id] = []
}

while_id_stack.push(while_statement_id)
`

let log_result_template_str = `

`

let chars = "x1x2x3x4"


function build_eval_statement(s){
    let console=types.Identifier("window")
    let log=types.Identifier("eval")
    let console_log=types.memberExpression(console, log, false)

    let x = types.valueToNode(s)
    return types.callExpression(console_log, [x])
}

function build_statement(s){
    return types.valueToNode(chars + s + chars)
}

function filter(code){
    let x = chars + "\""

    code = code.replace(new RegExp(x, "gm"), "")

    x = "\"" + chars
    code = code.replace(new RegExp(x, "gm"), "")
    return code
}

const rewriteProgram = {
    "Program" ({node,scope}){
        let a = build_statement("let while_id_stack = [];")
        let b = build_statement("let collection = {};")
        node.body.unshift(a, b)

        //let c = build_eval_statement("alert(JSON.stringify(collection));")
        let c = build_eval_statement("localStorage.result=JSON.stringify(collection);")
        node.body.push(c)
    }
}


const rewriteWhileExpr = {
    "WhileStatement" ({node,scope}){

        let a = build_statement(count_flag)
        let b = build_eval_statement(template_str.replace(/{{count_flag}}/g, count_flag))
        node.body.body.unshift(b)
        node.body.body.unshift(a)   // while块的数字编号

        count_flag++

        let d = build_statement("while_id_stack.pop();")
        node.body.body.push(d)
    }
}

const rewriteForExpr = {
    "ForStatement" ({node,scope}) {

        let b = build_eval_statement(template_str.replace(/{{count_flag}}/g, count_flag))

        count_flag++

        let d = build_eval_statement("while_id_stack.pop()")

        // node.body 有可能是Expression类型
        if (types.isExpression(node.body)) {
            console.log(node.body)
        } else {
            let tmp = node.body
            node.body = types.blockStatement([types.expressionStatement(b), tmp, types.expressionStatement(d)])
        }
    }
}


const rewriteCaseExpr = {
    "SwitchCase" ({node,scope}){
        let a= build_eval_statement(template_str_1.replace(/{{count_flag}}/g, count_flag))

        node.consequent.unshift(a)
        node.consequent.unshift(build_statement(count_flag))   // case块的数字编号
        // console.log(node.consequent)

        count_flag++
    }
}

traverse(ast, rewriteCaseExpr);
traverse(ast, rewriteWhileExpr);
traverse(ast, rewriteProgram);
//traverse(ast, rewriteForExpr);

let {code} = generator(ast);


fs.writeFile(decodeFile, filter(code), (err) => {});
