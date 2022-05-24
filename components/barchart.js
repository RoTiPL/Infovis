// https://bl.ocks.org/LyssenkoAlex/21df1ce37906bdb614bbf4159618699d

function barchart(div, tt, data, x0Var, x1Var) {
    let margin = {
        top: 10, right: 170, bottom: 40, left: 30
    }
    let width=700, height=500;
    let svg, xAxis, yAxis, legend, x0Scale, x1Scale, yScale


    d3.select("#barchart_svg").remove();
    x0Scale = d3.scaleBand();
    x1Scale = d3.scaleBand();
    yScale = d3.scaleLinear();

    svg = d3.select(div).append("svg")
        .attr('id', 'barchart_svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr('style', 'margin:0 auto; display: block')
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)


    let x0 = x0Var
    let x1 = x1Var

    let x0Label = [...(new Set(data.map(d => d[x0])))].sort()
    let x1Label = [...(new Set(data.map(d => d[x1])))].sort()
    let yLabel = []

    x0Scale.domain(x0Label).rangeRound([0, width], .5).padding(.15)
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
    yScale.rangeRound([height, 0])

    xAxis = d3.axisBottom().scale(x0Scale)
    yAxis = d3.axisLeft().scale(yScale);
    const color = d3.scaleOrdinal(d3.schemeTableau10)

    yMax = d3.max(yLabel, function(d){ return d3.max(d); })
    yScale.domain([0, yMax+2])
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

    const tooltip = d3.select(tt)

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
                .on("mouseover", function(e,d) {
                    tooltip.select(".tooltip-inner").html(d.y)

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
                })
                .on("mouseout", function(d) {
                    tooltip.style("display", "none");
                });

    slice.selectAll("rect")
        .transition()
        .delay(function (d) {return Math.random()*1000;})
        .duration(1000)
        .attr("y", function(d) { return yScale(d.y); })
        .attr("height", function(d) { return height - yScale(d.y); })
        .attr("class", "")



    legend = svg.selectAll(".legend")
        .data(newData[0].values.map(function(d) { return d.x1; }))
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d,i) { return `translate(160, ${i * 20 })`; })
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