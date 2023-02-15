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

import { monitoredEntitiesClient } from "@dynatrace-sdk/client-classic-environment-v2";
import { createEntitiesIdSelector } from "./entity-helper";

export default async function (payload: string = undefined) {
  if (!payload) {
    return {};
  }

  const curServiceId = payload[0];

  const details = await monitoredEntitiesClient.getEntity({
    entityId: curServiceId,
  });

  let fromCalls: string[] = [];
  if (details.fromRelationships && details.fromRelationships["calls"]) {
    fromCalls = details.fromRelationships["calls"]
      .filter((c) => {
        return c.type === "SERVICE";
      })
      .map((c) => {
        return c.id;
      });
  }

  let toCalls: string[] = [];
  if (details.toRelationships && details.toRelationships["calls"]) {
    toCalls = details.toRelationships["calls"]
      .filter((c) => {
        return c.type === "SERVICE";
      })
      .map((c) => {
        return c.id;
      });
  }

  let nodeIds: string[] = [];
  nodeIds = nodeIds.concat(curServiceId, fromCalls, toCalls);
  const entityQuery = createEntitiesIdSelector(nodeIds);

  const nodeData = await monitoredEntitiesClient.getEntities({
    entitySelector: entityQuery,
  });

  const dict = {};
  nodeData.entities.forEach((e) => {
    dict[e.entityId] = e.displayName;
  });

  const nodes = nodeData.entities.map((s, i) => {
    return {
      id: s.entityId,
      data: {
        label: s.displayName,
      },
      position: { x: 600 * Math.sin(i), y: 600 * Math.cos(i) },
      style: {
        border:
          s.entityId.toUpperCase() === curServiceId.toUpperCase()
            ? "3px solid #910ac2"
            : "2px solid #718ea8",
        borderRadius: "5%",
        backgroundColor: "#585a8b80",
        overflow: "hidden",
        color: "#fff",
      },
    };
  });

  const edges = [];

  for (const fromCall of fromCalls) {
    edges.push({
      id: fromCall + "-" + curServiceId,
      source: curServiceId,
      target: fromCall,
      animated: true,
      style: { stroke: "#00ff00" },
    });
  }
  for (const toCall of toCalls) {
    edges.push({
      id: curServiceId + "-" + toCall,
      source: toCall,
      target: curServiceId,
      animated: true,
      style: { stroke: "#ff0000" },
    });
  }

  return { nodes, edges };
}
