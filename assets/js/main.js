

console.log(123); // 必须是函数
document.getElementById("myForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // 阻止表单默认提交（不刷新页面）

    console.log(123);
    const domain = document.getElementById("domain").value;
    const code = document.getElementById("code").value;

    //校验。检验domain和code是否为空，以及类型是否为字符串
    if (!domain || !code || typeof domain !== "string" || typeof code !== "string") {
        alert("请填写完整信息");
        return;
    }



    //结果是十六进制字符串（hex)
    //在十六进制（hex）表示里：每个字节 → 2 个 hex 字符
    //默认情况下，hash 长度是 32 字节（256 bit）
    const hashResult = sha256(domain + code);



    //将 hash 转成数字数组
    //ch 是 hash 的每个字符。parseInt(ch, 16) 表示：把字符 ch 当作十六进制数字转换成十进制整数
    //Array.from() 的作用：把可迭代对象（Iterable）转换成数组。对字符串来说，就是把每个字符拆开，放到数组里
    //map() 是数组方法，用来 遍历数组并返回新数组
    const digits = Array.from(hashResult).map(ch => parseInt(ch, 16)); //最终，会生成一个16个十进制数字的数组
    //split("") 是字符串方法，用来把字符串拆分成数组
    const lowerPool = "abcdefghijklmnopqrstuvwxyz".split("");
    const upperPool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const digitPool = "0123456789".split("");
    const symbolPool = "!@#$%^&*()-_=+".split("");
    //构建4x4矩阵.4*4已经足够
    const rows = 4;
    const cols = 4;
    const lowerMatrix = buildMatrix(digits, lowerPool, rows, cols, 0);
    const upperMatrix = buildMatrix(digits, upperPool, rows, cols, 16);
    const digitMatrix = buildMatrix(digits, digitPool, rows, cols, 32);
    const symbolMatrix = buildMatrix(digits, symbolPool, rows, cols, 48);
    //从每个矩阵中取出一个字符，组成最终密码
    //目前主流的密码都要求12位，要求有数字、大小写字母、特殊字符.
    //也就是默认情况下，一共取三轮，每轮取4个字符
    let password = "";
    const rounds = 3;
    password = generateFromMatrix(digits, lowerMatrix, upperMatrix, digitMatrix, symbolMatrix, rounds);

    //显示结果
    document.getElementById("result").textContent = password;


});

//构建数字，大小写字母，符号的矩阵
function buildMatrix(digits, pool, rows, cols, offset = 0) {
    const matrix = [];
    //offset用来控制从digits的哪个位置开始取值,增加的是“结构独立性”和“信息扩散”
    let k = offset;
    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
            //pool就是预设的字符集
            const value = digits[k % digits.length];
            row.push(pool[value % pool.length]);
            k++;
        }
        matrix.push(row);
    }

    return matrix;
}

function generateFromMatrix(digits, l, u, d, s, rounds) {
    let password = "";

    for (let round = 0; round < rounds; round++) {
        //每轮从四个矩阵中各取一个字符
        //这里具体取哪个矩阵中哪个数，算法简单些
        const row = digits[round] % 4
        const col = digits[round + 1] % 4
        const lowerChar = l[row][col];
        const upperChar = u[row][col];
        const digitChar = d[row][col];
        const symbolChar = s[row][col];
        //打乱顺序
        let chars = [lowerChar, upperChar, digitChar, symbolChar];
        const swapIdx = digits[round + 2] % 6;
        //交换第0个和swapIdx位置的元素
        [chars[0], chars[swapIdx % 4]] = [chars[swapIdx % 4], chars[0]];
        //join()把数组元素拼接成一个字符串。
        password += chars.join("");
    }
    return password;
}
