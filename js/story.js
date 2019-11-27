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
          "aspect": ["- test ","- "],
          "size": ["- "],
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
            {"display":"Feb. 2011","time":[{"year": "2010", "months":[2]}],"text":"Many skiers."},
            {"display":"February","time":[{"year":2011,"months":[2]},{"year":2011,"months":[2]}],"text":"Many skiers."},
            {"display":"2011","time":[{"year":2011,"months":[1,2,3,4,5,6,7,8,9,10,11,12]}],"text":"Many skiers."}
          ],
          "size":[
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
    