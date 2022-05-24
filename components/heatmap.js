function heatmap(div, tt, data, x0, x1, yVar, color){

d3.select(`#heatmap_svg_${yVar[0]}`).remove();
var margin = {top: 10, right: 10, bottom: 20, left: 100}
var width = 400 - margin.left - margin.right
var height = 400 - margin.top - margin.bottom

var svg = d3.select(div)
    .append("div")
        .attr('id', `heatmap_svg_${yVar[0]}`)
        .attr('class', 'flex-grow-1')
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)

const myGroups = Array.from(new Set(data.map(d => d[x0]))).sort()
const myVars = Array.from(new Set(data.map(d => d[x1]))).sort()
let newData = []

for (var myGroup of myGroups){
    
    for (var myVar of myVars){
        
        let tmp = data.filter(function(d) {return d[x0] == myGroup})
                .filter(function(d) {return d[x1] == myVar})
        let a = 0
        for (var t of tmp){
            a += t[yVar]
        }
        
        newData.push({
            x0: myGroup,
            x1: myVar,
            y: a/(tmp.length)
        })
    }
    
}


const x = d3.scaleBand()
    .range([0, width])
    .domain(myGroups)
    .padding(.05)
svg.append("g")
    .style("font-size", 15)
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickSize(0))
    .select(".domain").remove()

const y = d3.scaleBand()
    .range([ height, 0 ])
    .domain(myVars)
    .padding(0.05);
svg.append("g")
    .style("font-size", 15)
    .call(d3.axisLeft(y).tickSize(0))
    .select(".domain").remove()





const myColor = d3.scaleSequential()
    .interpolator(color)
    .domain([0,100])

const tooltip = d3.select(tt)


const mouseover = function(e,d) {
    tooltip.select(".tooltip-inner").html("The exact value<br>of this cell: " + Math.round(d.y*100)/100)

    Popper.createPopper(e.target, tooltip.node(), {
        placement: 'top',
        modifiers: [
            {
                name: 'arrow',
                options: {
                element: tooltip.select(".tooltip-arrow").node(),
                },
            },
        ]
    });
    tooltip.style("display", "block");
}
//const mousemove = function(event,d) {
//    tooltip
//    .html("The exact value of<br>this cell is: " + Math.round(d.y*100)/100)
//    .style("left", (event.x) + "px")
//    .style("top", (event.y) + "px")
//}
const mouseleave = function(e,d) {
    tooltip.style("display", "none");
}

svg.selectAll()
    .data(newData, function(d) {return d.x0+':'+d.x1;})
    .join("rect")
    .attr("x", function(d) { return x(d.x0) })
    .attr("y", function(d) { return y(d.x1) })
    .attr("rx", 4)
    .attr("ry", 4)
    .attr("width", x.bandwidth() )
    .attr("height", y.bandwidth() )
    .style("fill", function(d) { return myColor(d.y)} )
    .style("stroke-width", 4)
    .style("stroke", "none")
    .style("opacity", 0.8)
    .on("mouseover", mouseover)
    //.on("mousemove", mousemove)
    .on("mouseleave", mouseleave)


  // append a defs (for definition) element to your SVG
var svgLegend = d3.select(`#heatmap_svg_${yVar[0]}`).append('svg')
    .attr("width",360);
var defs = svgLegend.append('defs');

    // append a linearGradient element to the defs and give it a unique id
var linearGradient = defs.append('linearGradient')
        .attr('id', 'linear-gradient-'+yVar[0]);

// horizontal gradient
linearGradient
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%");

// append multiple color stops by using D3's data/enter step

linearGradient.selectAll("stop")
    .data(myColor.ticks().map((t, i, n) => ({offset: `${100*i/n.length}%`, color: myColor(t)})))
    .enter().append("stop")
    .attr("offset", d => d.offset)
    .attr("stop-color", d => d.color);

// append title
svgLegend.append("text")
    .attr("class", "legendTitle")
    .attr("x", 0)
    .attr("y", 20)
    .style("text-anchor", "left")
    .text(`Average ${yVar}`);

// draw the rectangle and fill with gradient
svgLegend.append("rect")
    .attr("x", 10)
    .attr("y", 30)
    .attr("width", 340)
    .attr("height", 15)
    .style("fill", `url(#linear-gradient-${yVar[0]})`);

//create tick marks
var xLeg = d3.scaleLinear()
    .domain([0, 100])
    .range([10, 350]);

var axisLeg = d3.axisBottom(xLeg)
    .tickValues(myColor.domain())

svgLegend
    .attr("class", "axis")
    .attr("style", "margin: 0 auto; display: block")
    .append("g")
    .attr("transform", "translate(0, 40)")
    .call(axisLeg);

/*
// Add title to graph
svg.append("text")
        .attr("x", 0)
        .attr("y", -50)
        .attr("text-anchor", "left")
        .style("font-size", "22px")
        .text("A d3.js heatmap");

// Add subtitle to graph
svg.append("text")
        .attr("x", 0)
        .attr("y", -20)
        .attr("text-anchor", "left")
        .style("font-size", "14px")
        .style("fill", "grey")
        .style("max-width", 400)
        .text("A short description of the take-away message of this chart.");
*/
}