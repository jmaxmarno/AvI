class spiderchart{
    /**
     * Creates a Bubble plot Object
     */
    constructor(data, category, colorfunction) {
      // Chart styling parameters
        this.margin = {top: 80, bottom: 50, left: 70, right: 70};
        let divDim = d3.select("#dropdown").node().getBoundingClientRect();
        // console.log(divDim)
        this.width = divDim.width - 2*this.margin.left - this.margin.right;
        this.height = this.width;
        this.innerlevels = 2;
        this.color = colorfunction
      // Chart Data:
        this.data = data;
        this.category =  category;
        this.activetime = [];

        let startYear = Object.keys(this.data)[0];
        let startMonth = Object.keys(this.data[startYear])[0];
        // this.labels = Object.keys(this.data[startYear][startMonth][this.category]);
        this.labels = Object.keys(this.data[startYear][startMonth][this.category]).map(function(d){
          return {'val': d}
        });
        this.draw();
    };

    draw(){
      let self = this;
      let sdata = self.activetime.length == 0?[self.getstardata()]:[self.getstardata(), self.getdatedstardata()]
      // let maxprop = Math.ceil(10*Math.max(...sdata[0].map(d=>d.prop)))/10
      let maxprop = Math.ceil(10*Math.max(...sdata.map(function(d){return Math.max(...d.map(p=>p.prop))})))/10
      let axes = self.labels;
      let axesLength = axes.length;
      let axesRadius = self.height / 2
      let axesSlice = Math.PI * 2 / axesLength
      // radius scale
      let radiusScale = d3.scaleLinear()
      .range([0, axesRadius])
      .domain([0, maxprop])

      // svg stuff
      d3.select('#spidersvg').remove();
      let spidersvg = d3.select('#dropdown').append("svg").attr("id", "spidersvg")
        .attr('width', self.width+self.margin.left+self.margin.right)
        .attr('height', self.height+self.margin.bottom+self.margin.top);
      let spider_g = spidersvg.append('g')
        .attr('transform', 'translate(' + (self.width/2 + self.margin.left) + ',' + (self.height/2 + self.margin.top) + ')');
        // Wrapper for axes
      let axesWrap = spider_g.append('g')
      // draw inner circles
      axesWrap.selectAll('.levels')
      .data(d3.range(1, (this.innerlevels+1)).reverse())
      .enter().append('circle')
      .attr('r', function(d, i){
        return axesRadius/self.innerlevels*d;
      })
      .style('fill', 'gray')
      .style('stroke', 'black')
      .style('fill-opacity', '0.2')
      .style('stroke-opacity', '0.5')
      // inner circle labels
      axesWrap.selectAll('.axislabel').data(d3.range(1,(self.innerlevels+1)).reverse())
      .enter().append('text')
      .attr('x', 3)
      .attr('y', function(d){return -d*axesRadius/self.innerlevels;})
      .attr('dy', '0.35em')
      .style('font-size', '10px')
      .text(function(d, i) {return d3.format(".0%")(maxprop *d/self.innerlevels)})


      // draw axes lines
      let axesLines = axesWrap.selectAll('.axis')
      .data(self.labels).enter().append('g')
      .attr('class', 'axis');
      axesLines.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', function(d, i){
        return radiusScale(maxprop)*Math.cos(axesSlice*i - Math.PI/2);
      })
      .attr('y2', function(d, i){
        return radiusScale(maxprop)*Math.sin(axesSlice*i - Math.PI/2);
      })
      .attr('class', 'spideraxis')
      .style('stroke', function(d, i){
        return self.color(self.category, d.val)})
      .style('stroke-width', '3px')
      .style('stroke-opacity', '0.4')

      // Axis Labels:

      const labeloffset = 1.3
      axesLines.append('rect')
      axesLines.append('text')
      .text(d=>d.val)
      .style("font-size", "10px")
      // .attr('class', 'spideraxis')
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style('fill', 'black')
      // .style('fill', function(d, i){return self.color(self.category, d.val)})
      .attr('x', function(d, i){
        return radiusScale(maxprop*labeloffset)*Math.cos(axesSlice*i - Math.PI/2);
      })
      .attr('y', function(d, i){
        return radiusScale(maxprop*labeloffset)*Math.sin(axesSlice*i - Math.PI/2);
      })
      // Add bounding box to data for background rectangles
    axesLines.selectAll("text").each(function(d, i) {
      let ii = self.labels.map(n=>n.val).indexOf(d.val)
        self.labels[ii].bb = this.getBBox()
        self.labels[ii].i = ii

    });
    // update size and position of background rectangles
    var paddingLeftRight = 12; // adjust the padding values depending on font and font size
    var paddingTopBottom = 5;
    axesLines.selectAll('rect')
    .attr('width', function(d){
      return d.bb.width + paddingLeftRight;})
    .attr('height', function(d){return d.bb.height+paddingTopBottom;})
    .attr('x', function(d, i){
      return radiusScale(maxprop*labeloffset)*Math.cos(axesSlice*d.i - Math.PI/2)- d.bb.width/2 - paddingLeftRight/2;
    })
    .attr('y', function(d, i){
      return radiusScale(maxprop*labeloffset)*Math.sin(axesSlice*d.i - Math.PI/2)- d.bb.height + paddingTopBottom/2;
    })
    .style('fill', function(d, i){return self.color(self.category, d.val)})



      // TODO: move radial line function up when stable
      let lineRadial = d3.lineRadial()
      .radius(function(d){return radiusScale(d.prop)})
      .angle(function(d, i){return i*axesSlice})
      // .curve(d3.curveCatmullRomClosed.alpha(1));
      // .curve(d3.curveCardinalClosed)
      .curve(d3.curveLinearClosed)

      //  Wrapper for star/spider blobs
      let starWrap = spider_g.append('g').selectAll(".starwrapper")
      .data(sdata)
      .enter().append('g')
      // .attr('class', '')
      starWrap.append('path')
      // .attr('class', '')
      .attr('d', function(d,i){
        return lineRadial(d)})
      .style('fill', function(d, i){
        if(d[0].type == 'aggregate'){
          return 'grey'
        }else if (d[0].type == 'selection') {
          return 'red'
        }
      })
      .style('fill-opacity', 0.5)
      // star outline
      starWrap.append('path')
      .attr('class', 'staroutline')
      .attr('d', function(d, i){return lineRadial(d)})
      .style('stroke-width', '2px')
      .style('stroke-opacity', 0.6)
      .style('stroke', function(d, i){
        if(d[0].type == 'aggregate'){
          return 'black'
        }else if (d[0].type == 'selection') {
          return 'red'
        }
      })
      .style('fill', 'none')

      // intercept circles
      starWrap.selectAll('.starintercept')
      .data(function(d, i){return d})
      .enter().append('circle')
      .attr('class', 'starintercept')
      .attr('r', '3')
      .attr('cx', function(d, i){return radiusScale(d.prop)*Math.cos(axesSlice*i - Math.PI/2);})
      .attr('cy', function(d, i){return radiusScale(d.prop)*Math.sin(axesSlice*i - Math.PI/2);})
      .style('fill', function(d, i){
        if(d.type == 'aggregate'){
          return 'black'
        }else if (d.type == 'selection') {
          return 'brown'
        }
      })
      .style('fill-opacity', 0.5)
      // TODO: change this to div tooltip
      .append('svg:title')
      .text(function(d, i) {return d3.format(".0%")(d.prop)})
    }
      // update function (re-draw)
    update(activeatt, activetime){
      this.activetime = activetime
      this.category = activeatt;
      let startYear = Object.keys(this.data)[0];
      let startMonth = Object.keys(this.data[startYear])[0];
      // this.labels = Object.keys(this.data[startYear][startMonth][this.category]);
      this.labels = Object.keys(this.data[startYear][startMonth][this.category]).map(function(d){
        return {'val': d}
      });
      this.draw()
    }
    // Get aggregate star plot data for all data points
    getstardata(){
      let self = this;
      let grandtotal = 0
      let cattotals = []
      self.labels.map(function(d){
        cattotals[d.val] = {}
        cattotals[d.val].count = 0
        cattotals[d.val].prop = 0
      })

      for (let year in self.data){
        for(let month in self.data[year]){
          // console.log('monthtotal', self.data[year][month]);
          grandtotal += self.data[year][month].total_count
          let catcount
          for(let cat in self.data[year][month][self.category]){
            // console.log('cat', cat);
            // console.log('ladf', self.data[year][month][self.category]);
            cattotals[cat].count += self.data[year][month][self.category][cat]
          }
        }
      }
      let starlist = Object.keys(cattotals).map(function(key){
        cattotals[key].prop = cattotals[key].count/grandtotal
        let ddict = {}
        ddict.type = 'aggregate';
        ddict.category = key;
        ddict.count = cattotals[key].count;
        ddict.prop = cattotals[key].prop;
        return ddict
        // return cattotals[key].count
      })
      return starlist
    }
    // Get star data for selected date range
    getdatedstardata(){
      let self = this;
      let grandtotal = 0
      let cattotals = []
      self.labels.map(function(d){
        cattotals[d.val] = {}
        cattotals[d.val].count = 0
        cattotals[d.val].prop = 0
      })
      let activeyears = this.activetime.map(d=>d.year)
      // console.log('spider active years', activeyears);
      for (let yyear in self.data){
        if(activeyears.includes(yyear)){
          let selmonths = self.activetime.filter(d=>d.year==yyear)[0].months
          for(let month in self.data[yyear]){
            if(selmonths.includes(parseInt(month))){
              grandtotal += self.data[yyear][month].total_count
              for(let cat in self.data[yyear][month][self.category]){
                // console.log('cat', cat);
                // console.log('ladf', self.data[year][month][self.category]);
                cattotals[cat].count += self.data[yyear][month][self.category][cat]
              }
            }
          }
        }
      }
      let starlist = Object.keys(cattotals).map(function(key){
        cattotals[key].prop = cattotals[key].count/grandtotal
        let ddict = {}
        ddict.type = 'selection';
        ddict.category = key;
        ddict.count = cattotals[key].count;
        ddict.prop = cattotals[key].prop;
        return ddict
        // return cattotals[key].count
      })

      // console.log(starlist.map(d=>d.category));
      return starlist
    }

// Adapted from:
// http://bl.ocks.org/nbremer/raw/21746a9668ffdf6d8242/
}
