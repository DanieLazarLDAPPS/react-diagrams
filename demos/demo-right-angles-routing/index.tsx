import {
	DiagramEngine,
	DiagramModel,
	DefaultNodeModel,
	LinkModel,
	DefaultPortModel,
	DiagramWidget,
	RightAngleLinkFactory, DefaultLinkModel,
} from "storm-react-diagrams";
import * as React from "react";
import { DemoWorkspaceWidget } from "../.helpers/DemoWorkspaceWidget";
import { action } from "@storybook/addon-actions";

export class LabViewLinkModel extends DefaultLinkModel {
	constructor() {
		super("rightAngle");
	}
}

export class LabViewPortModel extends DefaultPortModel {
	createLinkModel(): LabViewLinkModel | null {
		return new LabViewLinkModel();
	}
}

export default () => {
	// setup the diagram engine
	const engine = new DiagramEngine();
	engine.installDefaultFactories();
	engine.registerLinkFactory(new RightAngleLinkFactory());

	// setup the diagram model
	const model = new DiagramModel();

	// create four nodes in a way that straight links wouldn't work
	const node1 = new DefaultNodeModel("Node A", "rgb(0,192,255)");
	const port1 = node1.addPort(new LabViewPortModel(false, "out-1", "Out"));
	node1.setPosition(340, 350);

	const node2 = new DefaultNodeModel("Node B", "rgb(255,255,0)");
	const port2 = node2.addPort(new LabViewPortModel(false, "out-1", "Out"));
	node2.setPosition(240, 80);
	const node3 = new DefaultNodeModel("Node C", "rgb(192,255,255)");
	const port3 = node3.addPort(new LabViewPortModel(true, "in-1", "In"));
	node3.setPosition(540, 180);
	const node4 = new DefaultNodeModel("Node D", "rgb(192,0,255)");
	const port4 = node4.addPort(new LabViewPortModel(true, "in-1", "In"));
	node4.setPosition(95, 185);

	// linking things together
	const link1 = port1.link(port4);
	const link2 = port2.link(port3);

	// add all to the main model
	model.addAll(node1, node2, node3, node4, link1, link2);

	// load model into engine and render
	engine.setDiagramModel(model);

	return (
		<DemoWorkspaceWidget
			buttons={
				<button
					onClick={() => {
						action("Serialized Graph")(JSON.stringify(model.serializeDiagram(), null, 2));
					}}
				>
					Serialize Graph
				</button>
			}
		>
			<DiagramWidget
				className="srd-demo-canvas"
				diagramEngine={engine}
				smartRouting={true}
			/>
		</DemoWorkspaceWidget>
	);
};
