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

import { monitoredEntitiesClient } from '@dynatrace-sdk/client-classic-environment-v2';

export default async function () {

  const services = await monitoredEntitiesClient.getEntities({ entitySelector: "type(\"SERVICE\")"});

  const finalResult = services.entities.map((s, i) => {
    return {
      id: s.entityId,
      data: {
        label: s.displayName
      },
      position: { x: 600 * Math.sin(i), y: 600 * Math.cos(i)}, // create a ring layout
      style: { 
        border: '2px solid #777',
        borderRadius: '5%',
        backgroundColor: '#585a8b80',
        overflow: 'hidden',
        color: '#fff'
      }
    }
  });

  return { nodes: finalResult};
}
