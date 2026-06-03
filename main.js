/* ═══════════════════════════════════════════════════════════════════════
   STATE
═══════════════════════════════════════════════════════════════════════ */
let mode = 'hot', di = 0;
let gridData = null;   // loaded from ca_grid_data.json
let proj = null;
 
const YEARS = d3.range(1950, 2020);
const SVG_W = 480, SVG_H = 620;
 
/* ═══════════════════════════════════════════════════════════════════════
   COLOR SCALES  — continuous, dark = extreme
═══════════════════════════════════════════════════════════════════════ */
const SCALES = {
  hot: {
    title: 'Max temp (°C)',
    lo: 15,
    hi: 50,
    loLabel: '15°C',
    hiLabel: '50°C',
    fn: v => {
      const t = Math.max(0, Math.min(1, (v - 15) / 35));
      return d3.interpolateYlOrRd(t);
    }
  },

  cold: {
    title: 'Min temp (°C)',
    lo: -10,
    hi: 15,
    loLabel: '-10°C',
    hiLabel: '15°C',
    fn: v => {
      const t = Math.max(0, Math.min(1, (v + 10) / 25));
      return d3.interpolateBlues(1 - t);
    }
  },

  range: {
    title: 'Temp range °C (hot−cold)',
    lo: 0,
    hi: 30,
    loLabel: '0°C',
    hiLabel: '30°C',
    fn: v => {
      const t = Math.max(0, Math.min(1, (v - 0) / 30));
      return d3.interpolatePuRd(t);
    }
  }
};
 
/* ═══════════════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════════════ */
function getVal(cell, m, i) {
  if (m === 'hot')  return cell.hot[i];
  if (m === 'cold') return cell.cold[i];
  return (cell.hot[i] !== null && cell.cold[i] !== null)
    ? parseFloat((cell.hot[i] - cell.cold[i]).toFixed(1))
    : null;
}
 
function colorOf(v, m) {
  if (v === null) return '#ccc';
  return SCALES[m].fn(v);
}
 
/* ═══════════════════════════════════════════════════════════════════════
   LEGEND BAR  (drawn on a canvas)
═══════════════════════════════════════════════════════════════════════ */
function drawLegend(m) {
  const cfg = SCALES[m];
  document.getElementById('leg-title').textContent = cfg.title;
  document.getElementById('leg-lo').textContent    = cfg.loLabel;
  document.getElementById('leg-hi').textContent    = cfg.hiLabel;
 
  const canvas = document.getElementById('legend-bar');
  const ctx    = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
 
  for (let x = 0; x < W; x++) {
    const v = cfg.lo + (x / W) * (cfg.hi - cfg.lo);
    ctx.fillStyle = cfg.fn(v);
    ctx.fillRect(x, 0, 1, H);
  }
}
 
/* ═══════════════════════════════════════════════════════════════════════
   RENDER  — update all cell fill colors
═══════════════════════════════════════════════════════════════════════ */
function render() {
  if (!gridData) return;
 
  d3.selectAll('.grid-cell')
    .transition().duration(300)
    .attr('fill', function() {
      const cell = d3.select(this).datum();
      return colorOf(getVal(cell, mode, di), mode);
    });
 
  drawLegend(mode);
}
 
/* ═══════════════════════════════════════════════════════════════════════
   COMPUTE CELL PIXEL SIZE from projection
   CMIP6 CESM2 grid spacing is ~0.9° lat × ~1.25° lon
═══════════════════════════════════════════════════════════════════════ */
function cellPixelSize(proj) {
  const DLAT = 0.94, DLON = 1.25;  // approx CESM2 grid spacing
  const [x0, y0] = proj([-117, 36]);
  const [x1, y1] = proj([-117 + DLON, 36 + DLAT]);
  return { w: Math.abs(x1 - x0) + 1, h: Math.abs(y0 - y1) + 1 };
}
 
