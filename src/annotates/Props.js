import {AnnotationGenerator} from "@palerock/annotate-js";
import {ExtraDescribe} from "./Extra";

export class PropDescribe extends ExtraDescribe {

    propertyEntry = [];

    constructor() {
        super();
        Object.assign(this.params, {
            model: false,
            changeEvent: 'change'
        });
    }

    get defaultKey() {
        return 'model';
    }

    configProperty(target, fieldName, fieldValue, configurationMap) {
        super.configProperty(target, fieldName, fieldValue, configurationMap);
        this.propertyEntry = [fieldName, fieldValue];
        this.parsePropMap(configurationMap);
    }

    parsePropMap(result = {}) {
        const {model, changeEvent} = this.params;
        const [fieldName, fieldValue] = this.propertyEntry;
        result.props = {...result.props, ...{[fieldName]: fieldValue}};
        if (model && !result.model) {
            result.model = {
                prop: fieldName,
                event: changeEvent
            }
        }
    }
}

export const Props = AnnotationGenerator.generate(PropDescribe);