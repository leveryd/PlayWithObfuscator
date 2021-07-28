* 本仓库是什么？

    本仓库记录Javascript反混淆的实践，只是demo阶段。
    
    目前只实现将"while-switch-case代码块"变成"顺序执行的代码块"。
    
    比如 PlayWithObfuscator/tests/encoded_js/simple.js 中的混淆后的代码
    ```
    while (!![]) {
        switch (_0xcgcd3c[_0x3922ce++]) {
            case "0":
                if (_0x33g15b = _0x5153cd.charCodeAt(_0xeea791 += .75), _0x33g15b > 255) throw new t("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
                continue;
    
            case "1":
                _0xed1fcd = _0xed1fcd << 8 | _0x33g15b;
                continue;
        }
    
        break;
    }
    ```
    
    转换成 阅读性更好一些的代码
    ```
    if (_0x33g15b = _0x5153cd.charCodeAt(_0xeea791 += .75), _0x33g15b > 255) throw new t("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
    _0xed1fcd = _0xed1fcd << 8 | _0x33g15b;
    ```
    
    目前可以对以下工具产生的"控制流混淆"做反混淆：
    * https://obfuscator.io/
    * https://github.com/Tsaiboss/ControlFlow
    
    测试结果在 tests 目录看到
    
* 怎么对"控制流混淆"做反混淆？

   具体见 `doc/1.反混淆简单的"控制流平坦化"代码.md`
   
* 怎么测试本项目？

    按照以下步骤运行：
    * 运行`node hook.js`对指定js文件插桩；运行前需要修改代码中的"输入文件路径"
    * chrome浏览器中打开tests/test.html文件；运行一段时间后，从浏览器localStorage.result复制出"case块运行顺序"
    * 将"case块运行顺序"复制到simple_decode.js中
    * 运行`node simple_decode.js`，输出反混淆文件
    
    验证反混淆是否成功：
    * 运行`node decode_result.js`，检查输出结果和原文件是否相同。一致则说明反混淆成功