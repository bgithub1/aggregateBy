

This is my version of a Scott Sauyet's stackoverflow solution to the question:

http://stackoverflow.com/questions/14446511/what-is-the-most-efficient-method-to-groupby-on-a-javascript-array-of-objects 

See the example below 

`````javascript

// Group an array of json objects by values of fields in the object, creating
//  sum, sumProduct and/or weighted average totalling fields.
// You will effectively create the "flattened" output of a pivot table.

// EXAMPLE:

//  Let's say you have an array of json objects:

var data = [

    { Phase: "p1", Step: "s1", Task: "t1", Qty: "5",tv:"10",Price:3.51},
    { Phase: "p1", Step: "s1", Task: "t2", Qty: "10",tv:"20",Price:3.52 },
    { Phase: "p1", Step: "s2", Task: "t1", Qty: "15",tv:"100",Price:3.53 },
    { Phase: "p1", Step: "s2", Task: "t2", Qty: "20",tv:"200",Price:3.54 },
    { Phase: "p2", Step: "s1", Task: "t1", Qty: "25",tv:"1000",Price:3.55 },
    { Phase: "p2", Step: "s1", Task: "t2", Qty: "30",tv:"2000",Price:3.56 },
    { Phase: "p2", Step: "s2", Task: "t1", Qty: "35",tv:"10000",Price:3.57 },
    { Phase: "p2", Step: "s2", Task: "t2", Qty: "40",tv:"20000",Price:3.58 }
];

//  Let's say you want to get those json objects totalled by Phase and Step:
    var groupByCols = ["Phase","Step"]; // group the objects by Phase and Step
    var totallingArray = [
      ["Qty",["Qty"]],
    ];  // total the objects by Qty

//  Now, create a new array that will have 4 objects
    var aggregatedDataArray = tableSumProduct(data,groupByCols,totallingArray);

//  Now, let's create a new array with a new field called QtyPrice, which is the sumProduct of Qty
//    and Price, grouped by Phase and Step
    totallingArray = [
      ["Qty",["Qty"]],
      ["QtyPrice",["Price","Qty"]],
    ];
    aggregatedDataArray = tableSumProduct(data,groupByCols,totallingArray);    

//  Now, let's create yet another array where Price is the weighted average Price, and
//    Qty is the sum of Qty's for each grouping of Phase and Step
    totallingArray = [
      ["Qty",["Qty"]],
      ["QtyPrice",["Price","Qty"]],
    ];
    aggre
    gatedDataArray = tableWeightedAverage(data,groupByCols,totallingArray);    

//  see testJs.js for this code in use.
`````
