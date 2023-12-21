function rgbaToHex(r, g, b, a) {
  r = r.toString(16);
  g = g.toString(16);
  b = b.toString(16);
  a = Math.round(a * 255).toString(16);

  if (r.length == 1) r = '0' + r;
  if (g.length == 1) g = '0' + g;
  if (b.length == 1) b = '0' + b;
  if (a.length == 1) a = '0' + a;
  if (a === '00' || a === 'ff') {
    return '#' + r + g + b;
  }

  return '#' + r + g + b + a;
}

export default rgbaToHex;
