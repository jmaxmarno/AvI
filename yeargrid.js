
const months = ['August', 'September', 'October', 'November', 'December', 'January', 'February', 'March', 'April', 'May', 'June', 'July']
function range(start, end){
  if(start === end) return [start];
  return [start, ...range(start+1, end)];
}
const years = range(2009, 2019)
const yearmonthvals = []
for(let y=0; y<years.length; y++)
    for(let m=0; m<months.length; m++)
        yearmonthvals.push({year: years[y], month: months[m], randval: Math.random()*100})
console.log('yearmnonth', yearmonthvals[3])

const margin = {top:40, bottom:40, left:40, right:40};
const width = 600 - margin.left - margin.right
const height = 600 - margin.top - margin.bottom


// Year/month grid class
class yeargrid {
  constructor(data, xdata, ydata){
    this.data = data;
    this.xdata = xdata
    this.ydata = ydata

    this.drawgrid()
  }


  drawgrid(){
    console.log('drawgrid')
    const ygdiv = d3.select("#yeargriddiv")
    let grid_g = ygdiv.append("svg")
    .attr('id', 'gridsvg')
    .attr('width', width+margin.left+margin.right)
    .attr('height', width+margin.top+margin.bottom)
    .append('g')
    .attr('transform', "translate(" + margin.left + "," + margin.top + ")");

  console.log('grid', grid_g)

  const gcolor = d3.scaleLinear()
  .range(["black", "white"])
  .domain([1,100])

  const xscale = d3.scaleBand()
  .range([0, width])
  .domain(this.xdata)
  .padding(0.01)
  const xaxgroup = grid_g.append("g")
  .attr('transform', 'translate(' + 0 + ',' + 0 + ')')
  .call(d3.axisTop(xscale))

  const yscale = d3.scaleBand()
  .range([0, height])
  .domain(this.ydata)
  .padding(0.01)
  const yaxgroup = grid_g.append("g")
  .attr('transform', 'translate(' + 0 + ',' + 0 + ')')
  .call(d3.axisLeft(yscale))

  let gridrects = grid_g.selectAll('rect')
  .data(yearmonthvals)
  .enter().append('rect')
  .attr('x', d=>xscale(d.month))
  .attr('y', d=>yscale(d.year))
  .attr('width', xscale.bandwidth())
  .attr('height', yscale.bandwidth())
  .style('fill', d=>gcolor(d.randval));

  function isbrushed(brushcoords, xx, yy){
    let x0 = brushcoords[0][0];
    let x1 = brushcoords[1][0];
    let y0 = brushcoords[0][1];
    let y1 = brushcoords[1][1];
    return x0 <= xx && xx<= x1 && y0<=yy && yy <= y1;
  }


  function highlightBrushedCircles() {
    console.log('highlightBrushedCircles')

      if (d3.event.selection != null) {

          // revert circles to initial style
          gridrects.classed('brushed', false);

          var brush_coords = d3.brushSelection(this);

          // style brushed circles
          gridrects.filter(function (){
                     let xx = d3.select(this).attr("x");
                     let yy = d3.select(this).attr("y");
                     return isbrushed(brush_coords, xx, yy);
                 })
                 .attr("class", "brushed");
                  }
              }

    var brush = d3.brush()
                .on("brush", highlightBrushedCircles)
                // .on("end", displayTable);

  grid_g.append("g")
     .call(brush);


  }
}

let yg = new yeargrid('data', months, years)
