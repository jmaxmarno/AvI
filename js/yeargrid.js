
// Year/month grid class
class yeargrid {
  constructor(data, updateTime){
    this.normmonths = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL','AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    this.years = range(2009, 2019)
    this.data = data
    this.updateTime = updateTime

    this.drawgrid()

    function range(start, end){
      if(start === end) return [start];
      return [start, ...range(start+1, end)];
    }
  }

  drawgrid(){
    let that=this
    let yearmonthdata = that.data.map(function(d){
      // use month labels
      let nmonth = that.normmonths[+d.month-1]
      d.nmonth = nmonth
      return d
    })

    const margin = {top:40, bottom:40, left:60, right:40};
    const width = 700 - margin.left - margin.right
    const height = 400 - margin.top - margin.bottom

    const ygdiv = d3.select("#yeargrid")
    // console.log('ygdiv', ygdiv)
    let grid_g = ygdiv.append("svg")
    .attr('id', 'gridsvg')
    .attr('width', width+margin.left+margin.right)
    .attr('height', height+margin.top+margin.bottom)
    .append('g')
    .attr('transform', "translate(" + margin.left + "," + margin.top + ")");

  const maxcount = Math.max(...that.data.map(d=>+d.count))

  const gcolor = d3.scaleLinear()
  .range(["black", "white"])
  .domain([1,maxcount])

  // Reorder months
  let reMonths = ['AUG', 'SEP', 'OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL']
  const xscale = d3.scaleBand()
  .range([0, width])
  .domain(reMonths)
  .padding(0.01)
  const xaxgroup = grid_g.append("g")
  .attr('transform', 'translate(' + 0 + ',' + 0 + ')')
  .call(d3.axisTop(xscale))
  .selectAll('text')
  .classed('monthlabel', true)
    .style('text-anchor', 'end')
    .attr('dx', '2.5em')
    .attr('dy', '.5em')
    .attr('transform', 'rotate(-65)');

// TODO: make year labels show both years the row represents, not just the start
  const yscale = d3.scaleBand()
  .range([0, height])
  .domain(that.years)
  .padding(0.01)
  const yaxgroup = grid_g.append("g")
  .attr('transform', 'translate(' + 0 + ',' + 0 + ')')
  .call(d3.axisLeft(yscale))

  let gridrects = grid_g.selectAll('rect')
  .data(that.data)
  .enter().append('rect')
  .attr('x', d=>xscale(d.nmonth))
  .attr('y', function(d){
    // offset the month so that the row is a continuous stretch of time August-July
    // // TODO: change so that uses the month index of the first month in the reordered months
    return (d.month <8?yscale(d.year-1):yscale(d.year))
  })

  .attr('width', xscale.bandwidth())
  .attr('height', yscale.bandwidth())
  .style('fill', d=>gcolor(d.count))

  gridrects.append('svg:title').text('TEST')

  function withinbrush(brushcoords, xx, yy){
    let x0 = brushcoords[0][0];
    let x1 = brushcoords[1][0];
    let y0 = brushcoords[0][1];
    let y1 = brushcoords[1][1];
    return x0 <= xx && xx<= x1 && y0<=yy && yy <= y1;
  }
  function endbrush(){

    console.log('brush ended')
    if (d3.event.selection == null) {
      gridrects.classed('brushed', false)
    }
    let brushedrects = grid_g.selectAll('.brushed').data()
// TODO: This is NOT clean...:
    let years = []
    for (var key in brushedrects){
      // console.log(brushedrects[key]['year'])
      if (years.includes(brushedrects[key]['year'])){
      }else{
        years.push(brushedrects[key]['year'])
      }
    }
    let datedata = years.map(function(y){
      let monthss = brushedrects.filter(function(d){
        return d.year == y
      }).map(m=>m.nmonth)
      // get the index of the months from the months array defined initially
      return {year: y, months: monthss.map(mm=>that.normmonths.indexOf(mm)+1)}
    })
    // TODO: trigger update time
    console.log('brushed months', datedata)
    that.updateTime(brushedrects)
    return brushedrects

  }
  function highlightBrushed() {

    gridrects.classed('brushed', false);
      if (d3.event.selection != null) {
          // revert circles to initial style
          gridrects.classed('brushed', false);
          var brush_coords = d3.brushSelection(this);

          // style brushed circles
          gridrects.filter(function (){
            // TODO: update brush to snap 'out' to selected rects
                     let xx = +d3.select(this).attr("x")+(xscale.bandwidth()*0.5);
                     let yy = +d3.select(this).attr("y")+(yscale.bandwidth()*0.5);
                     return withinbrush(brush_coords, xx, yy);
                 })
                 .classed("brushed", true);
                  }
  }
  let brush  = d3.brush()
  .on('brush', highlightBrushed)
  .on('end', endbrush)

  grid_g.append("g")
  .attr('id', 'brushg')
  .attr('width', width)
  .attr('height', height)
     .call(brush);
  }
}