/* ═══════════════════════════════════════════════════════════════════════
   BUILD MAP  — called once after both topology + grid data are loaded
═══════════════════════════════════════════════════════════════════════ */
function buildMap(caFeature) {
  proj = d3.geoMercator().fitSize([SVG_W, SVG_H], caFeature);
  const pathGen = d3.geoPath(proj);
  const { w: cellW, h: cellH } = cellPixelSize(proj);
 
  const svg = d3.select('#ca-svg');
  svg.selectAll('*').remove();
 
  /* Define clip path = California outline so cells outside are hidden */
  const defs = svg.append('defs');
  defs.append('clipPath')
      .attr('id', 'ca-clip')
    .append('path')
      .attr('d', pathGen(caFeature));
 
  /* Group for grid cells, clipped to CA */
  const cellGroup = svg.append('g').attr('clip-path', 'url(#ca-clip)');
 
  /* Floating label */
  const floatLabel = document.getElementById('float-label');
  const mapWrap    = document.getElementById('map-wrap');
 
  /* Draw one rect per grid cell */
  cellGroup.selectAll('rect.grid-cell')
    .data(gridData.cells)
    .join('rect')
      .attr('class', 'grid-cell')
      .attr('x',      d => { const [px] = proj([d.lon, d.lat]); return px - cellW / 2; })
      .attr('y',      d => { const [, py] = proj([d.lon, d.lat]); return py - cellH / 2; })
      .attr('width',  cellW)
      .attr('height', cellH)
      .attr('fill',   d => colorOf(getVal(d, mode, di), mode))
      /* ── Hover: show float label ── */
      .on('mousemove', function(event, d) {
        const hot   = d.hot[di]  !== null ? d.hot[di].toFixed(1)  + '°C' : 'N/A';
        const cold  = d.cold[di] !== null ? d.cold[di].toFixed(1) + '°C' : 'N/A';
        const range = (d.hot[di] !== null && d.cold[di] !== null)
          ? (d.hot[di] - d.cold[di]).toFixed(1) + '°C' : 'N/A';
 
        floatLabel.innerHTML =
          `<strong style="display:block;margin-bottom:2px;">${Math.abs(d.lat).toFixed(2)}°N, ${Math.abs(d.lon).toFixed(2)}°W</strong>
           <span style="color:#8B0000;">Max high: ${hot}</span><br>
           <span style="color:#003080;">Min low:  ${cold}</span><br>
           <span style="color:#5a0060;">Range:    ${range}</span>`;
 
        /* Current value for active mode (bold) */
        const v = getVal(d, mode, di);
        const vStr = v !== null ? v.toFixed(1) + '°C' : 'N/A';
        floatLabel.innerHTML +=
          `<hr style="margin:4px 0;border:none;border-top:1px solid #eee;">
           <strong>${SCALES[mode].title}: ${vStr}</strong>`;
 
        /* Position relative to map-wrap */
        const rect = mapWrap.getBoundingClientRect();
        let lx = event.clientX - rect.left + 14;
        let ly = event.clientY - rect.top  - 10;
        floatLabel.style.display = 'block';
        /* Keep inside viewport horizontally */
        if (lx + 160 > mapWrap.offsetWidth) lx = event.clientX - rect.left - 164;
        floatLabel.style.left = lx + 'px';
        floatLabel.style.top  = ly + 'px';
 
        /* Sidebar panel */
        document.getElementById('hovered-panel').innerHTML =
          `<div class="hov-title">${YEARS[di]}</div>
           <span style="color:#8B0000;">Max: ${hot}</span><br>
           <span style="color:#003080;">Min: ${cold}</span><br>
           <span style="color:#5a0060;">Range: ${range}</span><br>
           <div style="font-size:10px;color:#999;margin-top:4px;">${Math.abs(d.lat).toFixed(2)}°N ${Math.abs(d.lon).toFixed(2)}°W</div>`;
      })
      .on('mouseleave', function() {
        floatLabel.style.display = 'none';
        document.getElementById('hovered-panel').innerHTML =
          `<div class="hov-title">Hover a cell</div>
           <span style="color:#aaa;font-size:10px;">Move your mouse over<br>the map to see values.</span>`;
      });
 
  /* California outline on top */
  svg.append('path')
    .datum(caFeature)
    .attr('class', 'ca-outline')
    .attr('d', pathGen);
 
  document.getElementById('loading-msg').style.display = 'none';
  document.getElementById('ca-svg').style.display = 'block';
  drawLegend(mode);
}
 
/* ═══════════════════════════════════════════════════════════════════════
   CONTROLS
═══════════════════════════════════════════════════════════════════════ */
function setMode(m) {
  mode = m;
  ['hot', 'cold', 'range'].forEach(x => {
    document.getElementById('btn-' + x).className =
      'ctrl-btn' + (x === m ? ' active-' + m : '');
  });
  render();
}
 
function setYear(v) {
  di = v;
  document.getElementById('dec-lbl').textContent = YEARS[di];
  render();
}
 
/* ═══════════════════════════════════════════════════════════════════════
   BOOTSTRAP  — load topology + grid data in parallel
═══════════════════════════════════════════════════════════════════════ */
Promise.all([
  fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json').then(r => r.json()),
  fetch('ca_grid_data.json').then(r => r.json())
])
.then(([us, grid]) => {
  gridData = grid;
  const states    = topojson.feature(us, us.objects.states);
  const caFeature = states.features.find(f => f.properties.name === 'California');
  buildMap(caFeature);
})
.catch(err => {
  document.getElementById('loading-msg').textContent =
    'Error: ' + err.message +
    ' — Make sure ca_grid_data.json is in the same folder as this HTML file, ' +
    'and open via a local server (e.g. python -m http.server 8000), not by double-clicking.';
  document.getElementById('loading-msg').style.color = '#c00';
});

