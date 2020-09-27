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
        this.target = target;

        const valuePropertyFilter = ([, descriptor]) => descriptor && 'value' in descriptor;

        const propertyMap = AnnotationUtils.fromEntries(
            Object.entries(
                utils.getDescriptors(target, {filter: valuePropertyFilter})
            ).map(([name, descriptor]) => [name, descriptor.value])
        );

        const properties = this.classEntity.properties;

        this.dataMap = {};
        this.configurationMap = {
            name: this.componentName
        };

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
            methods: {...result.methods, ...methods}, data: {...result.data, ...data}
        });
    }

    parseGetterSetter(result = {}) {
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

        result.computed = {...result.computed, ...computedMap};
    }


    onReturn() {
        this.parseDataOrMethods(this.configurationMap);
        this.parseGetterSetter(this.configurationMap);
        if (this.configurationMap.data) {
            const data = this.configurationMap.data;
            this.configurationMap.data = function () {
                return utils.deepClone(data);
            };
        }
        return {...this.configurationMap};
    }

}

export const VueComponent = AnnotationGenerator.generate(VueComponentDescribe);
