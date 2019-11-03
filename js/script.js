/**
Jadie Adams and Max Marno
*/

d3.json('data/avalanches.json').then( data => {
    const areaChart = new AreaChart(data);

});
