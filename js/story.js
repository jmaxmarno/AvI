class story{
    constructor(data, category, updateTime) {
      // Data:
        this.data = data;
        this.category =  category;
        this.updateTime = updateTime;
      // styling parameters
        this.margin = {top: 10, bottom: 10, left: 10, right: 40};
        let divDim = d3.select("#story").node().getBoundingClientRect();
        this.width = divDim.width - this.margin.left - this.margin.right;
        this.height = divDim.height - this.margin.top - this.margin.bottom;

      //story data
        this.descriptions = {
          "trigger": ["- Slides can occur naturally or be triggered intentionally or unintentionaly by human activity.",
            "- It is important to remember that human triggered slides are more likely to be reported and these observations are not a representative sample of all avalanches in Utah."],
          "aspect": ["- Aspect is the direction the slope faces with respect to the sun where the slide occured.","-  North and East facing slopes recieve much less sunlight resulting in a colder snowpack with fragile weak-layers. These slopes alse tend to get more human traffic as the snow is deeper and better.", "- For these reasons the majority of avalanches occur on North and East facing slopes."],
          "width": ["- Width refers to the distance across the hill of the slide.", "- Observations have recorded widths ranging from five to five thousand feet across.", "- The majority of slides reported are less than 200 feet across."],
          "elevation": ["- "]
          }


        this.points = {
          "trigger":[
            {"display":"Feb. 2011",
              "time":[{"year":2011,"months":[2]}],
              "text":"Many skiers."
            },
            {"display":"February",
              "time":[{"year":2011,"months":[2]},{"year":2011,"months":[2]}],
              "text":"Test feb."
            },
            {"display":"2011",
              "time":[{"year":2011,"months":[1,2,3,4,5,6,7,8,9,10,11,12]}],
              "text":"Many skiers."
            }
          ],
          "aspect":[
            {"display":"May 2011","time":[],"text":"The distribution of the slope aspect in the observations of May 2011 looks quite different from most months. It appears that many more slides were reported on South and West facing slopes but it is hard to draw conclusions about this month because there were only five avalanche observations, making the proportions prone to effected by random chance."},
            {"display":"Nov. and Dec.","time":[],"text":"As the star plot distribution illustrates, in the early months of winter there are even fewer observations of slides on South and West facing slopes than there are in general. At this point in time, the sun has likely prevented much snow from accumulating on the warmer South and West facing slopes, making them less likely to slide."},
            {"display":"Winter 17/18","time":[],"text":"Looking at the 2017-2018 winter season, we can see the increase in South facing slide observations over time. In the beginning of the season, the reported avalanches are mostly north facing, as the snow pack is accumulating faster in these colder regions, but as snow depth increases over time, there are more South facing observations."}
          ],
          "width":[
            {"display":"Feb. 2011","time":[{"year":2011,"months":[2]}],"text":"Many skiers."},
            {"display":"February","time":[{"year":2011,"months":[2]},{"year":2011,"months":[2]}],"text":"Many skiers."},
            {"display":"2011","time":[{"year":2011,"months":[1,2,3,4,5,6,7,8,9,10,11,12]}],"text":"Many skiers."}
          ],
          "elevation":[
            {"display":"Feb. 2011","time":[{"year":2011,"months":[2]}],"text":"Many skiers."},
            {"display":"February","time":[{"year":2011,"months":[2]},{"year":2011,"months":[2]}],"text":"Many skiers."},
            {"display":"2011","time":[{"year":2011,"months":[1,2,3,4,5,6,7,8,9,10,11,12]}],"text":"Many skiers."}
          ],
        }

        this.draw();
    }

    // update function (re-draw)
    update(activeatt, activetime){
        this.category = activeatt;
        this.draw();
    }

    draw(){
      let that = this;
      // update title
      d3.select("#attrTitle").text(this.category);
      // update description
      let ul = d3.select("#attrDescription").selectAll('li').data(this.descriptions[this.category]);
      let ul_enter = ul.enter().append('li');
      ul.exit().remove();
      ul = ul_enter.merge(ul)
      ul.html(String);
      let data = this.points[this.category]
      // update buttons 
      let buttons = d3.select("#story").selectAll("a").data(data);
      let buttons_enter = buttons.enter().append("a");
      buttons.exit().remove();
      buttons = buttons_enter.merge(buttons);
      buttons.text((d)=> d.display)
        .on("click", function(d){
          // that.updateTime(d.time); //not working
          d3.select("#context").text(d.text);
        })
     }

}
    