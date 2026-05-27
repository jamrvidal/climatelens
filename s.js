const sstData = [{"year":1950,"val":18.847788},{"year":1951,"val":18.955421},{"year":1952,"val":18.911663},{"year":1953,"val":18.797586},{"year":1954,"val":18.783888},{"year":1955,"val":18.354391},{"year":1956,"val":18.415876},{"year":1957,"val":18.270643},{"year":1958,"val":18.844719},{"year":1959,"val":18.138975},{"year":1960,"val":19.025873},{"year":1961,"val":18.26248},{"year":1962,"val":18.982752},{"year":1963,"val":18.336794},{"year":1964,"val":18.133081},{"year":1965,"val":17.991058},{"year":1966,"val":18.570555},{"year":1967,"val":17.738407},{"year":1968,"val":18.395079},{"year":1969,"val":18.200417},{"year":1970,"val":18.067045},{"year":1971,"val":18.828825},{"year":1972,"val":18.723267},{"year":1973,"val":18.692635},{"year":1974,"val":18.499609},{"year":1975,"val":18.915903},{"year":1976,"val":18.428335},{"year":1977,"val":18.136103},{"year":1978,"val":19.253567},{"year":1979,"val":18.556625},{"year":1980,"val":18.631596},{"year":1981,"val":18.473883},{"year":1982,"val":17.918966},{"year":1983,"val":18.170456},{"year":1984,"val":18.45537},{"year":1985,"val":19.035368},{"year":1986,"val":18.962555},{"year":1987,"val":18.964952},{"year":1988,"val":17.967646},{"year":1989,"val":18.49156},{"year":1990,"val":18.749702},{"year":1991,"val":18.34363},{"year":1992,"val":17.705574},{"year":1993,"val":17.726017},{"year":1994,"val":18.80072},{"year":1995,"val":18.560776},{"year":1996,"val":18.648369},{"year":1997,"val":19.751425},{"year":1998,"val":18.679195},{"year":1999,"val":18.656536},{"year":2000,"val":18.990366},{"year":2001,"val":19.085474},{"year":2002,"val":18.703676},{"year":2003,"val":19.127237},{"year":2004,"val":19.653294},{"year":2005,"val":19.419685},{"year":2006,"val":19.274931},{"year":2007,"val":18.837313},{"year":2008,"val":19.20241},{"year":2009,"val":18.93244},{"year":2010,"val":18.427925},{"year":2011,"val":19.206192},{"year":2012,"val":18.91688},{"year":2013,"val":18.973394},{"year":2014,"val":19.437723}];
const slhData = [{"year":1950,"val":0.175331},{"year":1951,"val":0.176746},{"year":1952,"val":0.179152},{"year":1953,"val":0.162771},{"year":1954,"val":0.165186},{"year":1955,"val":0.151643},{"year":1956,"val":0.163673},{"year":1957,"val":0.164551},{"year":1958,"val":0.165047},{"year":1959,"val":0.162105},{"year":1960,"val":0.192434},{"year":1961,"val":0.161946},{"year":1962,"val":0.172243},{"year":1963,"val":0.16915},{"year":1964,"val":0.17509},{"year":1965,"val":0.151453},{"year":1966,"val":0.179205},{"year":1967,"val":0.159309},{"year":1968,"val":0.168275},{"year":1969,"val":0.179525},{"year":1970,"val":0.187908},{"year":1971,"val":0.164632},{"year":1972,"val":0.179788},{"year":1973,"val":0.169347},{"year":1974,"val":0.185801},{"year":1975,"val":0.198483},{"year":1976,"val":0.186294},{"year":1977,"val":0.15979},{"year":1978,"val":0.186574},{"year":1979,"val":0.191077},{"year":1980,"val":0.160828},{"year":1981,"val":0.152484},{"year":1982,"val":0.16478},{"year":1983,"val":0.153014},{"year":1984,"val":0.155427},{"year":1985,"val":0.159615},{"year":1986,"val":0.170908},{"year":1987,"val":0.169747},{"year":1988,"val":0.143189},{"year":1989,"val":0.162776},{"year":1990,"val":0.162232},{"year":1991,"val":0.167535},{"year":1992,"val":0.167655},{"year":1993,"val":0.145281},{"year":1994,"val":0.170093},{"year":1995,"val":0.160766},{"year":1996,"val":0.156362},{"year":1997,"val":0.169275},{"year":1998,"val":0.153876},{"year":1999,"val":0.145222},{"year":2000,"val":0.173107},{"year":2001,"val":0.147102},{"year":2002,"val":0.143168},{"year":2003,"val":0.165588},{"year":2004,"val":0.173648},{"year":2005,"val":0.163664},{"year":2006,"val":0.157969},{"year":2007,"val":0.173517},{"year":2008,"val":0.148391},{"year":2009,"val":0.136215},{"year":2010,"val":0.152612},{"year":2011,"val":0.168473},{"year":2012,"val":0.145272},{"year":2013,"val":0.151176},{"year":2014,"val":0.159727}];
const precData = [{"year":1950,"val":10.517476},{"year":1951,"val":22.533314},{"year":1952,"val":29.61352},{"year":1953,"val":25.530426},{"year":1954,"val":17.711868},{"year":1955,"val":14.568308},{"year":1956,"val":17.862043},{"year":1957,"val":32.397747},{"year":1958,"val":27.569826},{"year":1959,"val":17.107075},{"year":1960,"val":53.721924},{"year":1961,"val":17.882051},{"year":1962,"val":34.88263},{"year":1963,"val":21.42847},{"year":1964,"val":25.075737},{"year":1965,"val":20.825426},{"year":1966,"val":19.09234},{"year":1967,"val":35.935642},{"year":1968,"val":17.177631},{"year":1969,"val":31.371763},{"year":1970,"val":25.745665},{"year":1971,"val":41.23936},{"year":1972,"val":11.860513},{"year":1973,"val":25.995232},{"year":1974,"val":39.53982},{"year":1975,"val":22.32207},{"year":1976,"val":34.736317},{"year":1977,"val":18.154613},{"year":1978,"val":28.627535},{"year":1979,"val":16.424133},{"year":1980,"val":23.856125},{"year":1981,"val":13.422541},{"year":1982,"val":28.46263},{"year":1983,"val":8.822854},{"year":1984,"val":26.684551},{"year":1985,"val":20.851217},{"year":1986,"val":15.051625},{"year":1987,"val":39.510345},{"year":1988,"val":18.458532},{"year":1989,"val":25.451447},{"year":1990,"val":31.221346},{"year":1991,"val":38.942192},{"year":1992,"val":22.941633},{"year":1993,"val":32.15495},{"year":1994,"val":37.39265},{"year":1995,"val":39.74014},{"year":1996,"val":17.62959},{"year":1997,"val":24.444412},{"year":1998,"val":26.670668},{"year":1999,"val":16.304955},{"year":2000,"val":27.638268},{"year":2001,"val":19.928637},{"year":2002,"val":18.1967},{"year":2003,"val":22.7084},{"year":2004,"val":42.851234},{"year":2005,"val":23.997492},{"year":2006,"val":30.917273},{"year":2007,"val":35.764683},{"year":2008,"val":19.752129},{"year":2009,"val":10.984967},{"year":2010,"val":24.685053},{"year":2011,"val":34.61365},{"year":2012,"val":27.787498},{"year":2013,"val":19.172424},{"year":2014,"val":22.552126}];
const years = sstData.map(d => d.year);
const sstVals = sstData.map(d => d.val);
const slhVals = slhData.map(d => d.val);
const precVals = precData.map(d => d.val);
const sstMean = d3.mean(sstVals), slhMean = d3.mean(slhVals), precMean = d3.mean(precVals);

