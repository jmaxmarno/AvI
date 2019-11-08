/**
Jadie Adams and Max Marno
*/

d3.json('data/avalanches.json').then( data => {
    this.activeAtrribute = "trigger";
    this.activeTime = {};

    let that = this;

	function getCountData(){
        let countData = []
        for (let year in data) {
            for (let month in data[year]) {
                countData.push({'year': year,'month': month, 'count': data[year][month]['total_count']});
            }
        }
        return countData;
    };

    function updateAttribute(activeAtrribute){
        that.activeAtrribute = activeAtrribute;
        areaChart.setAttribute(activeAtrribute);
    }

    function updateTime(activeTime){
        that.activeTime = activeTime;
        areaChart.setTime(activeTime);
    }

    countData = getCountData();
    const areaChart = new AreaChart(data, countData, this.activeAtrribute, this.activeTime, updateAttribute, updateTime);
		const yearGrid = new yeargrid(countData, updateTime)

});
