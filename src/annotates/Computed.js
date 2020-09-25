import {AnnotationGenerator} from "@palerock/annotate-js";
import {ExtraDescribe} from "./Extra";

export class ComputedDescribe extends ExtraDescribe {

    computedMap = {};

    configProperty(target, fieldName, fieldValue, configurationMap) {
        super.configProperty(target, fieldName, fieldValue, configurationMap);
        this.computedMap[fieldName] = fieldValue;
        this.parseComputedMap(configurationMap);
    }

    parseComputedMap(result = {}) {
        result.computed = {...result.computed, ...this.computedMap};
    }
}

export const Computed = AnnotationGenerator.generate(ComputedDescribe);