/* ═══════════════════════════════════════════════════════════════════════ */

// ── constants ────────────────────────────────────────────────
const COLORS = {
    'historical': '#444441',
    'SSP2-4.5':   '#ba7517',
    'SSP5-8.5':   '#a32d2d',
  };
  
  const BTN_ID = {
    'historical': 'btn-hist',
    'SSP2-4.5':   'btn-s245',
    'SSP5-8.5':   'btn-s585',
  };
  
  const BTN_CLASS = {
    'historical': 'on-hist',
    'SSP2-4.5':   'on-s245',
    'SSP5-8.5':   'on-s585',
  };
  
  const scenarios = ['historical', 'SSP2-4.5', 'SSP5-8.5'];
  const visible   = { 'historical': true, 'SSP2-4.5': true, 'SSP5-8.5': true };
  
  // ── dimensions ───────────────────────────────────────────────
  const margin = { top: 20, right: 20, bottom: 45, left: 55 };
  const totalW  = document.getElementById('chart').clientWidth - 32 || 820;
  const totalH  = 420;
  const W = totalW - margin.left - margin.right;
  const H = totalH - margin.top  - margin.bottom;
  
  // ── svg setup ────────────────────────────────────────────────
  const svg = d3.select('#viz')
    .attr('width', totalW)
    .attr('height', totalH)
    .style('overflow', 'visible');
  
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  // ── scales ───────────────────────────────────────────────────
  const xScale = d3.scaleLinear().domain([1850, 2100]).range([0, W]);
  const yScale = d3.scaleLinear().domain([3, 34]).range([H, 0]);
  
  // ── gridlines ────────────────────────────────────────────────
  g.append('g')
    .attr('class', 'gridline')
    .call(d3.axisLeft(yScale).tickSize(-W).tickFormat(''));
  
  // ── axes ─────────────────────────────────────────────────────
  g.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0,${H})`)
    .call(d3.axisBottom(xScale).tickFormat(d3.format('d')).ticks(10));
  
  g.append('g')
    .attr('class', 'axis')
    .call(d3.axisLeft(yScale).ticks(8).tickFormat(d => d + '°C'));
  
  // ── axis labels ──────────────────────────────────────────────
  g.append('text')
    .attr('x', W / 2).attr('y', H + 38)
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px').attr('fill', '#888780')
    .text('Year');
  
  g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -H / 2).attr('y', -42)
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px').attr('fill', '#888780')
    .text('Temperature (°C)');
  
  // ── 2015 projection marker ───────────────────────────────────
  g.append('line')
    .attr('class', 'proj-line')
    .attr('x1', xScale(2015)).attr('x2', xScale(2015))
    .attr('y1', 0).attr('y2', H);
  
  g.append('text')
    .attr('class', 'proj-label')
    .attr('x', xScale(2015) + 4).attr('y', 12)
    .text('projections →');
  
  // ── hover line ────────────────────────────────────────────────
  const hoverLine = g.append('line')
    .attr('stroke', '#b4b2a9')
    .attr('stroke-width', 1)
    .attr('y1', 0).attr('y2', H)
    .attr('opacity', 0)
    .attr('pointer-events', 'none');
  
  // ── data group ────────────────────────────────────────────────
  const gData = g.append('g');
  let grouped  = {};
  
  // ── line / area generators ───────────────────────────────────
  const areaGen = d3.area()
    .x(d => xScale(d.year))
    .y0(d => yScale(d.min))
    .y1(d => yScale(d.max))
    .curve(d3.curveCatmullRom.alpha(0.5));
  
  const lineGen = key => d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d[key]))
    .curve(d3.curveCatmullRom.alpha(0.5));
  
  // ── draw one scenario ─────────────────────────────────────────
  function drawScenario(s, data) {
    const c   = COLORS[s];
    const cls = s.replace(/[\.\-]/g, '_');
  
    gData.append('path')
      .datum(data)
      .attr('class', `band band-${cls}`)
      .attr('fill', c)
      .attr('opacity', 0.12)
      .attr('d', areaGen);
  
    ['min', 'max'].forEach(k => {
      gData.append('path')
        .datum(data)
        .attr('class', `line-ext line-${cls}`)
        .attr('stroke', c)
        .attr('d', lineGen(k));
    });
  
    gData.append('path')
      .datum(data)
      .attr('class', `line-mean line-${cls}`)
      .attr('stroke', c)
      .attr('d', lineGen('mean'));
  }
  
  // ── tooltip ───────────────────────────────────────────────────
  const tooltip = document.getElementById('tooltip');
  const bisect  = d3.bisector(d => d.year).left;
  let hideTimer;
  
  function showTooltip(event, year) {
    document.getElementById('tt-year').textContent = year;
  
    let html = '';
    scenarios.forEach(s => {
      if (!visible[s] || !grouped[s]) return;
      const arr = grouped[s];
      const i   = bisect(arr, year, 1);
      const d   = arr[Math.min(i, arr.length - 1)];
      if (!d) return;
      const c = COLORS[s];
      html += `
        <div class="tt-block" style="border-left:3px solid ${c};">
          <div class="label">${s}</div>
          <div class="tt-row"><span>Max</span><span>${d.max.toFixed(1)}°C</span></div>
          <div class="tt-row"><span>Mean</span><span>${d.mean.toFixed(1)}°C</span></div>
          <div class="tt-row"><span>Min</span><span>${d.min.toFixed(1)}°C</span></div>
        </div>`;
    });
  
    document.getElementById('tt-content').innerHTML = html;
    tooltip.style.opacity = '1';
  
    // keep tooltip on screen
    const ttW  = tooltip.offsetWidth;
    const ttH  = tooltip.offsetHeight;
    let left   = event.clientX + 18;
    let top    = event.clientY - 20;
    if (left + ttW > window.innerWidth  - 10) left = event.clientX - ttW - 18;
    if (top  + ttH > window.innerHeight - 10) top  = window.innerHeight - ttH - 10;
  
    tooltip.style.left = left + 'px';
    tooltip.style.top  = top  + 'px';
  }
  
  function hideTooltip() {
    hideTimer = setTimeout(() => {
      hoverLine.attr('opacity', 0);
      tooltip.style.opacity = '0';
    }, 120);
  }
  
  // ── overlay for mouse events ──────────────────────────────────
  const overlay = g.append('rect')
    .attr('width', W)
    .attr('height', H)
    .attr('fill', 'none')
    .attr('pointer-events', 'all');
  
  overlay.on('mousemove', function(event) {
    clearTimeout(hideTimer);
    const [mx] = d3.pointer(event);
    const year  = Math.round(xScale.invert(mx));
    hoverLine.attr('x1', mx).attr('x2', mx).attr('opacity', 1);
    showTooltip(event, year);
  });
  
  overlay.on('mouseleave', hideTooltip);
  
  // ── toggle button handler ─────────────────────────────────────
  function toggleScenario(s) {
    visible[s]  = !visible[s];
    const cls   = s.replace(/[\.\-]/g, '_');
  
    d3.selectAll(`.band-${cls}`).attr('opacity', visible[s] ? 0.12 : 0);
    d3.selectAll(`.line-${cls}`).attr('opacity', visible[s] ? 1    : 0);
  
    const btn = document.getElementById(BTN_ID[s]);
    if (visible[s]) btn.classList.add(BTN_CLASS[s]);
    else            btn.classList.remove(BTN_CLASS[s]);
  }
  
  // ── load data and draw ────────────────────────────────────────
  d3.csv('sd_extremes.csv', d => ({
    year:     +d.year,
    min:      +d.min,
    mean:     +d.mean,
    max:      +d.max,
    scenario:  d.scenario,
  })).then(data => {
    scenarios.forEach(s => {
      grouped[s] = data
        .filter(d => d.scenario === s)
        .sort((a, b) => a.year - b.year);
      drawScenario(s, grouped[s]);
    });
  
    // raise hover elements above drawn lines
    hoverLine.raise();
    overlay.raise();
  });

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
  
  const coastlineGen = d3.line().x((d, i) => xH(years[i])).y(d => yH(d)).curve(d3.curveBasis);
  const sstNorm = sstVals.map(v => norm(v, sstVals));
  const slhNorm = slhVals.map(v => norm(v, slhVals));
  const prNorm = precVals.map(v => norm(v, precVals));
  
  hSvg.append('path').datum(sstNorm).attr('fill','none').attr('stroke','#1a5276').attr('stroke-width',2).attr('d',coastlineGen);
  hSvg.append('path').datum(slhNorm).attr('fill','none').attr('stroke','#1a8cad').attr('stroke-width',1.6).attr('opacity',0.85).attr('d',coastlineGen);
  hSvg.append('path').datum(prNorm).attr('fill','none').attr('stroke','#2e7d32').attr('stroke-width',1.6).attr('opacity',0.85).attr('d',coastlineGen);
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
  