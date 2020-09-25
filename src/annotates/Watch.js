import {AnnotationGenerator} from "@palerock/annotate-js";
import {ExtraDescribe} from "./Extra";

export class WatchDescribe extends ExtraDescribe {
    constructor() {
        super();
        Object.assign(this.params, {
            property: '',
            deep: false,
            immediate: false
        });
    }

    watchMap = {};

    get defaultKey() {
        return 'property';
    }

    get watchProperty() {
        return this.params.property;
    }

    applyProperty(property) {
        super.applyProperty(property);
        const originName = this.params.property;
        this.params.property = originName || property.name.replace(/^\$\$/, '');
    }

    configProperty(target, fieldName, fieldValue, configurationMap) {
        super.configProperty(target, fieldName, fieldValue, configurationMap);
        const {deep, immediate} = this.params;
        const propertyKey = this.watchProperty;
        if (!this.watchMap[propertyKey]) {
            this.watchMap[propertyKey] = [];
        }
        if (typeof fieldValue === 'object') {
            this.watchMap[propertyKey].push(
                {
                    ...fieldValue,
                    deep, immediate
                }
            );
        } else if (['function', 'string'].includes(typeof fieldValue)) {
            this.watchMap[propertyKey].push({
                handler: fieldValue,
                deep, immediate
            });
        }
        this.parseWatchMap(configurationMap);
    }

    parseWatchMap(result = {}) {
        result.watch = {...result.watch, ...this.watchMap};
    }
}

export const Watch = AnnotationGenerator.generate(WatchDescribe);