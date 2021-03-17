let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"

let data = []
let xScale
let yScale

let req = new XMLHttpRequest()

let h = 600
let w = 1000
let padding = 80


let svg = d3.select("body")



let generateCanvas = ()=>{
svg = svg.append("svg")
.attr("height", h)
.attr("width", w)
}

let generateScales = ()=>{
  
  
xScale = d3.scaleLinear().range([padding, w-padding]).domain([d3.min(data, (item)=>item["Year"]-1), d3.max(data, (item)=>item["Year"]+2)])
  
yScale = d3.scaleTime().range([padding, h-padding]).domain([d3.min(data, (item)=>new Date(item["Seconds"]*1000)), d3.max(data, (item)=> new Date(item["Seconds"]*1000))])
}

let generateAxes = ()=>{
let xAxis = d3.axisBottom(xScale)
              .tickFormat(d3.format("d"))
svg.append("g")
  .call(xAxis)
  .attr("transform", "translate(50," + (h-padding) + ")")
  .attr("color", "white")
  .attr("id", "x-axis")
  
let yAxis = d3.axisLeft(yScale)
              .tickFormat(d3.timeFormat("%M:%S"))
svg.append("g")
  .call(yAxis)
  .attr("transform", "translate(" + (padding+50) + ",0)")
  .attr("color", "white")
  .attr("id", "y-axis")
  
}

let scatterplots = function(){
  
  svg.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("class", "dot")
  .attr("fill", function(item){
    if(item["Doping"] === ""){
      return "lightgreen"
    } else{
      return "orangered"
    }
  })
  .attr("r", "7")
  .attr("opacity", .7)
  .attr("stroke", "black")
  .attr("data-xvalue", (item)=>
    item["Year"])
  .attr("data-yvalue", (item)=>
    new Date(item["Seconds"] * 1000))
  .attr("cx", (item)=>xScale(item["Year"])+50)
  .attr("cy", (item)=>yScale(new Date(item["Seconds"]*1000)))  
  .on("mouseover", function(d,i){ d3.select(this).transition().duration(50).style("opacity", .5);
    
    div.transition().duration(50)
    .style("opacity", .85)
                                 
    div.attr("data-year", i["Year"]);
    
    div.html(i["Name"] + ": " + i["Nationality"] + "<br>" + "Year: " + i["Year"] + ", " + "Time: " + i["Time"] + ", " + "Place: " + i["Place"] + "<br>" + "<br>" + i["Doping"])
    .style("left", (event.pageX + 10) + "px")
    .style("top", (event.pageY + 10) + "px")
  }) 
  .on("mouseout", function(item, i){
  d3.select(this).transition()
  .duration(50)
  .style("opacity", .7);
    
    div.transition()
    .duration(50)
    .style("opacity", 0);
  })
  
svg.append("text")
  .attr("class", "y-label")
  .text("Time in Minutes")
  .attr("transform", "translate(" + padding + "," + (h/2) + ") rotate(-90)")
  .attr("fill", "white")
  
  let div = d3.select("body").append("div")
  .attr("id", "tooltip")
  .style("opacity", 0)
  
  svg.append("text")
  .text("No Doping")
  .attr("x", 897)
  .attr("y", h/2)
  .attr("fill", "white")
  .attr("id", "legend")
  
  svg.append("text")
  .text("Doping Allegation")
  .attr("x", 850)
  .attr("y", h/2+20)
  .attr("fill","white")
  .attr("id", "legend")
  
  svg.append("rect")
  .attr("height", 15)
  .attr("width", 15)
  .attr("fill", "orangered")
  .attr("x", 980)
  .attr("y", h/2+7)
  .attr("stroke", "black")
  .attr("opacity", .85)
  
  svg.append("rect")
  .attr("height", 15)
  .attr("width", 15)
  .attr("fill", "lightgreen")
  .attr("x", 980)
  .attr("y", h/2-12)
  .attr("stroke", "black")
  .attr("opacity", .85)
  
}






req.open("GET", url, true)
req.onload = ()=>{
  data = JSON.parse(req.responseText)
  console.log(data)
  generateCanvas()
  generateScales()
  generateAxes()
  scatterplots()
}

req.send()