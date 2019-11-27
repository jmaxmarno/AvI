/**
Jadie Adams and Max Marno
*/

d3.json('data/avalanches.json').then( data => {
    this.activeAtrribute = "trigger";
    this.activeTime = [];
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
    function showsummer(truefalse){
      yearGrid.updatesummer(truefalse)
    }
    function updateAttribute(activeAtrribute){
        that.activeAtrribute = activeAtrribute;
        areaChart.setAttribute(activeAtrribute);
        spider.update(activeAtrribute, activeTime);
        storyy.update(activeAtrribute, activeTime);
    }
    function updateTime(activeTime){
        console.log(activeTime)
        that.activeTime = activeTime;
        areaChart.setTime(activeTime);
        spider.update(activeAtrribute, activeTime);
        storyy.update(activeAtrribute, activeTime);
    }
    // instantiate views
    countData = getCountData();
    const yearGrid = new yeargrid(countData, updateTime);
    const areaChart = new AreaChart(data, countData, this.activeAtrribute, this.activeTime, updateAttribute, catColoring, showsummer);
    const spider = new spiderchart(data, that.activeAtrribute, catColoring);
    const storyy = new story(data, that.activeAtrribute, updateTime);

    // Demo 'guided' select:
    yearGrid.selectgrid([{year:'2013', months:[1,2,4]}, {year:'2018', months:[10, 11, 12]}]);

});
/**
 * coloring returns the color for the given value
 * @param activecat - the current/active category
 * @param value - the value you would like to color
 */
function catColoring(activecat, value){
  // aspect
  if(activecat==='aspect'){
    let aspects = ['Northwest', 'North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West']
    let aspectcolor = d3.scaleLinear()
        .domain([0, 1, 2, 3, 4])
        .range(['#eb4444', '#2f7ef5', 'lightgreen', 'yellow', '#eb4444'])
        .interpolate(d3.interpolateRgb.gamma(2.2))

    let aspectnumeric = d3.scaleOrdinal()
    .domain(['Northwest', 'North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West'])
    .range([.5, 1, 1.5, 2, 2.5, 3, 3.5, 4])

    if(aspects.includes(value)){
      return aspectcolor(aspectnumeric(value))
    }else {
      return 'grey'
    }
    // elevation
  }else if(activecat==='elevation') {
    let elevs = ["Below 8,000ft", "8,000ft - 9,500ft", "Above 9,500ft"]
    let elevationcolor = d3.scaleOrdinal()
        .domain(elevs)
        .range(['green', 'tan', 'brown'])
    if(elevs.includes(value)){
      return elevationcolor(value);
    }else {
      return 'grey'
    }
    // trigger
  } else if (activecat==='trigger') {
    let triggers = ["Natural", "Explosive","Skier","Snowboarder","Snowmobiler","Snowshoer","Hiker","Snow Bike"]
    let triggercolor = d3.scaleOrdinal()
        .domain(triggers)
        .range(['green', 'orange', 'DodgerBlue', 'blue', 'lightblue', '#05fa6f','#05fabd', '#d1fa05'])
    if(triggers.includes(value)){
      return triggercolor(value);
    }else {
      return 'grey'
    }
    // sizes
  }else if (activecat==='width') {
    let sizes = ['Under 100 ft.', "100 - 200 ft.", "Over 200 ft."];
    let sizecolor = d3.scaleOrdinal()
    .domain(sizes)
    .range(['#cbc9e2', '#9e9ac8', '#6a51a3'])
    if (sizes.includes(value)){
      return sizecolor(value)
    }else{
      return 'grey'
    }
  }else{
    return 'grey'
  }
}
