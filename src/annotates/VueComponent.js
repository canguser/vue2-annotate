import {BasicAnnotationDescribe, AnnotationUtils, AnnotationGenerator} from "@palerock/annotate-js";
import {Extra} from "./Extra";
import {NativeApi} from "./NativeApi";
import {Computed} from "./Computed";
import {Props} from "./Props";
import {utils} from "./utils";
import {Watch} from "./Watch";

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
        this.nativeMap = {};
        this.computedMap = {};
        this.propMap = {};
        this.watchMap = {};

        Object.keys(propertyMap).forEach(
            key => {
                const targetProperty = properties.find(property => property.name === key);
                let isDataOrMethod = true;
                if (targetProperty) {
                    const propertyValue = propertyMap[key];
                    if (targetProperty.hasAnnotations(Extra)) {
                        isDataOrMethod = false;
                    }
                    if (targetProperty.hasAnnotations(NativeApi)) {
                        this.nativeMap[key] = propertyMap[key];
                    }
                    if (targetProperty.hasAnnotations(Computed)) {
                        this.computedMap[key] = propertyMap[key];
                    }
                    if (targetProperty.hasAnnotations(Props)) {
                        this.propMap[key] = propertyMap[key];
                    }
                    if (targetProperty.hasAnnotations(Watch)) {
                        const watch = targetProperty.findAnnotationByType(Watch);
                        if (watch) {
                            const {deep, immediate} = watch.params;
                            const propertyKey = watch.watchProperty;
                            if (!this.watchMap[propertyKey]) {
                                this.watchMap[propertyKey] = [];
                            }
                            if (typeof propertyValue === 'object') {
                                this.watchMap[propertyKey].push(
                                    {
                                        ...propertyValue,
                                        deep, immediate
                                    }
                                );
                            } else if (['function', 'string'].includes(typeof propertyMap[key])) {
                                this.watchMap[propertyKey].push({
                                    handler: propertyValue,
                                    deep, immediate
                                });
                            }
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
        })
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

    parseNativeApi(result = {}) {
        const _this = this;
        const nativeMap = {...this.nativeMap};
        if ('data' in nativeMap) {
            const existData = result.data;
            nativeMap.data = function () {
                return {
                    ..._this.nativeMap.data,
                    ...(typeof existData === 'function' ? existData() : {})
                };
            }
        }
        Object.assign(result, nativeMap);
    }

    parsePropMap(result = {}) {
        result.props = {...result.props, ...this.propMap};
    }

    parseWatchMap(result = {}) {
        result.watch = {...result.watch, ...this.watchMap};
    }

    onReturn() {
        const result = {};
        result.name = this.componentName;
        this.parseDataOrMethods(result);
        this.parseNativeApi(result);
        this.parseComputedMap(result);
        this.parsePropMap(result);
        this.parseWatchMap(result);
        return result;
    }

}

export const VueComponent = AnnotationGenerator.generate(VueComponentDescribe);
