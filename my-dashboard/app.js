const state = { data: null };
let barChart = null;
let lineChart = null;

const loadData = async () => {
  $('#status').text('加载中...').show();

  try {
    const response = await fetch('data/weather.json');
    if (!response.ok) throw new Error('HTTP错误：' + response.status);
    const data = await response.json();

    if (!data.series || data.series.length === 0 || data.series[0].counts.length === 0) {
      $('#status').text('暂无数据').show();
      return;
    }

    state.data = data;
    $('#status').hide();
    $('#sub-title').text(`${data.title} ｜ 数据来源：昆明市气象局2025年气候通报`);
    renderCards(data);
    renderBarChart(data);
    renderLineChart(data);

  } catch (error) {
    $('#status').text('加载失败：' + error.message).show();
    console.error('数据加载失败:', error);
  }
};

const renderCards = (data) => {
  const tempData = data.series[0].counts;
  const rainData = data.series[1].counts;
  const avgTemp = (tempData.reduce((a, b) => a + b, 0) / tempData.length).toFixed(1);
  const totalRain = rainData.reduce((a, b) => a + b, 0).toFixed(1);
  const maxRain = Math.max(...rainData);
  const maxRainMonth = data.months[rainData.indexOf(maxRain)];

  const cardsHTML = `
    <div class="col-md-3"><div class="card text-center h-100 p-3"><h3 class="h5">全年平均气温</h3><p class="display-6 text-primary">${avgTemp} <small class="fs-6 text-muted">${data.unit.temperature}</small></p></div></div>
    <div class="col-md-3"><div class="card text-center h-100 p-3"><h3 class="h5">全年总降水量</h3><p class="display-6 text-success">${totalRain} <small class="fs-6 text-muted">${data.unit.precipitation}</small></p></div></div>
    <div class="col-md-3"><div class="card text-center h-100 p-3"><h3 class="h5">降水最多月份</h3><p class="display-6 text-info">${maxRainMonth}</p></div></div>
    <div class="col-md-3"><div class="card text-center h-100 p-3"><h3 class="h5">该月降水量</h3><p class="display-6 text-warning">${maxRain} <small class="fs-6 text-muted">${data.unit.precipitation}</small></p></div></div>
  `;
  $('#cards').html(cardsHTML);
};

const renderBarChart = (data) => {
  const barDom = document.querySelector('#bar-chart');
  if (!barDom) return;
  if (barChart) barChart.dispose();
  barChart = echarts.init(barDom);
  barChart.setOption({
    title: { text: '昆明市2025年各月降水量', subtext: '数据来源：昆明市气象局 ｜ 单位：毫米(mm)', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: data.months },
    yAxis: { type: 'value', name: '降水量 (mm)' },
    series: [{ name: '降水量', type: 'bar', data: data.series[1].counts, itemStyle: { color: '#4facfe' } }]
  });
};

const renderLineChart = (data) => {
  const lineCtx = document.querySelector('#line-chart');
  if (!lineCtx) return;
  if (lineChart) lineChart.destroy();
  lineChart = new Chart(lineCtx, {
    type: 'line',
    data: {
      labels: data.months,
      datasets: [{
        label: '平均气温 (℃)', data: data.series[0].counts,
        borderColor: '#ff6b6b', backgroundColor: 'rgba(255, 107, 107, 0.1)',
        borderWidth: 2, tension: 0.3, fill: true, pointBackgroundColor: '#ff6b6b'
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: '昆明市2025年各月平均气温趋势', font: { size: 16 } },
        subtitle: { display: true, text: '数据来源：昆明市气象局 ｜ 单位：摄氏度(℃)', color: '#666', padding: { bottom: 10 } },
        legend: { position: 'bottom' }
      },
      scales: { y: { beginAtZero: false, title: { display: true, text: '温度 (℃)' } } }
    }
  });
};

window.addEventListener('resize', () => {
  if (barChart) barChart.resize();
});

$('#cards').on('click', '.card', function () {
  $(this).toggleClass('border-primary shadow');
});

$(document).ready(() => {
  loadData();
});