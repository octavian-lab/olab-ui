export default function(value, currency="EUR") {
    let precision
    switch (currency) {
        case "EUR":
            precision = 2
        break;
        case "RUB":
            precision = 0
        break;
        default:
            precision = 2    
        break;
    }

    if (value === null)
        return null;
    
    if (value === undefined)
        return null;
    
    let valueDouble = parseFloat(value) * Math.pow(10, precision);
    return parseInt(valueDouble)
}
