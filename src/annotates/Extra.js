import {AnnotationGenerator, PropertyDescribe} from "@palerock/annotate-js";

export class ExtraDescribe extends PropertyDescribe{
}

export const Extra = AnnotationGenerator.generate(ExtraDescribe);