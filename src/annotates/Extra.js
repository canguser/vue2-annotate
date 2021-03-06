import {AnnotationGenerator, PropertyDescribe} from "@palerock/annotate-js";

export class ExtraDescribe extends PropertyDescribe {

    configProperty(target ,fieldName, fieldValue, configurationMap) {
        this.target = target;
    }

}

export const Extra = AnnotationGenerator.generate(ExtraDescribe);