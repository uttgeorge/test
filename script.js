


function myFunction() {
    console.log("Function called"); // prints "Function called" to the console
    // rest of the code here
}
var width = 60,
height = 40;

var color = d3.scaleOrdinal(d3.schemeCategory10);

var simulation = d3.forceSimulation()
	.force("link", d3.forceLink().id(function(d) {
    return d.id;
})).force("charge", d3.forceManyBody().strength(-50)).force("center", d3.forceCenter(innerWidth / 2, innerHeight / 2))
.alphaTarget(0.1);
// "graph_data_test2.json"
// Define a variable to hold the current file name
var fileName = 'data1.json';
function loadData(fileName) {
	const container = d3.select('#graph');
	container.html('');
d3.json(fileName,function(error, graph) {
    if (error) throw error;
	var nodes = graph.nodes;
		
	var links = graph.links;
	
    var svg = d3.select("#graph").append("svg").attr("width", 'auto').attr("height",window.innerHeight/2);

    var g = svg.append("g");

    var tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0).style("background-color", "#333333");

    var zoom_handler = d3.zoom().on("zoom", zoom_actions);
	
	
    zoom_handler(svg);
	
    function zoom_actions() {
        g.attr("transform", d3.event.transform);
        // Update the view box attribute based on the zoom scale
        svg.attr("viewBox",
        function() {
            var newX = -d3.event.transform.x;
            var newY = -d3.event.transform.y;
            var newWidth = window.innerWidth / d3.event.transform.k;
            var newHeight = window.innerHeight / 2 / d3.event.transform.k;
            return newX + " " + newY + " " + newWidth + " " + newHeight;
        });
    };
    var link = svg.append("g").selectAll(".link").data(graph.links).enter().append("line").attr("class", "link").style("stroke-width",
    function(d) {
        return Math.sqrt(d.value);
    }).attr("title",
    function(d) {
        return d.title;
    });

	// JS
	const date = ['202206','202207','202208','202209','202210','202211','202212','202301','202302']; // Your graph data
	const minDate = '202206';
	const maxDate = '202302';	 
	 
	// Create a slider step for each month in the range
	const monthsRange = getMonthRange(minDate, maxDate);
	const sliderSteps = monthsRange.map((month, index) => {
	  return {
	    value: index,
	    label: month,
	  };
	});
	// Create a scale for converting slider value to date
	const sliderScale = d3
	  .scaleLinear()
	  .domain([0, monthsRange.length - 1])
	  .range([0, 1])
	  .clamp(true);
	// Update selected month display
	function updateSelectedMonth(monthIndex) {
	  const month = monthsRange[monthIndex];
	  document.getElementById('selected-month').textContent = month;
	}
	function radiusScale(d) {
	    var pay = d;  // default to 1000 if no data available
	    return Math.sqrt(pay) / Math.PI;
	}
	// define function to get radius based on total_pay
	  const getRadius = (d, selectedDate = '202302') => {
		if (d.total_pay && typeof d.total_pay[selectedDate] !== 'undefined') {
		  return radiusScale(d.total_pay[selectedDate])
		} else {
		  return 2
		}
	  }

	
	// Add event listener to the slider bar
	d3.select('#month')
	  .attr('min', 0)
	  .attr('max', sliderSteps.length - 1)
	  .attr('step', 1)
	  .on('input', function () {
	    const sliderValue = this.value;
	    const t = sliderScale(sliderValue);
	    const selectedMonthIndex = Math.round(d3.interpolateNumber(0, monthsRange.length - 1)(t));
	    updateSelectedMonth(selectedMonthIndex);
		const selectedDate = monthsRange[selectedMonthIndex];
		node.attr("r", (d) => getRadius(d, selectedDate));
		// var idRow = tbody.insertRow();
		// var totalPayCell = idRow.insertCell();
		// totalPayCell.appendChild(document.createTextNode(node.total_pay[selectedDate]));
		// var neighborTotalRevenueCell = newRow.insertCell();
		// neighborTotalRevenueCell.appendChild(document.createTextNode(neighbor.total_pay[selectedDate]));
	  });
	
	function getMonthRange(start, end) {
	  const startYear = parseInt(start.slice(0, 4));
	  const startMonth = parseInt(start.slice(-2));
	  const endYear = parseInt(end.slice(0, 4));
	  const endMonth = parseInt(end.slice(-2));
	  const totalMonths = (endYear - startYear) * 12 + endMonth - startMonth + 1;
	  
	  const monthRange = [];
	  let currentMonthQ = start;
	  for (let i=0; i<totalMonths; i++) {
	    monthRange.push(currentMonthQ);
	    const q = currentMonthQ.slice(-2);
	    if (q === '12') {
	      currentMonthQ = `${parseInt(currentMonthQ.slice(0, 4))+1}01`;
	    } else {
	      const nextQNum = parseInt(q)+1;
	      const nextQ = nextQNum < 10 ? `0${nextQNum}` : `${nextQNum}`;
	      currentMonthQ = `${currentMonthQ.slice(0, -2)}${nextQ}`;
	    }
	  }
	  return monthRange;
	}
 //    // Add change listener to slider bar to update node sizes based on selected month
 //    const slider = document.getElementById("month");
 //    const output = document.getElementById("selected-month");
	
	
	  
    var node = svg.selectAll(".node")
	.data(graph.nodes)
	.enter()
	.append("circle")
	.attr("class", "node")
	.attr("r",(d) => getRadius(d, 0))
	.style("fill",
    function(d) {
        return color(d.group);
    }).call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)).on("click",
    function(d) {
        console.log(d.id); // log node id to console
        updateTable(d); // update table with clicked node info
    }); // .on('click', connectedNodes)
    // Add title to the link for displaying on hover
    link.append("title").text(function(d) {
        return d.title;
    });

    link.on("mouseover",
    function(d) {
        // Show tooltip with link title on mouseover
        tooltip.transition().duration(200).style("opacity", .9);
        tooltip.html(d.title).style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY - 28) + "px");
    }).on("mouseout",
    function(d) {
        // Hide tooltip on mouseout
        tooltip.transition().duration(500).style("opacity", 0);
    });

    node.append("title").text(function(d) {
        return d.id;
    });

    function updateTable(node) {
        var table = document.getElementById("connectionsTable");
        var tbody = document.getElementById("table-body");
		table.style.width = "100%";
		table.style.fontSize = "12px";
        // Clear the current contents of the table
        tbody.innerHTML = "";

        // Create a new row for the clicked node
        var newRow = tbody.insertRow();
        var titleCell = newRow.insertCell();
        titleCell.colSpan = "6";
        titleCell.style.fontWeight = "bold";
        // titleCell.appendChild(document.createTextNode("查询公司名： " + node.id));
		// Display the ID and details of selected node
		var idRow = tbody.insertRow();
		idRow.style.fontWeight = "bold";
		var idCell = idRow.insertCell();
		
		idCell.appendChild(document.createTextNode("查询公司名： " + node.id));
		var emailCell = idRow.insertCell();
		emailCell.appendChild(document.createTextNode(node.emails));
		var phoneNumCell = idRow.insertCell();
		phoneNumCell.appendChild(document.createTextNode(node.phone_nums));
		var idCardCell = idRow.insertCell();
		idCardCell.appendChild(document.createTextNode(node.legal_ids));
		var addressCell = idRow.insertCell();
		addressCell.appendChild(document.createTextNode(node.organ_address));
		var ipCell = idRow.insertCell();
		ipCell.appendChild(document.createTextNode(node.ip));
		
		
		
		// Add one row to merge all five cells
		var allDetailsRow = tbody.insertRow();
		var allDetailsCell = allDetailsRow.insertCell();
		allDetailsCell.colSpan = "6";
		allDetailsCell.style.textAlign = "center";
		allDetailsCell.style.backgroundColor = "#f2f2f2";
		allDetailsCell.style.color = "black";
		allDetailsCell.appendChild(document.createTextNode("以下为关联公司"));
		// titleCell.appendChild(document.createTextNode("查询公司名： " + node.id));
		
        // Search for all links connected to the clicked node
        graph.links.forEach(function(link) {
            if (link.source === node || link.target === node) {
                var neighbor = (link.source === node ? link.target: link.source);
                var newRow = tbody.insertRow();
                var nodeIdCell = newRow.insertCell();
                nodeIdCell.appendChild(document.createTextNode(neighbor.id));
                var sameEmailCell = newRow.insertCell();
                sameEmailCell.appendChild(document.createTextNode(link.title === "same email" ? link.details: ""));
                var samePhoneNumCell = newRow.insertCell();
                samePhoneNumCell.appendChild(document.createTextNode(link.title === "same phone num" ? link.details: ""));
                var sameOwnerIdCell = newRow.insertCell();
                sameOwnerIdCell.appendChild(document.createTextNode(link.title === "same id card num" ? link.details: ""));
                var similarAddressCell = newRow.insertCell();
                similarAddressCell.appendChild(document.createTextNode(graph.nodes.filter(n => n.id === neighbor.id)[0].organ_address));
				var sameIpCell = newRow.insertCell();
				sameIpCell.appendChild(document.createTextNode(link.title === "same IP" ? link.details: ""));
				
            }
        });
    }

	function highlight_input_node(d) {
	    // Highlight all connected nodes and edges on click
	    var neighbors = getNeighbors(d);
	    node.classed('highlight',
	    function(o) {
	        return neighbors.indexOf(o.id) >= 0;
	    });
	    link.classed('highlight',
	    function(o) {
	        return o.source.id === d.id || o.target.id === d.id;
	    });
		// document.getElementById("node-input").value = d.id;
	    updateTable(d);
	
	
	}
	
	
	const fuse = new Fuse(graph.nodes, { keys: ["id"] });
	var searchBtn = document.getElementById('search-btn')
	
	searchBtn.addEventListener("click", function () {
	  var inputNode = document.getElementById('node-search').value;
	
	  // Search for nodes matching the query
	  const results = fuse.search(inputNode);
	    var matchnode = results.map((result) => result.item.id)
	var selectedNode = nodes.find(function(n) {
	    return n.id === matchnode[0];
	});
	     if (selectedNode) {
	         // Highlight the selected node and its connected nodes and edges
	         // highlight_input_node(inputNode);
	 		highlight_input_node(selectedNode);
	     }
	});
	
	
    node.on("mouseover",
    function(d) {
        // Show tooltip with node title on mouseover
        tooltip.transition().duration(200).style("opacity", .9);
        tooltip.html(d.id).style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY - 28) + "px");
    }).on("mouseout",
    function(d) {
        // Hide tooltip on mouseout
        tooltip.transition().duration(500).style("opacity", 0);
    }).on("click",
    function(d) {
        // Highlight all connected nodes and edges on click
        var neighbors = getNeighbors(d);
        node.classed('highlight',
        function(o) {
            return neighbors.indexOf(o.id) >= 0;
        });
        link.classed('highlight',
        function(o) {
            return o.source.id === d.id || o.target.id === d.id;
        });
		// document.getElementById("node-input").value = d.id;
        updateTable(d);
		// Center the selected node
		const desiredTransform = d3.zoomIdentity
		  .translate(window.innerWidth / 2 - d.x, window.innerHeight / 4 - d.y)
		  .scale(0.5);
		svg.transition()
		  .duration(750)
		  .call(zoom_handler.transform, desiredTransform);
    });

 

    // Define the function to get neighbors of a node
    function getNeighbors(node) {
        return graph.links.reduce(function(neighbors, link) {
            if (link.source.id === node.id) {
                neighbors.push(link.target.id);
            } else if (link.target.id === node.id) {
                neighbors.push(link.source.id);
            }
            return neighbors;
        },
        []);
    }

    simulation.nodes(graph.nodes).on("tick", ticked);

    simulation.force("link").links(graph.links);

    var circle = g.selectAll("circle").data(graph.nodes).enter().append("circle").attr("r", 5).attr("fill",
    function(d) {
        return color(d.group);
    }).call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)).on("mouseover",
    function(d) {
        d3.select(this).transition().duration(200).attr("r", 10);
    }).on("mouseout",
    function(d) {
        d3.select(this).transition().duration(200).attr("r", 5);
    });
    circle.on("click",
    function(d) {

        var connectedNodes = graph.links.filter(function(l) {
            return l.target.id === d.id || l.source.id === d.id;
        }).nodes();
        link.style("stroke-opacity", 0.1);
        link.filter(function(l) {
            return l.target.id === d.id || l.source.id === d.id;
        }).style("stroke-opacity", 1);

        circle.style("opacity", 0.2);
        connectedNodes.forEach(function(node) {
            circle.filter(function(d) {
                return d.id == node.id;
            }).style("opacity", 1);
        });
        tooltip.transition().duration(200).style("opacity", .9);
        tooltip.html(d.title).style("left", (d3.event.pageX + 5) + "px").style("top", (d3.event.pageY - 28) + "px");
    });

    circle.on("mouseout",
    function(d) {
        tooltip.transition().duration(500).style("opacity", 0);
    });

    // Define the function to check if two nodes are connected
    function isConnected(a, b) {
        return graph.links.some(function(d) {
            return (d.source === a && d.target === b) || (d.source === b && d.target === a);
        });
    }

    // Define the function for selecting connected nodes and edges and highlight them
    function connectedNodes() {
        var node = d3.select(this);
        var index = node.attr("r");
        var selectedNode = this;
        var selectedData = d3.select(node.node().__data__);
        var links = svg.selectAll(".link");
        var nodes = svg.selectAll(".node");

        // Set opacity to non-selected nodes/edges
        nodes.style("opacity",
        function(o) {
            return isConnected(selectedData, o) | isConnected(o, selectedData) ? 1 : 0.1;
        });
        links.style("opacity",
        function(o) {
            return o.source === selectedData || o.target === selectedData ? 1 : 0.1;
        });

        // Highlight selected nodes and edges
        nodes.classed("selected",
        function(o) {
            return o === selectedData;
        });
        links.classed("highlight",
        function(o) {
            return o.source === selectedData || o.target === selectedData;
        });
    }

    function ticked() {
        link.attr("x1",
        function(d) {
            return d.source.x;
        }).attr("y1",
        function(d) {
            return d.source.y;
        }).attr("x2",
        function(d) {
            return d.target.x;
        }).attr("y2",
        function(d) {
            return d.target.y;
        });

        node.attr("cx",
        function(d) {
            return d.x;
        }).attr("cy",
        function(d) {
            return d.y;
        });
    }

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
	
	// Create a function to get the monthly total pay of the selected node and its connected nodes
	function getMonthlyTotalPays(nodeId, graph) {
	  // Assuming your graph data structure has a method to get connected nodes
	  const connectedNodes = getNeighbors(nodeId);
	
	  // Get data for the selected node and its connected nodes
	  const nodesData = [nodeId, ...connectedNodes].map((id){
		return graph.getNodeData(id);  
	  });
		
	  
	  // Calculate monthly total pays
	  const monthlyTotalPays = nodesData.reduce((monthlyPays, nodeData) => {
	    nodeData.payments.forEach((payment) => {
	      const month = new Date(payment.date).getMonth();
	      if (monthlyPays[month]) {
	        monthlyPays[month] += payment.total_pay;
	      } else {
	        monthlyPays[month] = payment.total_pay;
	      }
	    });
	    return monthlyPays;
	  }, {});
	  
	  return monthlyTotalPays;
	  }
	  
	  // Create a function to draw the bar chart
	  function drawBarChart(monthlyTotalPays) {
	    const ctx = document.getElementById('myChart').getContext('2d');
	    const labels = Object.keys(monthlyTotalPays).map((month) => `Month ${parseInt(month) + 1}`);
	    const data = Object.values(monthlyTotalPays);
	  
	    new Chart(ctx, {
	      type: 'bar',
	      data: {
	        labels: labels,
	        datasets: [{
	          label: 'Total Pay',
	          data: data,
	          backgroundColor: 'rgba(75, 192, 192, 0.2)',
	          borderColor: 'rgba(75, 192, 192, 1)',
	          borderWidth: 1
	        }]
	      },
	      options:scales: {
					y: {
					  beginAtZero: true
					}
				  }
				}
			  });
			}
			
		// Add an event listener to handle node clicks
		function onNodeClick(event) {
		  const nodeId = event.target.id; // Assuming the node's id is stored in the 'id' attribute
		
		  const monthlyTotalPays = getMonthlyTotalPays(nodeId, graph);
		  drawBarChart(monthlyTotalPays);
		}
		
		// Assuming you have a way to get all the nodes, loop through and add the event listener
		const nodes = graph.getAllNodes();
		nodes.forEach((node) => {
		  node.addEventListener('click', onNodeClick);
		});
		  
		  
});
}


loadData('data1.json');

// Add event listeners to each of your tab buttons, and update variables as needed
document.querySelector('#tab-1-btn').addEventListener('click', function() {
  fileName = 'data1.json';
  loadData(fileName);
});

document.querySelector('#tab-2-btn').addEventListener('click', function() {
  fileName = 'data2.json';
  loadData(fileName);
});


