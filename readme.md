# Vue2 Annotate [![gitee.png](https://palerock.cn/api-provider/files/view?identity=L2FydGljbGUvaW1hZ2UvMjAyMDA2MjkxNTQyMTMwNzVXcWZyU2dTbC5wbmc=&w=15)](https://gitee.com/HGJing/vue2-annotate) [![github.png](https://palerock.cn/api-provider/files/view?identity=L2FydGljbGUvaW1hZ2UvMjAyMDA2MjkxNjU3NDkzMDkybWNLRXhHMi5wbmc=&w=15)](https://github.com/canguser/vue2-annotate)
`Vue2 Annotate` 是一个基于注解提案 `proposal-decorators` 的注解框架，核心为了能在 `Vue` 项目中使用注解从而简化、美观化 `Vue` 项目结构，基于注解框架 [`Annotate JS`](https://github.com/canguser/annotate-js)。

-----

## 特性
1. 使得 Vue 能够支持 Class 语法开发
2. 通过预置注解快速实现相应配置
3. 更加接近原生的开发方式
4. 简单明了的代码结构

## 快速开始
> 为了简单演示，所以演示代码基于 `vue-cli v4.5.0`
### 环境配置
首先安装 `Vue2 Annotate`
```shell script
npm install @palerock/vue2-annotate -s
```
或
```shell script
yarn add @palerock/vue2-annotate
```

因为要使用注解语法，我们需要在 Babel 环境中引入相关依赖：
```shell script
npm install @babel/plugin-proposal-decorators
npm install @babel/plugin-proposal-class-properties
```
或
```shell script
yarn add @babel/plugin-proposal-decorators
yarn add @babel/plugin-proposal-class-properties
```

安装完成后，配置根目录下 `babel.config.js` 文件内容如下:
```javascript
module.exports = {
    presets: [
        '@vue/cli-plugin-babel/preset'
    ],
    "plugins": [
        [
            "@babel/plugin-proposal-decorators",
            {
                "legacy": true
            }
        ],
        [
            "@babel/plugin-proposal-class-properties",
            {
                "loose": true
            }
        ]
    ]
};
```

至此，环境配置完成。
### Demo
我们修改 vue-cli 自带的 HelloWord 组件，将其转化为一个使用 vue2-annotate 构建的组件。  
首先我们修改 `<script>` 标签中的内容如下：
```javascript
// 引入注解
import {VueComponent, Props, Computed, NativeApi} from "@palerock/vue2-annotate";

export default 
// 使用 @VueComponent 使用一个名为 HelloWorld 的组件
@VueComponent
class HelloWorld {

    // 申明属性 suffix 
    suffix = 'For Vue2 Annotate';

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

    // 声明方法
    handleClick(e) {
        console.log(e);
        alert(this.appendMessage);
    }

    // 使用 @NativeApi 声明钩子函数
    @NativeApi
    created() {
        console.log('created');
    }
}
```
紧接着修改 `<template>` 标签内容如下：
```html
<div class="hello">
    <h1>{{ appendMessage }}</h1>
    <h2 @click="handleClick">{{ message }}</h2>
</div>
```
运行项目：
```shell script
yarn run serve
```
进入页面，输出内容如下图：  
![image.png](https://palerock.cn/api-provider/files/view?identity=L2FydGljbGUvaW1hZ2UvMjAyMDA5MjUxMTUyMjY4NjM0Y1FUZFNUTy5wbmc=)  
点击副标题，弹出内容如下图：  
![image.png](https://palerock.cn/api-provider/files/view?identity=L2FydGljbGUvaW1hZ2UvMjAyMDA5MjUxMTUzMjk2MzFlUkRQRzNIVi5wbmc=)  
### 类比
在 Demo 中我们在 Vue 中使用 class 语法并且使用注解完成了一个简单的 HelloWorld 组件，若是不使用注解其等同代码结构应该如下：
```javascript
export default {
    name: 'HelloWorld',
    props: {
        msg: String
    },
    data(){
        return {
            suffix: 'For Vue2 Annotate'
        };
    },
    methods: {
        handleClick(e) {
            console.log(e);
            alert(this.appendMessage);
        }
    },
    computed: {
        appendMessage() {
                return this.msg + ' ' + this.suffix
        },
        message() {
                return this.msg;
        }
    },
    created(){
        console.log('created');
    }
}
```
相比而言，使用注解的代码结构更加清晰明了，更加简单，并且在后续的开发中，还会有各种新的注解简化开发流程。
### 通过 Annotate JS 生成自定义注解(面向切面编程)
为了快速生成自定义注解，我们需要用到 [Annotate JS 框架](https://palerock.cn/projects/006T5t9zyHi) 提供的几个注解:
- `@Surround` 用于自定义面向切面的动作
- `@Annoate` 用于继承其它注解并且自定义参数
- `@DefaultParam` 配合 `@Annoate` 用于指定默认参数
- `@DynamicParam` 配合 `@Annoate` 用于指定动态参数

关于以上注解的基本用法可以参考其 [API文档](https://palerock.cn/projects/006T5t9zyHi#surround)。  
> 由于本框架完全依赖于 `Annotate JS 框架`，为了方便开发，以上注解在 `^1.0.16` 版本以后可以直接由该框架引入：  
`import {Annotate, Surround, DefaultParam, DynamicParam} from "@palerock/vue2-annotate";`

了解了以上注解的基本用法后，我们以几个简单的例子来实现自定义注解
#### TimeLogger
在日常开发中，如果涉及到性能优化，我们总是需要通过在方法前后添加 `console.time/console.timeEnd` 类似代码以实现分析其运行时间长短，而这样的代码一是看起来相当不美观，二是会使代码结构看起来十分混乱。那我们可不可以使用一个注解来完成以上工序而完全不需要修改方法内的内容呢？完全可以。  
首先，我们定义一个 class 命名为 `TimeLogger`，并且为其加上注解 `@Annotate({extends: Surround})`，如下所示：
```javascript
export default
@Annotate({extends: Surround})
class TimeLogger {
	// 在此定义参数
}
```
紧接着，我们定义 Surround 注解中的参数 `before` 和 `after`，让其能够分别运行 `console.time` 和 `console.timeEnd`，如下所示：
```javascript
export default
@Annotate({extends: Surround})
class TimeLogger {
    
    before() {
        console.time();
    }

    after({lastValue}) {
        console.timeEnd();
		// 需要将实际返回值返回出去，避免改变原方法返回值
        return lastValue;
    }
}
```
除此之外我们应该给每个方法中的每对 `time/timeEnd` 设定一个 label 使其能改匹配，不妨新增一个参数 logApi，并设置其为默认参数，这样我们就可以在使用注解时直接传参让其赋值：
```javascript
export default
@Annotate({extends: Surround})
class TimeLogger {

    @DefaultParam
    logApi;

    before({annotate}) {
        // 通过 annotate 获取该注解上的其它参数值
        const {logApi} = annotate.params;
        console.time(logApi);
    }

    after({lastValue, annotate}) {
        const {logApi} = annotate.params;
        console.timeEnd(logApi);
        // 需要将实际返回值返回出去，避免改变原方法返回值
        return lastValue;
    }
}
```
设置好后我们回到一个 `Vue Component` 中，为指定方法加上该注解：
```javascript
export default
@VueComponent
class CustomAnnotateTest {

    @TimeLogger('testing')
    testing(){
        console.log('do testing');
    }

}
```
运行后结果如下：
```
do testing
testing: 2.06591796875ms
```
效果是达到了，但每次使用注解都要输入一个 logApi 感觉也不怎么优雅，要是能够自动获取方法名作为 logApi 就好了，要实现这个需求，我们需要引入 `@DynamicParam` 注解，通过该注解就可以在未设置参数的情况下动态的生成参数值，于是我们修改代码如下：
```javascript
export default
@Annotate({extends: Surround})
class TimeLogger {

    @DynamicParam
    @DefaultParam
    logApi({propertyEntity}){
        // 设置其默认属性为属性名
        return propertyEntity.name;
    }

    before({annotate}) {
        // 通过 annotate 获取该注解上的其它参数值
        const {logApi} = annotate.params;
        console.time(logApi);
    }

    after({lastValue, annotate}) {
        const {logApi} = annotate.params;
        console.timeEnd(logApi);
        // 需要将实际返回值返回出去，避免改变原方法返回值
        return lastValue;
    }
}
```
然后回到 Component 中，修改代码如下：
```javascript
export default @VueComponent
class CustomAnnotateTest {

    @TimeLogger
    testing() {
        console.log('do testing');
    }

}
```
现在针对不同方法就回自动获取其 name 作为 logApi，测试结果如下：
```
do testing
testing: 1.61181640625ms
```
那如果我们需要对 getter 方法或者 setter 方法测试其运行时间呢，我们修改代码如下：
```javascript
export default @VueComponent
class CustomAnnotateTest {

    messages = ['hello', 'world'];

    @TimeLogger
    testing() {
        console.log('do testing');
    }

    @TimeLogger
    get secondMessage() {
        return this.messages[1];
    }

    // 注意，此处不用加注解，同一 name 如果 getter 和 setter 都加了注解，那么会生效两次
    set secondMessage(message) {
        this.messages[1] = message;
    }

    @NativeApi
    created() {
        console.log(this.secondMessage);
        this.secondMessage = 'emmmm';
        console.log(this.secondMessage);
    }
}
```
运行测试，其输出结果如下：
```
secondMessage: 0.10595703125ms
secondMessage: 0.162353515625ms
world
secondMessage: 0.1630859375ms
emmmm
```
我们发现以上结果一眼看去完全看不出个所以然，全都是一样的 label，无法区分 getter 和 setter，为了更好的区分 getter 和 setter，我们修改注解内容如下： 
```javascript
export default 
@Annotate({extends: Surround})
class TimeLogger {

    @DynamicParam
    @DefaultParam
    logApi({propertyEntity}) {
        // 设置其默认属性为属性名
        return propertyEntity.name;
    }

    before({annotate, isGetter, isSetter}) {
        
        // 通过参数 isGetter, isSetter 添加后缀
        let suffix = '';
        if (isSetter) {
            suffix = '(Setter)';
        }
        if (isGetter) {
            suffix = '(Getter)';
        }

        // 通过 annotate 获取该注解上的其它参数值
        const {logApi} = annotate.params;
        console.time(logApi + suffix);
    }

    after({lastValue, annotate, isGetter, isSetter}) {
        let suffix = '';
        if (isSetter) {
            suffix = '(Setter)';
        }
        if (isGetter) {
            suffix = '(Getter)';
        }

        const {logApi} = annotate.params;
        console.timeEnd(logApi + suffix);
        // 需要将实际返回值返回出去，避免改变原方法返回值
        return lastValue;
    }
}
```
修改完成后回到页面，可以看到输出如下：
```
secondMessage(Getter): 0.52587890625ms
world
secondMessage(Setter): 0.74365234375ms
secondMessage(Getter): 0.093994140625ms
emmmm
```
## 预置注解
### @VueComponent
该注解作用于 class，例子如 [Demo](#demo) 所示，其内部未加注解的成员属性含义如下：
- getter 方法: 同 @Computed get
- setter 方法: 同 @Computed set (使用 setter 必须指定该属性的 getter)
- 普通方法: 相当用未使用注解中的 methods
    ```javascript
    @VueComponent
    class A{
        func(){
            console.log('my func');
        }   
    }
    // 等同于
    ({ 
        name: 'A',
        methods: {
            func(){
                console.log('my func');
            }   
        }
    })
    ```
- 其它成员变量: 相当于未使用注解中的 data 返回值
    ```javascript
    @VueComponent
    class A{
        name = 'Join';
        age = 20
    }
    // 等同于
    ({ 
        name: 'A',
        data(){
            return {
                name: 'Join';
                age: 20
            }
        }
    })
    ```

参数(对象形式)：  
- `name`: `默认参数` component 的 name 值，默认为 class 名
    ```javascript
    // name = 'A'
    @VueComponent
    class A{}
  
    // name = 'A1'
    @VueComponent('A1')
    class B{}  
  
    // name = 'A2'
    @VueComponent({name: 'A2'})
    class C{}  
    ```

### @Props
必须作用于 `@VueComponent` 装饰的 class，表示该 component 暴露出的参数。
```javascript
@VueComponent
class A{
    @Props
    name = String;
    @Props
    age = Number;
}
```
等同于未使用注解时：
```javascript
({
    name: 'A',
    props: {
        name: String,
        age: Number
    }
})
```

### @Model
必须作用于 `@VueComponent` 装饰的 class，表示使用 Vue Model 属性  
被该注解装饰后的属性同样视为 `props`，并且写入 model 属性。  
参数：  
- `name`: `string`  `默认属性` 默认值：被装饰的属性名
	- 表示监听的 `prop` 名
	- 如果该属性与被装饰的属性名不一致，则将被装饰的属性名视为`计算属性`, 详情如下面第二个例子
- `changeEvent`: `string` 默认值：`change`

例1:
```javascript
@VueComponent
class A {

    @Model
    value = String;

}
```
等同于：
```javascript
({
    name: 'A',
    props: {
        value: String
    },
    model:{
        prop: 'value',
        event: 'change'
    }
});
```
例2:
```javascript
@VueComponent
class B {

    @Model('value') // name 属性为 value, 被装饰属性名为 content
    content = String;

}
```
等同于：
```javascript
({
    name: 'B',
    props: {
        value: String
    },
    model: {
        prop: 'value',
        event: 'change'
    },
    computed: {
        content: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('change', value);
            }
        }
    }
});
```

### @Computed
必须作用于 `@VueComponent` 装饰的 class，表示计算属性。
```javascript
@VueComponent
class A{
    
    number = 1;
    
    @Computed
    numberPlus(){
        return this.number + 1;
    }
    
}
```
等同于未使用注解时：
```javascript
({
    name: 'A',
    data(){
        return {
            number: 1
        }   
    },
    computed: {
        numberPlus(){
            return this.number + 1;
        }
    }
})
```
### @Watch
必须作用于 `@VueComponent` 装饰的 class，用于监听属性的改变  
参数：  
- `property`： `默认参数` `string` 需要监听的属性名，若未设置该参数，会获取被装饰的属性名作为其值。
	- 注意：在未设置该参数的情况下**为了避免属性名冲突，可以在属性名前加上 `$$` 也可以被正常解析**
- `deep`：`boolean` 默认值：`false` 监听时是否遍历子对象
- `immediate`：`boolean` 默认值：`false` 是否在侦听开始之后被立即调用

```javascript
@VueComponent
class A {

    @Watch
    $$gender(val, oldVal) {
    }
    
    @Watch({deep: true, immediate: true})
    $$age(val, oldVal) {
    }

    @Watch('name')
    handleNameChanged = 'handleAgeChanged';

    @Watch({property: 'name', deep: true})
    handleNameChanged2(val, oldVal) {
    }
    
}
```
相当于：
```javascript
({
    name: 'A',
    watch: {
        age: {
            handler(val, oldVal) {
            },
            deep: true, immediate: true
        },
        gender(val, oldVal) {
        },
        name: [
            'handleAgeChanged',
            {
                handler(val, oldVal) {
                }
            }
        ]
    }
});
```

### @NativeApi
必须作用于 `@VueComponent` 装饰的 class，表示使用 Vue 原生属性
```javascript
@VueComponent
class A{
    
    @NativeApi
    data(){
        // 声明变量
        return {
            name: 'Join'
        }
    }

    // 声明计算属性
    @NativeApi
    computed = {
        appendName(){
            return this.name + 'append';
        }
    };
    
    @NativeApi
    created(){
        // 使用生命周期
        console.log('created');
    }
    
}
```
以上不是 `@NativeApi` 的所有用法，该注解适用于兼容 Vue 的更多功能。

----

## 相关地址
- Github: [https://github.com/canguser/vue2-annotate](https://github.com/canguser/vue2-annotate)
- Gitee: [https://gitee.com/HGJing/vue2-annotate](https://gitee.com/HGJing/vue2-annotate)
- 项目主页: [https://palerock.cn/projects/006XvyfPS9e](https://palerock.cn/projects/006XvyfPS9e)
- 演示项目: [https://github.com/canguser/vue2-annotate-demo](https://github.com/canguser/vue2-annotate-demo)

## 最后疑问或建议请评论或留言
