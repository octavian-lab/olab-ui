export default function (value, precision = 2) {
    let ret;
    if (!value) ret = 0;
    else ret = Math.pow(10, -precision) * value;
    return `${ret} %`;
}
