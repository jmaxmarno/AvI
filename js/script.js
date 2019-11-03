/**
Jadie Adams and Max Marno
*/

d3.json('data/avalanches.json').then( data => {

	function getCountData(){
		data = data[0]
        let countData = []
        for (var year in data) {
            for (var month in data[year]) {
                countData.push({'year': year,'month': month, 'count': data[year][month]['total_count']});      
            } 
        }
        return countData;
    };

    countData = getCountData();
    const areaChart = new AreaChart(data, countData);

});
