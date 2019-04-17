(function(window) { // efficiency creeps
	'use strict'

	 function init() {
		var identikit = {};

		identikit.monthTickF = function(d, i) {
			const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
			if (d.getMonth() == 0) {
				return d.getFullYear();
			} else {
				return months[d.getMonth()];
			}
		}
		identikit.dateFilter = function(date, range){
			switch(range){
				case "1d": // return only time (6:32)
				 	let milhrs = date.getHours();
					let ampm = "AM";
					if(milhrs > 12){
						ampm = "PM";
					}
					let hrs = (milhrs%12).toString();

					if(hrs.indexOf(0) == 0){
						hrs = hrs.replace("0","12");
					}
					return hrs + ":" + (function(){ // all this for putting a zero before a number
						let l = date.getMinutes();
						 if(l.toString().length == 1){
							 return "0" + l;
						 } else {
							 return l;
						 }
					 })() + " " + ampm;
					break;
				case "5d" || "1w5d":
					return (date.getMonth() + 1) + "/" + (date.getDate()) + " " + identikit.dateFilter(date, "1d"); // you never saw it coming
					break;
				case "30d" || "60d":
					return (date.getMonth() + 1) + "/" + date.getDate();
					break;
				case "1y":
					return (date.getFullYear() + "/" + (date.getMonth() + 1) + date.getDate());
					break;
				case "5y":
					return (date.getFullYear() + "/" + (date.getMonth() + 1) + date.getDate());
				default:
					return date;
			}
		}
		identikit.formatInfoText = function(price, range, date1, date2){
			console.log(price)
			let splpr = price.toString().split(".")
			if(typeof price === "undefined" || price == 0){ // i have reached peak laziness
				splpr = "0.00".split(".");
			}


			let retText = "" + splpr[0] + "." + splpr[1].substring(0, 2);
			if(typeof date2 !== "undefined"){
				 if(date1 > date2){
					  retText += " " + identikit.dateFilter(date2, range) + " - " + identikit.dateFilter(date1, range);
				 }
				 else{
					 retText += " " + identikit.dateFilter(date1, range) + " - " + identikit.dateFilter(date2, range);
				 }
			}
			else{
				retText += " " + identikit.dateFilter(date1, range);
			}

			return retText;
		}
		identikit.dateWithTime = function(D, H, M, S) {
			let E = new Date(D.getTime());
			E.setHours(H);
			E.setMinutes(M);
			E.setSeconds(S);
			return E;
		}
		identikit.getStaticTicks = function(ticks, x_vals) {
			let step = Math.floor(x_vals.length / ticks);
			return (x_vals.filter(function(value, index, Arr) {
				return index % step == 0;
			}))
		}
		identikit.deltaPrice = function(box1, box2) {
			let dif = box2.high - box1.high;

			let spl = dif.toString().split(".");

			if (dif == 0) {
				let difstr = "0";
			} else if (dif > 0) {
				let difstr = "+" + spl[0] + "." + spl[1].substring(0, 2);
				return {
					'd': difstr,
					'c': '#00b35c'
				}
			} else if (dif < 0) {
				let difstr = spl[0] + "." + spl[1].substring(0, 2);
				return {
					'd': difstr,
					'c': 'rgb(230, 74, 25)'
				}
			}


		}
		identikit.completeXDate = function(range, date) {
			let endDate = new Date(date[0].getTime());
			switch (range) {
				case "1d":
					endDate.setHours(16)
					endDate.setMinutes(0)
					endDate.setSeconds(0)
					break;
				case "1m":
					endDate.setSeconds(0)
					endDate.setMinutes(0)
					endDate.setHours(16)
					endDate.setMonth(endDate.getMonth() + 1)
					endDate.setDate(-1) // the day before the first day of the next month because javascript is dumb
					break;x
				case "1y":
					endDate.setHours(16)
					endDate.setMinutes(0)
					endDate.setSeconds(0)
					endDate.setFullYear(endDate.getFullYear() + 1)
					endDate.setMonth(0)
					endDate.setDate(-1)
					break;
			}

			let rest = Math.round((endDate.getTime() - date[date.length - 1].getTime()) / 1000 / 60)
			let begDate = date[date.length - 1]


			for (let i = 0; i < rest; i++) {
				//date.push(new Date(begDate.getTime() + i * 60 * 1000))
			}

			return date;
		}


		identikit.render_simple_chart = function(container, data) { // container : div object to house chart, data: formatted dateset (watchtower form)
			// default sizes to fit to div
			var newc = $(container);

			var sizes = {
				height: newc.height(),
				width: newc.width()
			};dispdate

			var dP = d3.timeParse("%s");

			var md = data.meta
			var dispdate = new Date(md.timeRange.endDate * 1000)

			console.log(identikit.dateFilter(dispdate, "5d"))
			data = data.stockData.map(function(d) {
				return {
					date: dP(d.timeStamp),
					open: +d.quote.open,
					high: +d.quote.high,
					low: +d.quote.low,
					close: +d.quote.close,
					volume: +d.quote.volume
				};0
			})

			// defaultidentikit margins0
			var margin = {
					top: 40,
					right: 20,
					bottom: 20,
					left: 20
				},
				width = sizes.width - margin.left - margin.right,
				height = sizes.height - margin.top - margin.bottom;



			var x = techan.scale.financetime().range([0, width]); // oh yea i forgot to mention we use techan as a dependency lmao
			var y = d3.scaleLinear().range([height, 0]);

			let n_ar = [];
			for (let i = 1; i < 8; i++) {
				n_ar.push(identikit.dateWithTime(data[0].date, 9 + i, 0, 0));
			}

			var xAxis = d3.axisBottom(x)
				.tickSizeOuter(0)
				.tickSizeInner(0)
				.tickValues(n_ar)
				.tickFormat(function(e, q, s) {
					let nums = e.toLocaleTimeString().split(":");
					let str = nums[0] + ":" + nums[1] + " " + nums[2].split(" ")[1];

					return str;
				}); //.tickFormat(identikit.monthTickF);

			var close = techan.plot.close()
				.xScale(x)
				.yScale(y);

			var svgcont = d3.select(container) // this probs isn't right
				.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)

			let text = svgcont.append("g") // ticker
				.attr("transform", "translate(" + margin.left + " ," + (margin.top / 2 + 5) + " )")
				.attr("class", "info")
				.attr("width", "100%")
				.attr("height", "50px")
				.style("width", "100%")
				.style("height", margin.top + "px");

			var svg = svgcont.append("g")
				.attr("transform", "translate(" + margin.left + " ," + margin.top + " )");

			var focus = svg.append("g")
				.style("display", "none");

			x.domain(identikit.completeXDate("1d", data.map(function(d) {
				return d.date;
			})));
			y.domain(techan.scale.plot.ohlc(data, close.accessor()).domain());


			svg.append("path")
				.attr("class", "area")
				.attr("fill-opacity", 0.005);

			svg.append("g")
				.attr("class", "close");

			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.attr("stroke-width", "2px");
			svg.append("rect")
				.attr("width", width)
				.attr("height", height)
				.style("fill", "none")
				.style("pointer-events", "all")
				.on("mouseover", function() {
					focus.style("display", null);
					focus.select("line.vertLine").style("visibility", "visible");
					focus.select("circle.y").style("visibility", "visible");
					focus.select("rect.traceInfo").style("visibility", "visible");
					focus.select("text.info-text").style("visibility", "visible");

				})
				.on("mouseout", function() {
					focus.select("circle.clicktrace").style("visibility", "hidden");
					focus.select("circle.y").style("visibility", "hidden");
					focus.select("line.vertLine").style("visibility", "hidden");
					focus.select("line.traceLine").style("visibility", "hidden");
					focus.select("rect.fill").style("visibility", "hidden");
					focus.select("rect.traceInfo").style("visibility", "hidden");
					focus.select("text.info-text").style("visibility", "hidden");


					currentDrop = null;
				})
				.on("mousedown", mousedown)
				.on("mouseup", mouseup)
				.on("mousemove", mousemove);


			let c = identikit.deltaPrice(data[0], data[data.length - 1]);
			text.append("text") // TICKER
				.attr("class", "information-bar")
				.attr("margin-left", "26px")
				.attr("width", "100%")
				.style("text-anchor", "start")
				.text(md.ticker); // C
			text.append("text") // PRICE CHANGE
				.attr("class", "sub-info-bar")
				.style("font-size", "14px")
				.attr("x", width)
				.style("font-weight", 600)
				.style("text-anchor", "end")
				.text(c.d)
				.style("fill", c.c);
/*			text.append("text") // DATE // IMPLEMENT THIS LATER
				.attr("class", "sub-info-bar")
				.style("font-size", "10px")
				.attr("x", width / 2)
				.style("font-weight", 600)
				.style("text-anchor", "middle")
				.text("APR 10"); // C
*/
			let bisectDate = d3.bisector(function(d) {
				return d.date;
			}).left;

			focus.append("rect")
				.attr("class", "fill")
				.attr("width", 0)
				.attr("height", height - 5)
				.attr("opacity", .04)
				.attr("x", 0)
				.attr("y", 5);
			focus.append("rect") // INFO THINGY
				.attr("class", "traceInfo")
				.attr("fill", "rgb(240,240,240)")
				.attr("width", "60px")
				.attr("height", "10px")
				.attr("rx", ".5px")
				.attr("ry", ".5px")
				.style("stroke-width", 2)
				.style("stroke", "rgb(235,235,235)");

			focus.append("text") // INFO TEXT
				.attr("class", "info-text")
				.style("font-size", "8px")
				.attr("x", 0)
				.style("font-weight", 600)
				.style("text-anchor", "middle"); // C

			focus.append("svg:line")
				.attr("class", "vertLine")
				.attr("stroke-width", "1.5px")
				.attr("stroke-dasharray", "3")
				.attr("opacity", 0.8)
				.attr("y1", 5)
				.attr("y2", height)
				.style("stroke", "lightGray");
			focus.append("svg:line")
				.attr("class", "traceLine")
				.attr("stroke-width", "1.5px")
				.attr("stroke-dasharray", "3")
				.attr("opacity", 0.8)
				.attr("y1", 5)
				.attr("y2", height)
				.style("visibility", "hidden")
				.style("stroke", "lightGray");
			focus.append("circle")
				.attr("class", "y")
				.attr("r", 3)
				.style("fill", "#00b378")
				.style("stroke", "#00b378");
			focus.append("circle")
				.attr("class", "clicktrace")
				.attr("r", 3)
				.style("fill", "#00b378")
				.style("visibility", "hidden")
				.style("stroke", "#00b378");


			var currentDrop;

			function mousemove() {
				var x0 = x.invert(d3.mouse(this)[0]),
					i = bisectDate(data, x0, 1),
					d0 = data[i - 1],
					d1 = data[i],
					d = x0 - d0.date > d1.date - x0 ? d1 : d0;
				focus.select("line.vertLine")
					.attr("transform", "translate(" + x(d.date) + ", 0 )");
				focus.select("circle.y")
					.attr("transform", "translate(" + x(d.date) + "," + y(d.close) + ")");

				if(!currentDrop){
						focus.select("text.info-text")
							.attr("transform", "translate(" + x(d.date) + ", -2)")
							.attr("text-anchor", "middle")
							.text(identikit.formatInfoText(d.open, "1d", d.date));

						let width = focus.select("text.info-text").node().getBBox().width + 5;
						focus.select("rect.traceInfo")
							.attr("width", width)
							.attr("transform", "translate(" + (x(d.date) - width/2) + ", -10)");
				} else{
					let pchange = d.open - currentDrop.open;
					focus.select("text.info-text")
						.attr("transform", "translate(" + (x(currentDrop.date) - ((x(currentDrop.date) - x(d.date))/2)) + ", -2)")
						.text(identikit.formatInfoText(pchange, "1d", d.date, currentDrop.date));
					let width = focus.select("text.info-text").node().getBBox().width + 5 ;//Math.min(Math.max(Math.abs(x(currentDrop.date) - x(d.date)),60), 120);
					focus.select("rect.traceInfo") //trace
						.attr("transform", "translate(" + (x(currentDrop.date) - ((x(currentDrop.date) - x(d.date))/2) - width/2) + ", -10)")
						.attr("width", width);
				}

				if(currentDrop){
					if (x(currentDrop.date) < x(d.date)) {
						focus.select("rect.fill")
							.attr("transform", "translate(" + x(currentDrop.date) + ", 0)")
							.attr("width", x(d.date) - x(currentDrop.date) + "px");
					} else {
						focus.select("rect.fill")
							.attr("transform", "translate(" + x(d.date) + ", 0)")
							.attr("width", x(currentDrop.date) - x(d.date) + "px");
					}
				}
			}

			function mousedown() {
				focus.select("line.traceLine").style("visibility", "visible");
				focus.select("circle.clicktrace").style("visibility", "visible");
				focus.select("rect.fill").style("visibility", "visible");
				var x0 = x.invert(d3.mouse(this)[0]),
					i = bisectDate(data, x0, 1),
					d0 = data[i - 1],
					d1 = data[i],
					d = x0 - d0.date > d1.date - x0 ? d1 : d0;
				focus.select("line.traceLine")
					.attr("transform", "translate(" + x(d.date) + ", 0)");
				focus.select("rect.fill")
					.attr("transform", "translate(" + x(d.date) + ", 0)")
					.attr("width", "0px");
				focus.select("circle.clicktrace")
					.attr("transform", "translate(" + x(d.date) + "," + y(d.close) + ")");
				currentDrop = d;
			}

			function mouseup() {
				var x0 = x.invert(d3.mouse(this)[0]),
					i = bisectDate(data, x0, 1),
					d0 = data[i - 1],
					d1 = data[i],
					d = x0 - d0.date > d1.date - x0 ? d1 : d0;

				focus.select("circle.clicktrace").style("visibility", "hidden");
				focus.select("line.traceLine").style("visibility", "hidden");
				focus.select("rect.fill").style("visibility", "hidden");

				focus.select("text.info-text")
					.attr("transform", "translate(" + x(d.date) + ", -2)")
					.attr("text-anchor", "middle")
					.text(identikit.formatInfoText(d.open, "1d", d.date));

				let width = focus.select("text.info-text").node().getBBox().width + 5;
				focus.select("rect.traceInfo")
					.attr("width", width)
					.attr("transform", "translate(" + (x(d.date) - width/2) + ", -10)");
				currentDrop = null;
			}


			var area = d3.area()
				.x(function(d) {
					return x(d.date);
				})
				.y0(height + 1)
				.y1(function(d) {
					return y(d.close);
				});

			svg.selectAll("path.area")
				.datum(data)
				.attr("d", area);
			svg.selectAll("g.close")
				.datum(data)
				.call(close);
			svg.selectAll("g.x.axis")
				.call(xAxis);
		}

		return identikit;
	}
	if (typeof(identikit) === 'undefined') {
		window.identikit = init();
	}
})(window);
