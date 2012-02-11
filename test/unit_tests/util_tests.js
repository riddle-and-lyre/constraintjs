module("Util");

test('Graph', function() {
	var graph = cjs.create("graph");

	var contains = function(arr, obj) {
		return arr.some(function(x) {
			return x == obj;
		});
	};

	var n1 = graph.create_node(); n1.name = "n1";
	var n2 = graph.create_node(); n2.name = "n2";
	var n3 = graph.create_node(); n3.name = "n3";
	var n4 = graph.create_node(); n4.name = "n4";
	var n5 = graph.create_node(); n5.name = "n5";
	
	graph.addEdge(n1, n2);
	graph.addEdge(n3, n4);
	graph.addEdge(n2, n3);

	
	ok(graph.hasNode(n1));
	
	ok(graph.hasEdge(n1, n2));
	ok(!graph.hasEdge(n1, n3));
	
	var e = graph.getEdge(n3, n4);
	ok(graph.hasEdge(n3, n4));
	ok(contains(n3.outgoingEdges, e));
	ok(contains(n4.incomingEdges, e));
	graph.removeEdge(n3, n4);
	ok(!graph.hasEdge(n3, n4));
	ok(!contains(n3.outgoingEdges, e));
	ok(!contains(n4.incomingEdges, e));

	graph.addEdge(n2,n5);
	ok(n2.pointsAt()[0]==n3 && n2.pointsAt()[1]==n5 && n2.pointsAt().length==2);
	graph.removeEdge(n2,n5);

	var n1n2 = graph.getEdge(n1,n2);
	var n2n3 = graph.getEdge(n2,n3);
	
	ok(graph.hasNode(n2));
	ok(contains(n1.outgoingEdges, n1n2));
	ok(contains(n2.incomingEdges, n1n2));
	ok(contains(n2.outgoingEdges, n2n3));
	ok(contains(n3.incomingEdges, n2n3));
	ok(graph.hasEdge(n1n2));
	ok(graph.hasEdge(n2n3));
	graph.removeNode(n2);
	//ok(!graph.hasNode(n2));
	ok(!contains(n1.outgoingEdges, n1n2));
	ok(!contains(n2.incomingEdges, n1n2));
	ok(!contains(n2.outgoingEdges, n2n3));
	ok(!contains(n3.incomingEdges, n2n3));
	ok(!graph.hasEdge(n1n2));
	ok(!graph.hasEdge(n2n3));
	/**/
});


test('Constraint Solver', function() {
	var equalSets = function (set1, set2) {
		if(set1.length!=set2.length) return false;
		for(var i = 0; i<set1.length; i++) {
			if(!cjs._.contains(set2, set1[i])) return false;
		}
		return true;
	}
	
	var constraintSolver = cjs._constraint_solver;
	
	var o1 = {name:'o1'};
	var o2 = {name:'o2'};
	var o3 = {name:'o3'};
	var o4 = {name:'o4'};
	var o5 = {name:'o5'};
	var o6 = {name:'o6'};
	
	constraintSolver.addObject(o1);
	constraintSolver.addObject(o2);
	constraintSolver.addObject(o3);
	constraintSolver.addObject(o4);
	constraintSolver.addObject(o5);
	constraintSolver.addObject(o6);
	
	constraintSolver.addDependency(o1, o2);
	constraintSolver.addDependency(o4, o5);
	
	ok(equalSets(constraintSolver.immediatelyDependentOn(o1), [o2]));
	constraintSolver.removeObject(o2);	
	ok(equalSets(constraintSolver.immediatelyDependentOn(o1), []));
	
	constraintSolver.addObject(o2);
	constraintSolver.addDependency(o1, o2);
	constraintSolver.addDependency(o2, o3);
	constraintSolver.addDependency(o2, o4);
	ok(equalSets(constraintSolver.immediatelyDependentOn(o2), [o3, o4]));
	constraintSolver.removeObject(o4);
	ok(equalSets(constraintSolver.immediatelyDependentOn(o2), [o3]));
	constraintSolver.addObject(o4);
	constraintSolver.addDependency(o2,o4);
	ok(equalSets(constraintSolver.immediatelyDependentOn(o2), [o3, o4]));
	constraintSolver.removeDependency(o2,o4);
	ok(equalSets(constraintSolver.immediatelyDependentOn(o2), [o3]));
	
	/**/
});

test('FSM', function() {
	var fsm = cjs.create("fsm");
	var state1 = fsm.add_state("state1");
	var state2 = fsm.add_state("state2");

	fsm.set_state("state1");


	console.log(fsm, state1, state2);
});
