// https://github.com/Tsaiboss/ControlFlow
window = {};

window.atob = function (_0xc0750g) {
  var _0xfbb16d = "4|1|2|3|0"["split"]("|"),
      _0xec2868 = 0;

  while (!![]) {
    switch (_0xfbb16d[_0xec2868++]) {
      case "0":
        0;
        window.eval("\nlet case_statement_id = 0\nwhile_id_on_stack_op = while_id_stack[while_id_stack.length-1]\ncollection[while_id_on_stack_op].push(case_statement_id)\n");
        return _0xec4345;
        continue;

      case "1":
        1;
        window.eval("\nlet case_statement_id = 1\nwhile_id_on_stack_op = while_id_stack[while_id_stack.length-1]\ncollection[while_id_on_stack_op].push(case_statement_id)\n");

        var _0x1adc16 = String(_0xc0750g).replace(/=+$/, "");

        continue;

      case "2":
        2;
        window.eval("\nlet case_statement_id = 2\nwhile_id_on_stack_op = while_id_stack[while_id_stack.length-1]\ncollection[while_id_on_stack_op].push(case_statement_id)\n");
        if (_0x1adc16.length % 4 == 1) throw new t("'atob' failed: The string to be decoded is not correctly encoded.");
        continue;

      case "3":
        3;
        window.eval("\nlet case_statement_id = 3\nwhile_id_on_stack_op = while_id_stack[while_id_stack.length-1]\ncollection[while_id_on_stack_op].push(case_statement_id)\n");

        for (var _0xb342a5, _0x7ecb47, _0xc54a87 = 0, _0xa14d1g = 0, _0xec4345 = ""; _0x7ecb47 = _0x1adc16.charAt(_0xa14d1g++); ~_0x7ecb47 && (_0xb342a5 = _0xc54a87 % 4 ? 64 * _0xb342a5 + _0x7ecb47 : _0x7ecb47, _0xc54a87++ % 4) ? _0xec4345 += String.fromCharCode(255 & _0xb342a5 >> (-2 * _0xc54a87 & 6)) : 0) _0x7ecb47 = e.indexOf(_0x7ecb47);

        continue;

      case "4":
        4;
        window.eval("\nlet case_statement_id = 4\nwhile_id_on_stack_op = while_id_stack[while_id_stack.length-1]\ncollection[while_id_on_stack_op].push(case_statement_id)\n");
        e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        continue;
    }

    break;
  }
};

window.btoa = function (_0xdc05f0) {
  var _0x39674c = "2|1|0"["split"]("|"),
      _0x902bcb = 0;

  e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

  for (var _0xed1fcd, _0x33g15b, _0x5153cd = String(_0xdc05f0), _0xeea791 = 0, _0xc94d67 = e, _0xde212b = ""; _0x5153cd.charAt(0 | _0xeea791) || (_0xc94d67 = "=", _0xeea791 % 1); _0xde212b += _0xc94d67.charAt(63 & _0xed1fcd >> 8 - _0xeea791 % 1 * 8)) {
    var _0xcgcd3c = "0|1"["split"]("|"),
        _0x3922ce = 0;

    if (_0x33g15b = _0x5153cd.charCodeAt(_0xeea791 += .75), _0x33g15b > 255) throw new t("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
    _0xed1fcd = _0xed1fcd << 8 | _0x33g15b;
  }

  return _0xde212b;
};

console.log(window.btoa("xx"));