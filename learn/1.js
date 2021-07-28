// https://blog.csdn.net/lacoucou/article/details/113665767
const parser = require('@babel/parser');
const template = require('@babel/template').default;
const traverse = require('@babel/traverse').default;
const types = require('@babel/types');
const generator = require('@babel/generator').default;
const path = require('path');
const fs = require('fs');


let jsStr =`var arr="3,0,1,2,4".split(",");
var cnt=0;
while(true){
    switch(arr[cnt++]){
        case "0":
            console.log("case 0");
            111
            continue;
        case "1":
            console.log("case 1");
            continue;
        case "2":
            console.log("case 2");
            continue;
        case "3":
            console.log("case 3");
            continue;
        case "4":
            console.log("case 4");
            continue;
 
    }
    break;
}`;

const ast = parser.parse(jsStr);
// 处理控制流平坦化
const decode_while = {
    WhileStatement(path) {
        let {test, body} = path.node;
        let swithchNode = body.body[0];
        //if (!types.isUnaryExpression(test) || !types.isSwitchStatement(swithchNode)) return;
        let {discriminant, cases} = swithchNode;
        if (!types.isMemberExpression(discriminant) || !types.isUpdateExpression(discriminant.property)) return;
        let arrayName = discriminant.object.name;
        //获得所有上方的兄弟节点  这里获取到的是两个变量声明的节点
        let per_bro_node = path.getAllPrevSiblings();
        let array = []
        per_bro_node.forEach(per_node => {
            const {declarations} = per_node.node;
            let {id, init} = declarations[0];
            if (arrayName === id.name) {
                array = init.callee.object.value.split(',');
            }
            per_node.remove();
        });

        let replace_body = [];
        array.forEach(index => {
                let case_body = cases[index].consequent;
                if (types.isContinueStatement(case_body[case_body.length - 1])) {
                    case_body.pop();
                }
                replace_body = replace_body.concat(case_body);
            }
        );
        path.replaceInline(replace_body);
    }
}

traverse(ast, decode_while);

/************************************
 处理完毕，生成新代码
 *************************************/
let {code} = generator(ast);
console.log(code);