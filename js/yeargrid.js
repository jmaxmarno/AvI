
// Year/month grid class
class yeargrid {
  constructor(data, updateTime){
    this.normmonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul','Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    this.years = range(2009, 2019)
    this.data = data
    this.updateTime = updateTime
    this.showSummer = false
    this.margin = {top:40, bottom:0, left:60, right:40};
    this.divDim = d3.select("#yearbox").node().getBoundingClientRect();
    this.width = this.divDim.width - 2*this.margin.left - 2*this.margin.right;
    this.height = this.width *(3/4);
    this.reMonths = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    this.xscale = d3.scaleBand()
    .range([0, this.width])
    .domain(this.reMonths)
    .padding(0.01);
    this.yscale = d3.scaleBand()
    .range([0, this.height])
    .domain(this.years)
    .padding(0.01);
    // Draw it!
    this.drawgrid();


    function range(start, end){
      if(start === end) return [start];
      return [start, ...range(start+1, end)];
    }
  }
  /**
  *Trigger year-month selection programatically
  *@params yearmonthrange - pass as nested [{year:'2010', months:[1,2,3,4]}]
  *
  **/
  selectgrid(daterange){
    let that = this
    let allrects = d3.select("#gridsvg").selectAll('.yeargrid')
    allrects.classed('brushed', false)
    let brushg = d3.select('#brushg').call(that.brush.move, null);
    let selrects = allrects.filter(function(d){
      // console.log('d', d.year);
      if ([...daterange.map(d=>d.year)].includes(d.year)){
        // console.log('dyear', d.year);
        let mmonths = daterange.filter(y=>y.year===d.year)[0].months
        if (mmonths.includes(parseInt(d.month))){
          return d
        }
      }
    })
    selrects.classed('brushed', true)
    this.updateTime(daterange)
  }

  invertscale(scale){
    let domain = scale.domain();
    let pad = scale(domain[0]);
    let bands = scale.step();
    return function(d){
      let i = Math.floor(((d - pad)/ bands));
      return domain[Math.max(0, Math.min(i, domain.length-1))]
    }
  }

  updatesummer(truefalse){
    let that = this
    this.showSummer = truefalse
    let brush = d3.select('#brushg').select('.selection')
    let bcoords = [[parseFloat(brush.attr('x')),parseFloat(brush.attr('y'))]
    ,[parseFloat(brush.attr('x'))+parseFloat(brush.attr('width')), parseFloat(brush.attr('y'))+parseFloat(brush.attr('height'))]]

    let rrects = d3.select("#gridsvg").selectAll('.yeargrid')

    //  reset brushedrects
    rrects.classed('brushed', false)
    rrects.filter(function (){
      // TODO: update brush to snap 'out' to selected rects
      let r = d3.select(this)
       let xx = +r.attr("x")+(that.xscale.bandwidth()*0.5);
       let yy = +r.attr("y")+(that.yscale.bandwidth()*0.5);
       let cc = r.data()[0].count

       if (that.showSummer===true){
         return that.withinbrush(bcoords, xx, yy)
       }else if (that.showSummer === false) {
         return that.withinbrush(bcoords, xx, yy) && cc>0 ;
       }
   }).classed("brushed", true);

    let brushedrects;
    if (this.showSummer==true){
      brushedrects = rrects.selectAll('.brushed').data()
    }else{
      brushedrects = rrects.selectAll('.brushed').filter(function(b){
        // console.log('brushed rect', b, 'bcount', b.count)
        return b.count>0
      }).data()
    }

  }
  withinbrush(brushcoords, xx, yy){
    let x0 = brushcoords[0][0];
    let x1 = brushcoords[1][0];
    let y0 = brushcoords[0][1];
    let y1 = brushcoords[1][1];
    return x0 <= xx && xx<= x1 && y0<=yy && yy <= y1;
  }

