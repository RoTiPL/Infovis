function barchart(div, data, x0Var, x1Var) {
let margin = {
    top: 10, right: 10, bottom: 40, left: 40
}
let width=600, height=400;
let svg, xAxis, yAxis, legend, x0Scale, x1Scale, yScale


d3.select("#barchart_svg").remove();
x0Scale = d3.scaleBand();
x1Scale = d3.scaleBand();
yScale = d3.scaleLinear();

svg = d3.select(div).append("svg")
    .attr('id', 'barchart_svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)


let x0 = x0Var
let x1 = x1Var

let x0Label = [...(new Set(data.map(d => d[x0])))].sort()
let x1Label = [...(new Set(data.map(d => d[x1])))].sort()
let yLabel = []

x0Scale.domain(x0Label).rangeRound([0, width], .5);
x1Scale.domain(x1Label).rangeRound([0, x0Scale.bandwidth()])

for (var x0key of x0Label){
    let tmp = []
    for (var x1key of x1Label){
        tmp.push(
            data.filter(function(d) {return d[x0] == x0key})
                .filter(function(d) {return d[x1] == x1key})
                .length
        )
    }
    yLabel.push(tmp);
}
yScale.rangeRound([height, 0]).domain([0, d3.max(d3.max(yLabel))])


xAxis = d3.axisBottom().scale(x0Scale)

yAxis = d3.axisLeft().scale(yScale);
const color = d3.scaleOrdinal(d3.schemeCategory10)

svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);


svg.append("g")
    .attr("class", "y-axis")
    .style('opacity','1')
    .call(yAxis)
        .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style('font-weight','bold')
            .text("Value");

svg.select('.y').transition().duration(500).delay(1300).style('opacity','1');

newData = []
for (var x0key of x0Label){
    let values = []
    for (var x1key of x1Label){
        values.push({"x1": x1key, 'y': data.filter(function(d) {return d[x0] == x0key}).filter(function(d) {return d[x1] == x1key}).length})
    }
    newData.push({"x0": x0key, "values": values})
}

var slice = svg.selectAll(".slice")
    .data(newData)
    .enter().append("g")
    .attr("class", "g")
    .attr("transform",function(d) { return `translate(${x0Scale(d.x0)} ,0)`; });

slice.selectAll("rect")
    .data(function(d) { return d.values; })
        .enter().append("rect")
            .attr("width", x1Scale.bandwidth())
            .attr("x", function(d) { return x1Scale(d.x1); })
            .style("fill", function(d) { return color(d.x1) })
            .attr("y", function(d) { return yScale(0); })
            .attr("height", function(d) { return height - yScale(0); })
            .on("mouseover", function(d) {
            })
            .on("mouseout", function(d) {
            });

slice.selectAll("rect")
    .transition()
    .delay(function (d) {return Math.random()*1000;})
    .duration(1000)
    .attr("y", function(d) { return yScale(d.y); })
    .attr("height", function(d) { return height - yScale(d.y); });



legend = svg.selectAll(".legend")
    .data(newData[0].values.map(function(d) { return d.x1; }))
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d,i) { return "translate(0," + i * 20 + ")"; })
    .style("opacity","0");

legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function(d) { return color(d); });

legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) {return d; });

legend.transition().duration(500).delay(function(d,i){ return 1300 + 100 * i; }).style("opacity","1");
    

}