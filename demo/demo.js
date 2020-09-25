import {Computed, NativeApi, Props, VueComponent, Watch} from "../src";

@VueComponent
class HelloWorld {

    // 申明属性 suffix
    suffix = 'For Vue2 Annotate';

    subTitle = 'My Vue2 Annotate';

    // 声明参数 msg
    @Props
    msg = String;

    // 声明计算属性 message
    @Computed
    appendMessage() {
        return this.msg + ' ' + this.suffix
    }

    // 计算属性的第二种写法
    get message() {
        return this.msg;
    }

    @Watch
    $$subTitle(newValue, oldValue) {
        console.log('sub title changed');
        console.log(oldValue, '=>', newValue);
    }

    set subTitleAppend(value) {
        this.subTitle += ' ' + value;
    }

    // 有 setter 必须有 getter
    get subTitleAppend() {
        return this.subTitle;
    }

    // 声明方法
    handleClick(e) {
        console.log(e, this.message);
        this.subTitleAppend = 'Clicked';
    }

    // 使用 @NativeApi 声明钩子函数
    @NativeApi
    created() {
        console.log('created');
    }

}

console.log(HelloWorld);