function pct(v, arr) { return ((v - d3.min(arr)) / (d3.max(arr) - d3.min(arr)) * 100).toFixed(1); }
function norm(v, arr) { return (v - d3.min(arr)) / (d3.max(arr) - d3.min(arr)); }
function deltaClass(diff, threshold) { return diff > threshold ? 'up' : diff < -threshold ? 'down' : 'same'; }
function deltaText(diff, decimals, unit) { return (diff >= 0 ? '▲ +' : '▼ ') + Math.abs(diff).toFixed(decimals) + ' ' + unit + ' vs average'; }

const hm = { top:16, right:18, bottom:34, left:46 };
const hW = 860 - hm.left - hm.right;
const hH = 220 - hm.top - hm.bottom;
const hSvg = d3.select('#histSvg').append('g').attr('transform', `translate(${hm.left},${hm.top})`);
const xH = d3.scaleLinear().domain(d3.extent(years)).range([0, hW]);
const yH = d3.scaleLinear().domain([0, 1]).range([hH, 0]);

hSvg.append('g').attr('transform', `translate(0,${hH})`)
  .call(d3.axisBottom(xH).ticks(12).tickFormat(d3.format('d')))
  .call(g => g.select('.domain').attr('stroke','#ddd'))
  .call(g => g.selectAll('line').remove())
  .call(g => g.selectAll('text').attr('fill','#bbb').style('font-size','10px'));

