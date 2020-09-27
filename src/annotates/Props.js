import {AnnotationGenerator} from "@palerock/annotate-js";
import {ExtraDescribe} from "./Extra";

export class PropDescribe extends ExtraDescribe {

    propertyEntry = [];

    constructor() {
        super();
        Object.assign(this.params, {
            name: '',
            model: false,
            changeEvent: 'change'
        });
    }

    get defaultKey() {
        return 'name';
    }

    configProperty(target, fieldName, fieldValue, configurationMap) {
        super.configProperty(target, fieldName, fieldValue, configurationMap);
        this.propertyEntry = [fieldName, fieldValue];
        this.parsePropMap(configurationMap);
    }

    parsePropMap(result = {}) {
        const {name, model, changeEvent} = this.params;
        const [fieldName, fieldValue] = this.propertyEntry;
        console.log(name);
        const propsName = name || fieldName;
        result.props = {...result.props, ...{[propsName]: fieldValue}};

        if (name && name !== fieldName) {
            // using two ways
            result.computed = {
                ...result.computed,
                [fieldName]: {
                    get() {
                        return this[name];
                    },
                    set(value) {
                        this.$emit(changeEvent, value);
                    }
                }
            };
        }

        if (model && !result.model) {
            result.model = {
                prop: propsName,
                event: changeEvent
            }
        }
    }
}

export const Props = AnnotationGenerator.generate(PropDescribe);