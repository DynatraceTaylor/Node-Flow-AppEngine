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

export const createEntitiesIdSelector = (ids: string[]): string => {
    let result = "entityId(";

    if(!ids || ids.length < 1) {
        result += ")";
        return result;
    }

    for (let i = 0; i < ids.length; i++) {
        result += "\"" + ids[i] + "\"";
        if(ids.length > 1 && i < ids.length - 1) {
            result += ",";
        }
    }

    result += ")";

    return result;
};