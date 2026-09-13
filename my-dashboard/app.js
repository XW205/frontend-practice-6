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

const loadData = async () => {
  try {
    const response = await fetch('data/weather.json');
    if (!response.ok) throw new Error('HTTP错误：' + response.status);
    const data = await response.json();
    $('#sub-title').text(`${data.title} ｜ 数据来源：昆明市气象局2025年气候通报`);
    renderCards(data);
  } catch (error) {
    console.error('加载失败：', error.message);
  }
};

$(document).ready(() => {
  loadData();
});