  drawgrid(){
    let that=this
    let yearmonthdata = that.data.map(function(d){
      // use month labels
      let nmonth = that.normmonths[+d.month-1]
      d.nmonth = nmonth
      return d
    })

    let grid_g = d3.select("#yeargrid")
    .attr('id', 'gridsvg')
    // .attr('width', that.width+that.margin.left+that.margin.right)
    // .attr('height', that.height+that.margin.top+that.margin.bottom)
    .attr('width', that.width+that.margin.left+that.margin.right)
    .attr('height', that.height+that.margin.top+that.margin.bottom)
    .append('g')
    .attr('transform', "translate(" + that.margin.left + "," + that.margin.top + ")");

  const maxcount = Math.max(...that.data.map(d=>+d.count))

  const gcolor = d3.scaleSqrt()
  .range(["white", "red"])
  .domain([0,maxcount])

  // x axis
  const xaxgroup = grid_g.append("g")
  .attr('transform', 'translate(' + 0 + ',' + 0 + ')')
  .call(d3.axisTop(that.xscale))
  .selectAll('text')
  .classed('monthlabel', true)
    .style('text-anchor', 'end')
    .attr('dx', '2.5em')
    .attr('dy', '.5em')
    .attr('transform', 'rotate(-65)');

    // y axis
  const yaxgroup = grid_g.append("g")
  .attr('transform', 'translate(' + 0 + ',' + 0 + ')')
  .call(d3.axisLeft(that.yscale))
  .selectAll('text')
  .text(function(d){
    let cyear = d.toString().slice(-2)
    let nyear = (parseFloat(d.toString().slice(-2))+1).toString()
    return cyear+"/"+nyear
  })
  .style('font-size', '14px')

  // add rectangles for grid
  let gridrects = grid_g.selectAll('rect')
  .data(that.data)
  .enter().append('rect')
  .attr('x', d=>that.xscale(d.nmonth))
  .attr('y', function(d){
    // offset the month so that the row is a continuous stretch of time August-July
    // // TODO: change so that uses the month index of the first month in the reordered months
    return (d.month <8?that.yscale(d.year-1):that.yscale(d.year))
  })
  .attr('width', that.xscale.bandwidth())
  .attr('height', that.yscale.bandwidth())
  .style('fill', d=>gcolor(d.count))
  .attr('class', 'yeargrid')

  // send brushed selection to updateTime on end
  function endbrush(){
    // console.log('brush ended')
    if (d3.event.selection == null) {
      gridrects.classed('brushed', false)
    }
    // summer months, or not
    let brushedrects;
    if (this.showSummer==true){
      brushedrects = grid_g.selectAll('.brushed').data()
    }else{
      brushedrects = grid_g.selectAll('.brushed').filter(function(b){
        // console.log('brushed rect', b, 'bcount', b.count)
        return b.count>0
      }).data()
    }
  // parse unique year/month combos
    let years = []
    for (let key in brushedrects){
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
    that.updateTime(datedata)
    // console.log('date data', datedata);
    return brushedrects
  }

  // highlight rects on brush
  function highlightBrushed() {
    gridrects.classed('brushed', false);
      if (d3.event.selection != null) {
        if(d3.event.sourceEvent.type === 'brush') return;
          // revert circles to initial style
          gridrects.classed('brushed', false);
          var brush_coords = d3.brushSelection(this);

          const b1 = d3.event.selection
          let x0 = b1[0][0];
          let x1 = b1[1][0];
          let y0 = b1[0][1];
          let y1 = b1[1][1];
          let xx = [x0, x1].map(that.invertscale(that.xscale))
          let yy = [y0, y1].map(that.invertscale(that.yscale))

          let yyr = yy.map(that.yscale)
          let xxr = xx.map(that.xscale)
          // if (xxr[0] >= xxr[1]){
          //   xxr[0] = that.xscale.round(x0)
          //   xxr[1] = that.xscale.step(xxr[0])
          // }

          d3.select(this).call(brush.move, [[xxr[0], yyr[0]], [xxr[1], yyr[1]]])

          // style brushed rects
          gridrects.filter(function (){
            // TODO: update brush to snap 'out' to selected rects
            let r = d3.select(this)
             let xx = +r.attr("x")+(that.xscale.bandwidth());
             let yy = +r.attr("y")+(that.yscale.bandwidth());
             // let xx = +r.attr("x")+(that.xscale.bandwidth()*0.5);
             // let yy = +r.attr("y")+(that.yscale.bandwidth()*0.5);
             let cc = r.data()[0].count

             if (that.showSummer===true){
               return that.withinbrush(brush_coords, xx, yy)
             }else if (that.showSummer === false) {
               return that.withinbrush(brush_coords, xx, yy) && cc>0 ;
             }
         })
         .classed("brushed", true);
          }
        }
    // initialize brush, on events
    let brush  = d3.brush()
    .on('brush', highlightBrushed)
    .on('end', endbrush)


    that.brush = brush;
    // add brush to view
    grid_g.append("g")
    .attr('id', 'brushg')
    .attr('width', that.width)
    .attr('height', that.height)
    .call(brush);

   // draw drawLegend
   let legendsvg = d3.select('#yearmonthlegend').append('svg')
   .attr('width', that.width+that.margin.left+that.margin.right)
   .attr('height', 35)
   .append('g')
   .attr('transform', 'translate(' + 0 + ',' + -5 + ')')

   legendsvg.selectAll('rect').data([0, maxcount/8, maxcount/4, maxcount])
   .enter().append('rect')
   .attr('x', function(d, i){return that.width*.45+i*that.xscale.bandwidth()*1.1})
   .attr('y', '10')
   .style('fill', d=>gcolor(d))
   .attr('width', that.xscale.bandwidth())
   .attr('height', that.yscale.bandwidth())
   .attr('class', 'yeargrid')
  legendsvg.append('text')
    .style('font-size', '12px')
   .attr('x', that.width*.2)
   .attr('y', 25)
   .text('Less Reported')
   legendsvg.append('text')
     .style('font-size', '12px')
    .attr('x', that.width*.5+4*that.xscale.bandwidth()*1.1)
    .attr('y', 25)
    .text('More Reported')
  }

}
