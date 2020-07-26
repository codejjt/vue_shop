import Vue from "vue"
import 'element-ui/lib/theme-chalk/index.css'
import {
  Form,
  FormItem,
  Button,
  Input,
  Message
} from 'element-ui'

Vue.use(Form)
Vue.use(FormItem)
Vue.use(Button)
Vue.use(Input)

Vue.prototype.$message = Message