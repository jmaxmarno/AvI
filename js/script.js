/**
Jadie Adams and Max Marno
*/

d3.json('data/avalanches.json').then( data => {

	function getCountData(){
        let countData = []
        for (let year in data) {
            for (let month in data[year]) {
                countData.push({'year': year,'month': month, 'count': data[year][month]['total_count']});
            }
        }
        return countData;
    };

    countData = getCountData();
    const areaChart = new AreaChart(data, countData);
    // const yearGrid = new YearGrid(countData);

});

function update(){
	// update area chart ie with areachart.currentselectedattribute

	// update story view, legend, anything else?? 
}
