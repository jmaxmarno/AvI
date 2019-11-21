class story{
    constructor(data, category) {
      // styling parameters
        this.width = 200;
        this.height = 200;
        this.margin = {top: 20, bottom: 20, left: 20, right: 20};
      // Data:
        this.data = data;
        this.category =  category;
        this.activetime = [];

        let startYear = Object.keys(this.data)[0];
        let startMonth = Object.keys(this.data[startYear])[0];
        this.labels = Object.keys(this.data[startYear][startMonth][this.category]);
        this.draw();
    }

    draw(){
      let self = this;
      d3.select('#storySVG').remove();
      let storysvg = d3.select('#story').append('svg').attr('id', 'storySVG')
        .attr('width', self.width+self.margin.left+self.margin.right)
        .attr('height', self.height+self.margin.bottom+self.margin.top);
      let story_g = storysvg.append('g')
        .attr('transform', 'translate(' + (self.width/2 + self.margin.left) + ',' + (self.height/2 + self.margin.top) + ')');
      story_g.append('text').text(this.category)
    }

      // update function (re-draw)
    update(activeatt, activetime){
      this.activetime = activetime;
      this.category = activeatt;
      let startYear = Object.keys(this.data)[0];
      let startMonth = Object.keys(this.data[startYear])[0];
      this.labels = Object.keys(this.data[startYear][startMonth][this.category]);
      this.draw()
    }
}
    