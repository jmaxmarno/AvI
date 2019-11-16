class spiderchart{
    /**
     * Creates a Bubble plot Object
     */
    constructor(data, histData, category, activeTime) {
      // Chart styling parameters
      console.log(category);
        this.width = 250;
        this.height = 250;
        this.margin = {top: 40, bottom: 40, left: 50, right: 50};
        this.innerlevels = 2;
        this.max = .6;
        this.color = d3.scaleOrdinal(d3.schemeCategory10);
      // Chart Data:
        this.data = data;
        this.histData = histData;
        this.category =  category;
        this.activeTime = activeTime;

        let startYear = Object.keys(this.data)[0];
        let startMonth = Object.keys(this.data[startYear])[0];
        this.labels = Object.keys(this.data[startYear][startMonth][this.category]);
        this.draw();


    };

    draw(){
      let self = this;
      console.log(self.data)
      let axes = self.labels;
      let axesLength = axes.length;
      let axesRadius = self.height / 2
      let axesSlice = Math.PI * 2 / axesLength
      // radius scale
      let radiusScale = d3.scaleLinear()
      .range([0, axesRadius])
      .domain([0, self.max])


      // svg stuff
      d3.select('#spidersvg').remove();
      let spidersvg = d3.select('#starplot').append('svg').attr('id', 'spidersvg')
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
      // draw axes lines
      let axesLines = axesWrap.selectAll('.axis')
      .data(self.labels).enter().append('g')
      .attr('class', 'axis');
      axesLines.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', function(d, i){
        return radiusScale(self.max)*Math.cos(axesSlice*i - Math.PI/2);
      })
      .attr('y2', function(d, i){
        return radiusScale(self.max)*Math.sin(axesSlice*i - Math.PI/2);
      })
      .attr('class', 'spideraxis')
      .style('stroke', 'white')
      .style('stroke-width', '2px')
      .style('stroke-opacity', '0.4')

      // Axis Labels:
      axesLines.append('text')
      .text(d=>d)
      .style("font-size", "10px")
      // .attr('class', 'spideraxis')
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr('x', function(d, i){
        return radiusScale(self.max*1.2)*Math.cos(axesSlice*i - Math.PI/2);
      })
      .attr('y', function(d, i){
        return radiusScale(self.max*1.2)*Math.sin(axesSlice*i - Math.PI/2);
      })

      let sdata = self.getstardata()
      console.log(sdata)
      // TODO: move radial line function up when stable
      let lineRadial = d3.lineRadial()
      .radius(function(d){return radiusScale(d.prop)})
      .angle(function(d, i){return i*axesSlice})
      // .curve(d3.curveCatmullRomOpen)

      //  Wrapper for star/spider blobs
      let starWrap = spider_g.append('g').selectAll(".starwrapper")
      .data([sdata])
      .enter().append('g')
      // .attr('class', '')
      starWrap.append('path')
      // .attr('class', '')
      .attr('d', function(d,i){
        return lineRadial(d)})
      .style('fill', 'purple')
    }

    update(activeatt){
      this.category = activeatt;
      let startYear = Object.keys(this.data)[0];
      let startMonth = Object.keys(this.data[startYear])[0];
      this.labels = Object.keys(this.data[startYear][startMonth][this.category]);
      this.draw()
    }
    getstardata(){
      let self = this;
      let grandtotal = 0
      let cattotals = []
      self.labels.map(function(d){
        cattotals[d] = {}
        cattotals[d].count = 0
        cattotals[d].prop = 0
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
        ddict.category = key;
        ddict.count = cattotals[key].count;
        ddict.prop = cattotals[key].prop;
        return ddict
        // return cattotals[key].count
      })
      return starlist
    }


// Adapted from:
// http://bl.ocks.org/nbremer/raw/21746a9668ffdf6d8242/
}