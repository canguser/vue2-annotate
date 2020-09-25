import {AnnotationGenerator} from "@palerock/annotate-js";
import {ExtraDescribe} from "./Extra";
import {utils} from "./utils";

export class ComputedDescribe extends ExtraDescribe {

    computedMap = {};

    configProperty(target, fieldName, fieldValue, configurationMap) {
        super.configProperty(target, fieldName, fieldValue, configurationMap);
        this.computedMap[fieldName] = fieldValue;
        this.parseComputedMap(configurationMap);
    }

    parseComputedMap(result = {}) {

        const getterMap = {};
        const setterMap = {};
        const mappedProperties = [];

        if (this.target) {
            const getterProperties = Object.entries(
                utils.getDescriptors(this.target, {filter: ([, descriptor]) => descriptor && 'get' in descriptor})
            );
            const setterProperties = Object.entries(
                utils.getDescriptors(this.target, {filter: ([, descriptor]) => descriptor && 'set' in descriptor})
            );
            getterProperties.forEach(([name, descriptor]) => {
                getterMap[name] = {get: descriptor.get};
                if (!mappedProperties.includes(name)) {
                    mappedProperties.push(name);
                }
            });
            setterProperties.forEach(([name, descriptor]) => {
                setterMap[name] = {set: descriptor.set};
                if (!mappedProperties.includes(name)) {
                    mappedProperties.push(name);
                }
            });
        }

        const computedMap = {};

        for (const property of mappedProperties) {
            computedMap[property] = {
                ...getterMap[property],
                ...setterMap[property]
            }
        }

        result.computed = {...result.computed, ...this.computedMap, ...computedMap};
    }
}

export const Computed = AnnotationGenerator.generate(ComputedDescribe);