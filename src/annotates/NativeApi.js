import {AnnotationGenerator} from "@palerock/annotate-js";
import {ExtraDescribe} from "./Extra";

export class NativeApiDescribe extends ExtraDescribe {

    nativePropertyEntry = {};

    functionReturningProperties = ['data', 'provide'];

    configProperty(target, fieldName, fieldValue, configurationMap) {
        super.configProperty(target, fieldName, fieldValue, configurationMap);
        this.nativePropertyEntry = [fieldName, fieldValue];
        this.parseNativeApi(configurationMap);
    }

    parseNativeApi(result = {}) {
        const [fieldName, fieldValue] = this.nativePropertyEntry;
        const nativeMap = {};
        if (this.functionReturningProperties.includes(fieldName) && typeof fieldValue === 'function') {
            const exist = result[fieldName];
            nativeMap[fieldName] = {
                ...exist,
                ...fieldValue()
            }
        } else {
            nativeMap[fieldName] = fieldValue;
        }
        Object.assign(result, nativeMap);
    }

}

export const NativeApi = AnnotationGenerator.generate(NativeApiDescribe);