import {BasicAnnotationDescribe, AnnotationUtils, AnnotationGenerator} from "@palerock/annotate-js";
import {Extra} from "./Extra";
import {utils} from "./utils";

export class VueComponentDescribe extends BasicAnnotationDescribe {

    constructor() {
        super();
        Object.assign(this.params, {
            name: ''
        })
    }

    get defaultKey() {
        return 'name'
    }

    get componentName() {
        return this.name || this.classEntity.name;
    }

    storageClassDecorator(targetType) {
        super.storageClassDecorator(targetType);

        const target = new targetType();

        const valuePropertyFilter = ([, descriptor]) => descriptor && 'value' in descriptor;

        const propertyMap = AnnotationUtils.fromEntries(
            Object.entries(
                utils.getDescriptors(target, {filter: valuePropertyFilter})
            ).map(([name, descriptor]) => [name, descriptor.value])
        );

        const properties = this.classEntity.properties;

        this.dataMap = {};
        this.configurationMap = {};

        Object.keys(propertyMap).forEach(
            key => {
                const targetProperty = properties.find(property => property.name === key);
                let isDataOrMethod = true;
                if (targetProperty) {
                    if (targetProperty.hasAnnotations(Extra)) {
                        isDataOrMethod = false;
                        const extraList = targetProperty.getAnnotationsByType(Extra) || [];
                        extraList.sort((a, b) => {
                            return b.getParams('priority') - a.getParams('priority')
                        });
                        for (const extra of extraList) {
                            extra.configProperty(target, key, propertyMap[key], this.configurationMap);
                        }
                    }
                }
                if (isDataOrMethod) {
                    this.dataMap[key] = propertyMap[key];
                }
            }
        )
    }

    parseDataOrMethods(result = {}) {
        const methods = {};
        const data = {};
        Object.entries(this.dataMap).forEach(
            ([key, value]) => {
                if (typeof value === 'function') {
                    methods[key] = value;
                } else {
                    data[key] = value;
                }
            }
        );
        Object.assign(result, {
            methods, data() {
                return data
            }
        });
    }


    onReturn() {
        const result = {};
        result.name = this.componentName;
        this.parseDataOrMethods(result);
        return Object.assign(result, this.configurationMap);
    }

}

export const VueComponent = AnnotationGenerator.generate(VueComponentDescribe);
