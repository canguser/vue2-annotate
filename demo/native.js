import {NativeApi, VueComponent} from "../src";

@VueComponent
class HelloWorld{

    @NativeApi
    components = {};

    @NativeApi
    provide(){
        return {
            message: 'message'
        };
    }

    @NativeApi
    inject = ['parentProvide'];

    @NativeApi
    data(){
        return {
            message: 'hello annotate'
        }
    }

    @NativeApi
    computed = {
        test(){
            return '';
        }
    };

    @NativeApi
    created(){
        // 生命周期函数
    }

    // ...等等
}

console.log(HelloWorld);