hSvg.append('g')
  .call(d3.axisLeft(yH).ticks(5).tickFormat(d => Math.round(d * 100) + '%'))
  .call(g => g.select('.domain').remove())
  .call(g => g.selectAll('line').attr('stroke','#f0f0f0').attr('x2',hW))
  .call(g => g.selectAll('text').attr('fill','#bbb').style('font-size','10px'));

const lineGen = d3.line().x((d, i) => xH(years[i])).y(d => yH(d)).curve(d3.curveBasis);
const sstNorm = sstVals.map(v => norm(v, sstVals));
const slhNorm = slhVals.map(v => norm(v, slhVals));
const prNorm = precVals.map(v => norm(v, precVals));

hSvg.append('path').datum(sstNorm).attr('fill','none').attr('stroke','#1a5276').attr('stroke-width',2).attr('d',lineGen);
hSvg.append('path').datum(slhNorm).attr('fill','none').attr('stroke','#1a8cad').attr('stroke-width',1.6).attr('opacity',0.85).attr('d',lineGen);
hSvg.append('path').datum(prNorm).attr('fill','none').attr('stroke','#2e7d32').attr('stroke-width',1.6).attr('opacity',0.85).attr('d',lineGen);
hSvg.append('line').attr('x1',0).attr('x2',hW).attr('y1',yH(0.5)).attr('y2',yH(0.5)).attr('stroke','#ccc').attr('stroke-dasharray','4,3');

const selLine = hSvg.append('line').attr('y1',0).attr('y2',hH).attr('stroke','#333').attr('stroke-width',1.5).attr('stroke-dasharray','3,2');
const dots = {
  sst: hSvg.append('circle').attr('r',5).attr('fill','#fff').attr('stroke','#1a5276').attr('stroke-width',2),
  slh: hSvg.append('circle').attr('r',4).attr('fill','#fff').attr('stroke','#1a8cad').attr('stroke-width',2),
  pr: hSvg.append('circle').attr('r',4).attr('fill','#fff').attr('stroke','#2e7d32').attr('stroke-width',2)
};
const selLabel = hSvg.append('text').attr('text-anchor','middle').attr('fill','#444').style('font-size','10px').style('font-weight','600');

function update(yr) {
  const i = years.indexOf(yr);
  if (i === -1) return;
  const sst = sstVals[i], slh = slhVals[i], prec = precVals[i];
  document.getElementById('yearDisplay').textContent = yr;

  const sstDiff = sst - sstMean;
  document.getElementById('gSst').innerHTML = sst.toFixed(1) + '<span class="gauge-unit">°C</span>';
  const dSst = document.getElementById('dSst');
  dSst.textContent = deltaText(sstDiff, 1, '°C');
  dSst.className = 'gauge-delta ' + deltaClass(sstDiff, 0.15);
  document.getElementById('bSst').style.cssText = `width:${pct(sst, sstVals)}%;background:#1a5276;`;

  const slhDiff = slh - slhMean;
  document.getElementById('gSlh').innerHTML = slh.toFixed(3) + '<span class="gauge-unit">m</span>';
  const dSlh = document.getElementById('dSlh');
  dSlh.textContent = deltaText(slhDiff, 3, 'm');
  dSlh.className = 'gauge-delta ' + deltaClass(slhDiff, 0.005);
  document.getElementById('bSlh').style.cssText = `width:${pct(slh, slhVals)}%;background:#1a8cad;`;

  const prDiff = prec - precMean;
  document.getElementById('gPr').innerHTML = Math.round(prec) + '<span class="gauge-unit">mm/mo</span>';
  const dPr = document.getElementById('dPr');
  dPr.textContent = (prDiff >= 0 ? '▲ +' : '▼ ') + Math.abs(Math.round(prDiff)) + ' mm vs average';
  dPr.className = 'gauge-delta ' + deltaClass(prDiff, 1.5);
  document.getElementById('bPr').style.cssText = `width:${pct(prec, precVals)}%;background:#2e7d32;`;

  const cx = xH(yr);
  selLine.attr('x1', cx).attr('x2', cx);
  dots.sst.attr('cx', cx).attr('cy', yH(sstNorm[i]));
  dots.slh.attr('cx', cx).attr('cy', yH(slhNorm[i]));
  dots.pr.attr('cx', cx).attr('cy', yH(prNorm[i]));
  selLabel.attr('x', cx).attr('y', Math.min(yH(sstNorm[i]), yH(slhNorm[i]), yH(prNorm[i])) - 10).text(yr);
}

document.getElementById('yearSlider').addEventListener('input', e => update(+e.target.value));
update(1997);
