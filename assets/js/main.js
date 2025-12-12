document.getElementById("myForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // 阻止表单默认提交（不刷新页面）

    const domain = document.getElementById("domain").value;
    const code = document.getElementById("code").value;

    //之后在做校验


    const masterPwd = code;
    const salt = domain;
    //因为是全局的argon2对象，所以直接用
    //结果是十六进制字符串（hex)
    //在十六进制（hex）表示里：每个字节 → 2 个 hex 字符
    //默认情况下，hash 长度是 32 字节（256 bit）
    const hashResult = await argon2.hash({
        pass: masterPwd,
        salt: salt,
        type: argon2.ArgonType.Argon2id
    });

    //目前主流的密码都要求12位，要求有数字、大小写字母、特殊字符

    //将 hash 转成数字数组
    //ch 是 hash 的每个字符。parseInt(ch, 16) 表示：把字符 ch 当作十六进制数字转换成十进制整数
    //Array.from() 的作用：把可迭代对象（Iterable）转换成数组。对字符串来说，就是把每个字符拆开，放到数组里
    //map() 是数组方法，用来 遍历数组并返回新数组
    const digits = Array.from(hashResult).map(ch => parseInt(ch, 16)); // 0~15


});