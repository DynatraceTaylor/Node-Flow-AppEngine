/**
 * @license
 * Copyright 2023 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Flex, Page } from "@dynatrace/wave-components-preview";
import { Text } from "@dynatrace/wave-components-preview/typography";
import { functions } from "@dynatrace/util-app";
import {
  FormField,
  Select,
  SelectedKeys,
  SelectOption,
} from "@dynatrace/wave-components-preview/forms";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";

import "reactflow/dist/style.css";

const minimapStyle = {
  height: 120,
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const Flow = () => {
  const [loaded, setLoaded] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  const [selectedService, setSelectedService] = useState<SelectedKeys | null>(null);
  const [services, setServices] = useState<Array<Node>>([]);
  const { setViewport } = useReactFlow();

  // Run load nodes on page load to populate service selection box
  useEffect(() => {
    loadNodes();
  }, [loaded]);

  // Load nodes from the `get-entities` serverless function
  const loadNodes = async () => {
    setNodes(initialNodes);
    setEdges(initialEdges);

    await functions
      .call("get-entities")
      .then((response) => response.text())
      .then((result) => {
        const res = JSON.parse(result);
        setServices(res.nodes);
        setLoaded(true);
      });
  };

  // Create entries for the service selector
  const options = useMemo(() => {
    return services.map((service) => ({
      id: service.id,
      text: service.data.label,
    }));
  }, [services]);

  // Fetch all related services for the selected service in the service selection
  useMemo(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    functions
      .call("get-entity-relations", selectedService)
      .then((response) => response.text())
      .then((result) => {
        const res = JSON.parse(result);
        setNodes(res.nodes);
        setEdges(res.edges);
      })
      .then(() => handleTransform());
  }, [selectedService, setEdges, setNodes]);

  // Setting the view port of the viz
  const handleTransform = useCallback(() => {
    setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 800 });
  }, [setViewport]);

  return (
    <Page variant="centered">
      <Page.Header>
        <Text>Flow Demo</Text>
        <FormField label="Select a service">
          <Select selectedId={selectedService} onChange={setSelectedService}>
            {options.map((el) => (
              <SelectOption id={el.id} key={el.id}>
                {el.text}
              </SelectOption>
            ))}
          </Select>
        </FormField>
      </Page.Header>
      <Page.Main>
        <Flex width={"100%"} height={800}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            fitView
            attributionPosition="top-right"
          >
            <MiniMap style={minimapStyle} zoomable pannable />
            <Controls />
            <Background color="#aaa" gap={16} />
          </ReactFlow>
        </Flex>
      </Page.Main>
    </Page>
  );
};

export const App = () => (
  <ReactFlowProvider>
    <Flow />
  </ReactFlowProvider>
);
