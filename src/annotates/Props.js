import {AnnotationGenerator} from "@palerock/annotate-js";
import {ExtraDescribe} from "./Extra";

export class PropDescribe extends ExtraDescribe{

    propMap = {};

    configProperty(target, fieldName, fieldValue, configurationMap) {
        super.configProperty(target, fieldName, fieldValue, configurationMap);
        this.propMap[fieldName] = fieldValue;
        this.parsePropMap(configurationMap);
    }

    parsePropMap(result = {}) {
        result.props = {...result.props, ...this.propMap};
    }
}

export const Props = AnnotationGenerator.generate(PropDescribe);