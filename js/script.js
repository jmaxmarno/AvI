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

		const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL','AUG', 'SEP', 'OCT', 'NOV', 'DEC']
		function range(start, end){
		  if(start === end) return [start];
		  return [start, ...range(start+1, end)];
		}
		const years = range(2009, 2019)
		// const yearmonthvals = []
		// for(let y=0; y<years.length; y++)
		//     for(let m=0; m<months.length; m++)
		//         yearmonthvals.push({year: years[y], month: months[m], randval: Math.random()*100})

    countData = getCountData();
    const areaChart = new AreaChart(data, countData, this.activeAtrribute, this.activeTime, updateAttribute, updateTime);
		let yearmonthdata = countData.map(function(d){
			let nmonth = months[+d.month-1]
			d.nmonth = nmonth
			return d
		})
		console.log(yearmonthdata)
		const yearGrid = new yeargrid(yearmonthdata, months, years, updateTime)

});
