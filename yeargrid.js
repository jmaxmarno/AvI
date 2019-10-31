
const months = ['August', 'September', 'October', 'November', 'December', 'January', 'February', 'March', 'April', 'May', 'June', 'July']
function range(start, end){
  if(start === end) return [start];
  return [start, ...range(start+1, end)];
}

const years = range(2009, 2019)

const margin = {top:40, bottom:40, left:40, right:40};
const width = 600 - margin.left - margin.right
const height = 600 - margin.top - margin.bottom

class yeargrid {
  constructor(data, xax, yax){
    this.data = data;
    this.xdata = xax
    this.ydata = yax

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


  }
}

let yg = new yeargrid('data', months, years)
