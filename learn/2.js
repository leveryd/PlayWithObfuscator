// https://blog.csdn.net/lacoucou/article/details/113665767
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;


let jscode= `function check_pass(_0x57a7be) {
    var _0x252e28 = {
        'tPlEX': function (_0x52a315, _0x59fdfd) {
            return _0x52a315 == _0x59fdfd;
        },
        'TcjYB': function (_0x300e56, _0x2fe857) {
            return _0x300e56 + _0x2fe857;
        },
        'ZtFYf': function (_0x53b823, _0x136f17) {
            return _0x53b823 == _0x136f17;
        },
        'tPstu': function (_0x1607f2, _0x4a18be) {
            return _0x1607f2 > _0x4a18be;
        },
        'Vhxzy': function (_0x248a47, _0x5a2ca2) {
            return _0x248a47 < _0x5a2ca2;
        },
        'uuFIS': function (_0x3718bc, _0x3081f9) {
            return _0x3718bc == _0x3081f9;
        },
        'cRvgS': function (_0x56fd75, _0x1d2164) {
            return _0x56fd75 ^ _0x1d2164;
        },
        'GsTse': 'Orz..',
        'ykyBq': 'len\x20error'
    };
    var _0x537fc8 = 0x0;
    var _0x3df4b0 = 0x0;
    for (_0x537fc8 = 0x0;; _0x537fc8++) {
        if (_0x252e28['tPlEX'](_0x537fc8, _0x57a7be['length'])) {
            break;
        }
        _0x3df4b0 = _0x252e28['TcjYB'](_0x3df4b0, _0x57a7be['charCodeAt'](_0x537fc8));
    }
    if (_0x252e28['ZtFYf'](_0x537fc8, 0x4)) {
        if (_0x252e28['ZtFYf'](_0x3df4b0, 0x1a1) && _0x252e28['tPstu'](_0x57a7be['charAt'](0x3), 'c') && _0x252e28['Vhxzy'](_0x57a7be['charAt'](0x3), 'e') && _0x252e28['uuFIS'](_0x57a7be['charAt'](0x0), 'b')) {
            if (_0x252e28['uuFIS'](_0x252e28['cRvgS'](_0x57a7be['charCodeAt'](0x3), 0xd), _0x57a7be['charCodeAt'](0x1))) {
                return 0x1;
            }
            console['log'](_0x252e28['GsTse']);
        }
    } else {
        console['log'](_0x252e28['ykyBq']);
    }
    return 0x0;
}
function test() {
    var _0x288152 = {
        'eOZRR': function (_0x3f5c8e, _0x24ced8) {
            return _0x3f5c8e(_0x24ced8);
        },
        'alzHn': 'bird',
        'GyIol': function (_0x5ddbd5, _0x5cc507) {
            return _0x5ddbd5(_0x5cc507);
        },
        'FWSbx': 'congratulation!',
        'tYizA': 'error!'
    };
    if (_0x288152['eOZRR'](check_pass, _0x288152['alzHn'])) {
        _0x288152['GyIol'](alert, _0x288152['FWSbx']);
    } else {
        _0x288152['GyIol'](alert, _0x288152['tYizA']);
    }
}
test();`;

// 将代码解析为AST树
const ast = parser.parse(jscode);


traverse(ast, {
    VariableDeclarator: decrypt
})

function decrypt(path) {
    var node = path.node;
    if (!node.id||!node.id.name)
        return;
    var node_name = node.id.name
    // 筛选符合条件的节点
    // if (!t.isObjectExpression(node.init))
    //     return;

    // 获取properties
    var obj_properties = node.init.properties

    if (!obj_properties||obj_properties.length == 0)
        return;

    for (var property of obj_properties) {
        //var property_name = property.key.name
        var property_name = property.key.value;
        //console.log("[0]property_name:"+property_name);

        traverse(ast, {
            CallExpression: function(call_path) {
                // 遍历函数节点
                if (property.value.type==="FunctionExpression") {
                    // 如果为函数
                    var c_node = call_path.node;
                    var call_params = c_node.arguments;

                    // 确定是否是需要替换的节点
                    if (!c_node.callee||!t.isMemberExpression(c_node.callee))
                        return;
                    if (!t.isIdentifier(c_node.callee.object)||c_node.callee.object.name != node_name)
                        return;
                    if (!t.isStringLiteral(c_node.callee.property)||c_node.callee.property.value != property_name)
                        return;

                    //console.log("property_name:"+property_name);

                    // 构建新的Expression并替换
                    var call_argument = property.value.body.body[0].argument
                    if (t.isBinaryExpression(call_argument) && call_params.length==2) {
                        call_path.replaceWith(t.binaryExpression(call_argument.operator, call_params[0], call_params[1]));
                    } else if (t.isLogicalExpression(call_argument) && call_params.length==2) {
                        call_path.replaceWith(t.isLogicalExpression(call_argument.operator, call_params[0], call_params[1]));
                    } else if(t.isCallExpression(call_argument) && t.isIdentifier(call_argument.callee)) {
                        if (call_params.length == 1) {
                            call_path.replaceWith(call_params[0])
                        } else {
                            call_path.replaceWith(t.callExpression(call_params[0], call_params.slice(1)))
                        }

                    }
                }
            },
            MemberExpression: function(member_path) {
                // 遍历属性节点
                if (t.isStringLiteral(property.value)) {
                    // 如果为属性

                    var m_node = member_path.node
                    var property_value = property.value.value

                    if (!t.isIdentifier(m_node.object)||m_node.object.name != node_name){
                        return;}
                    if (!t.isStringLiteral(m_node.property)||m_node.property.value!=property_name)
                        return;

                    // 替换
                    member_path.replaceWith(t.stringLiteral(property_value))
                }
            }

        })

    }
    path.remove();

}


//console['log']() 变 console.log()
function transform(path) {
    //path.node.property 获取到的是属性值  这是一个node类型
    //path.get('property') 获取到的是一个path(NodePath类型) 只有NodePath才有替换方法
    let property=path.node.property;
    let property_path=path.get('property');
    if(t.isStringLiteral(property_path))
    {
        const val=property_path.node.value;
        path.node.computed=false;
        property_path.replaceWith(t.identifier(val));
    }
}

traverse(ast, {
    MemberExpression: transform
})

//变量重命名 这个例子里没有全局变量，所以可以这么搞，有全局变量与局部变量同名的要小心
function rename(path) {
    let name=path.node.name;
    if(name=="_0x537fc8")
    {
        path.node.name="i";
    }
    else if(name=="_0x3df4b0")
    {
        path.node.name="sum";
    }
    else if(name=="_0x57a7be")
    {
        path.node.name="passwd";
    }
}

traverse(ast, {
    Identifier: rename
})


let {code} = generator(ast);
console.log(code);