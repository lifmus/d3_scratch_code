function createSoccerViz() {
  d3.csv("sample_files/worldcup.csv", function(data) {
    overallTeamViz(data);
  })

    function overallTeamViz(incomingData) {
    d3.select("svg")
    .append("g")
    .attr("id", "teamsG")
    .attr("transform", "translate(50,300)")
    .selectAll("g")
    .data(incomingData)
    .enter()
    .append("g")
    .attr("class", "overallG")
    .attr("transform", function (d,i) {return "translate(" + (i * 50) + ", 0)"});

    var teamG = d3.selectAll("g.overallG");

    // teamG
    // .append("circle")
    // .attr("r", 20)
    // .style("fill", "pink")
    // .style("stroke", "black")
    // .style("stroke-width", "1px");

    teamG
    .append("circle").attr("r", 0)
    .transition()
    .delay(function(d,i) {return i * 100})
    .duration(500)
    .attr("r", 40)
    .transition()
    .duration(500)
    .attr("r", 20);

    teamG
    .append("text")
    .style("text-anchor", "middle")
    .attr("y", 30)
    .style("font-size", "10px")
    .text(function(d) {return d.team});

    teamG.on("mouseover", highlightRegion2);
    function highlightRegion(d) {
         d3.selectAll("g.overallG").select("circle")
                .style("fill", function(p) {
                  return p.region == d.region ?
                    d3.select(this).classed('active', true) :
                    d3.select(this).classed('inactive', true);
                });
    };

    // function highlightRegion2(d,i) {
    //  d3.select(this).select("text").classed("highlight", true).attr("y", 10);
    //     d3.selectAll("g.overallG").select("circle")
    //        .each(function(p, i) {
    //          p.region == d.region ?
    //               d3.select(this).classed("active", true) :
    //               d3.select(this).classed("inactive", true);
    //        });
    //  this.parentElement.appendChild(this);
    // };

    function highlightRegion2(d,i) {
     var teamColor = d3.rgb("pink")
     d3.select(this).select("text").classed("highlight", true).attr("y", 10)
     d3.selectAll("g.overallG").select("circle")
           .style("fill", function(p) {return p.region == d.region ?
                   teamColor.darker(.75) : teamColor.brighter(.5)})
     this.parentElement.appendChild(this);
    }

    // teamG.on("mouseout", function() {
    //     d3.selectAll("g.overallG").select("circle").style("fill", "pink");
    // });

    teamG.on("mouseout", unHighlight)

    function unHighlight() {
     d3.selectAll("g.overallG").select("circle").attr("class", "");
     d3.selectAll("g.overallG").select("text")
    .classed("highlight", false).attr("y", 30);
    };

     var dataKeys = d3.keys(incomingData[0])
    .filter(function (el) {return el != "team" && el != "region"})
       d3.select("#controls").selectAll("button.teams").data(dataKeys).enter().append("button")
       .on("click", buttonClick)
       .html(function(d) {return d});

    // function buttonClick(datapoint) {
    //   var maxValue = d3.max(incomingData,
    //     function(d) {return parseFloat(d[datapoint])
    //   });
    //   var radiusScale = d3.scale.linear().domain([0,maxValue]).range([2,20]);
    //   d3.selectAll("g.overallG")
    //     .select("circle")
    //     .transition().duration(1000)
    //     .attr("r", function(d) {return radiusScale(d[datapoint])})
    // }

    function buttonClick(datapoint) {
        var maxValue = d3.max(incomingData, function(el) {
            return parseFloat(el[datapoint ]);
        });
        var tenColorScale = d3.scale.category10(
            ["UEFA", "CONMEBOL", "CAF",  "AFC"]);
        var radiusScale = d3.scale.linear().domain([0,maxValue]).range([2,20]);
        d3.selectAll("g.overallG").select("circle").transition().duration(1000)
            .style("fill", function(p) {return tenColorScale(p.region)})
            .attr("r", function(p) {return radiusScale(p[datapoint ])});
    };

    // d3.selectAll("g.overallG").insert("image", "text")
    //   .attr("xlink:href", function(d) {
    //       return "images/" + d.team + ".png";
    //   })
    //   .attr("width", "45px").attr("height", "20px").attr("x", "-22")
    //   .attr("y", "-10");

    d3.text('sample_files/modal.html', function(data) {
      d3.select('body').append('div').attr('id', 'modal').html(data);
    })

    teamG.on('click', teamClick);

    function teamClick(d) {
      d3.selectAll('td.data').data(d3.values(d))
        .html(function (p){
          return p;
        })
    }

    d3.html('images/icon.svg', loadSVG);

    // function loadSVG(svgData) {
    //   while(!d3.select(svgData).selectAll('path').empty()) {
    //     d3.select('svg').node().appendChild(
    //       d3.select(svgData).select('path').node());
    //   }
    //   d3.selectAll('path').attr('transform', 'translate(50,50)')
    // }

    function loadSVG(svgData) {
        d3.selectAll("g").each(function() {
        var gParent = this;
        d3.select(svgData).selectAll("path").each(function() {
              gParent.appendChild(this.cloneNode(true))
          });
        });
        d3.selectAll("path").style("fill", "darkred")
        .style("stroke", "black").style("stroke-width", "1px")

        d3.selectAll("g.overallG").each(function(d) {
            d3.select(this).selectAll("path").datum(d)
        });

        var tenColorScale = d3.scale
            .category10(["UEFA", "CONMEBOL", "CAF", "AFC"]);

        d3.selectAll("path").style("fill", function(p) {
            return tenColorScale(p.region)
        }).style("stroke", "black").style("stroke-width", "2px");
    };




  }
}
