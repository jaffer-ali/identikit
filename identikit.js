(function(window){
    'use strict'
    function init(){
        var identikit = {
        };

        function identikit.tickF(d, i) {
        		if (d.getMonth() == 0) {
        			return d.getFullYear();
        		} else {
        			return months[d.getMonth()];
        		}
        		return call
        })

        function identikit.render_simple_chart(container, data){ // container : div object to house chart, data: formatted dateset (watchtower form)
          // default sizes to fit to div
          var sizes = {height: container.height(), width: container.width()};

          // default margins
          var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = sizes.width - margin.left - margin.right,
            height = sizes.height - margin.top - margin.bottom;

          var parseTime = d3.timeParse("%d-%b-%y");

          var x = techan.scale.financetime().range([0, width]).outerPadding(0); // oh yea i forgot to mention we use techan as a dependency lmao
          var y = d3.scaleLinear().range([height, 0]);

          var xAxis = d3.axisBottom(x).ticks(1).tickFormat(identikit.tickF).tickSizeOuter(0).tickSizeInner(0);
          var yAxis = d3.axisLeft(y).ticks(0).tickSizeOuter(0).tickSizeInner(0); // probably remove this

          var area = d3.area()
            .x(function(d) {
              return x(d.date);
            })
            .y0(height + 1)
            .y1(function(d){
              return y(d.close);
            });

          var close = techan.plot.close()
            .xScale(x)
            .yScale(y);

          var svg = d3.select(container) // this probs isn't right
            .append("svg")
            .attr("width", width + margin.left + margin.right)
          	.attr("height", height + margin.top + margin.bottom)
          	.append("g")
          	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        }

        return identikit;
    }
    if(typeof(identikit) === 'undefined'){
        window.identikit = init();
    }
})(window);
