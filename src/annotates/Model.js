import {Annotate, DefaultParam} from "@palerock/annotate-js";
import {PropDescribe} from "./Props";

@Annotate({extends: PropDescribe})
export class Model {

    model = true;

    @DefaultParam
    changeEvent = 'change';

}
