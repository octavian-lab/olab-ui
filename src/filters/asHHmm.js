export default function (minutes) {
    let diff = minutes;
    if (diff < 0) 
      return "0:00";

    const h = parseInt(minutes / 60);
    const m = parseInt(minutes % 60) + "";
    return h + ":" + (m.length == 1 ? "0" + m : m);
}