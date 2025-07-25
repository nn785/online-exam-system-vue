<template>
  <el-container>
    <!--用户头部菜单-->
    <el-aside id="aside" width="210px">
      <el-menu :default-active="activeMenu" @select="handleSelect" :router="true" :collapse="isCollapse">
        <el-menu-item index="/index" disabled style="text-align: center">
          <i class="el-icon-sunny"></i>
          <span slot="title">
            {{VUE_APP_TITLE}}
          </span>
        </el-menu-item>

        <!-- 单独的导航 -->
        <el-menu-item @click="changeBreadInfo(menuInfo[0].topMenuName,menuInfo[0].topMenuName,menuInfo[0].url)"
                      index="/dashboard"
                      v-if="!menuInfo[0].submenu">
          <i :class="menuInfo[0].topIcon"></i>
          <span slot="title">{{ menuInfo[0].topMenuName }}</span>
        </el-menu-item>

        <!--具有子导航的-->
        <el-submenu v-if="menu.submenu" v-for="(menu,index) in menuInfo" :key="index" :index="index+''">
          <template slot="title">
            <i :class="menu.topIcon"></i>
            <span slot="title">{{ menu.topMenuName }}</span>
          </template>

          <!--子导航的分组-->
          <el-menu-item-group>
            <el-menu-item @click="changeBreadInfo(menu.topMenuName,sub.name,sub.url)" :index="sub.url"
                          v-for="(sub,index) in menu.submenu" :key="index">
              <i :class="sub.icon"></i>
              <span slot="title">{{ sub.name }}</span>
            </el-menu-item>
          </el-menu-item-group>

        </el-submenu>
      </el-menu>
    </el-aside>

    <!--右侧的面板-->
    <el-main>

      <el-container>

        <el-header height="100px">
          <el-card class="box-card">
            <div slot="header">
              <!--缩小图标-->
              <el-tooltip class="item" effect="dark" content="缩小侧边栏" placement="top-start">
                <i class="el-icon-s-fold" @click="changeIsCollapse"
                   style="cursor:pointer;font-size: 25px;font-weight: 100"></i>
              </el-tooltip>

              <!--面包屑-->
              <el-breadcrumb style="margin-left: 15px">
                <el-breadcrumb-item>{{ breadInfo.top }}</el-breadcrumb-item>
                <el-breadcrumb-item>{{ breadInfo.sub }}</el-breadcrumb-item>
              </el-breadcrumb>

              <!--右侧的个人信息下拉框-->
              <el-dropdown trigger="click" style="float: right;color: black;cursor:pointer;" @command="handleCommand">
                <span class="el-dropdown-link">
                  {{ currentUserInfo.username }}
                  <i class="el-icon-caret-bottom"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="personInfo">个人资料</el-dropdown-item>
                  <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>


              <!--右侧的放大图标-->
              <el-tooltip effect="dark" content="全屏预览" placement="top-start">
                <i class="el-icon-full-screen" id="full" @click="fullShow" style="float: right;margin-right:10px;
              margin-bottom:5px;cursor:pointer;font-size: 25px;font-weight: 100"></i>
              </el-tooltip>

              <!--右侧的查看公告图标-->
              <el-tooltip effect="dark" content="查看公告" placement="top-start">
                <i class="el-icon-bell" @click="showSystemNotice" style="float: right;margin-right:10px;
              margin-bottom:5px;cursor:pointer;font-size: 25px;font-weight: 100"></i>
              </el-tooltip>
            </div>

            <!--卡片面板的主内容-->
            <div>
              <el-tag @close="handleClose(index)" v-for="(item,index) in tags"
                      type="info" size="small" :key="index" :class="item.highlight ? 'active' : ''"
                      :closable="item.name !== '系统介绍'" @click="changeHighlightTag(item.name)"
                      effect="plain">
                <i class="el-icon-s-opportunity" style="margin-right: 2px"
                   v-if="item.highlight"></i>
                {{ item.name }}
              </el-tag>
            </div>
          </el-card>
        </el-header>

        <el-main style="margin-top: 25px;">
          <router-view @giveChildChangeBreakInfo="giveChildChangeBreakInfo" @showSystemNotice="showSystemNotice"
                       @giveChildAddTag="giveChildAddTag" :tagInfo="tags" @updateTagInfo="updateTagInfo"></router-view>
        </el-main>

      </el-container>

      <el-dialog title="更新用户信息" center :visible.sync="updateCurrentUserDialog">

        <el-form :model="currentUserInfo2" :rules="updateUserFormRules" ref="updateUserForm">

          <el-form-item label="用户名">
            <el-input v-model="currentUserInfo2.username" disabled></el-input>
          </el-form-item>

          <el-form-item label="真实姓名" prop="trueName">
            <el-input v-model="currentUserInfo2.trueName"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input v-model="currentUserInfo2.password" placeholder="不更改请留空"></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="currentUserInfo2.email"></el-input>
          </el-form-item>

        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="updateCurrentUserDialog = false">取 消</el-button>
          <el-button type="primary" @click="updateCurrentUser">确 定</el-button>
        </div>
      </el-dialog>

    </el-main>
  </el-container>
</template>

<script>
import notice from '@/api/notice'
import menu from '@/api/menu'
import user from '@/api/user'
import auth from '@/api/auth'
import utils from '@/utils/utils'

export default {
  name: 'Main',
  data () {
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else if (value.length < 5) {
        callback(new Error('新密码少于5位数!'))
      } else {
        callback()
      }
    }
    return {
      VUE_APP_TITLE: process.env.VUE_APP_TITLE,
      //菜单信息
      menuInfo: [
        {
          'topIcon': '',
          'url': '',
          'children': [
            {
              'url': ''
            }
          ]
        }
      ],
      //面板是否收缩
      isCollapse: false,
      //当前是否全屏显示
      isFullScreen: false,
      //当前登录的用户信息
      currentUserInfo: {
        'username': ''
      },
      //当前激活的菜单
      activeMenu: '',
      //面包屑信息
      breadInfo: {
        'top': '系统介绍',//顶级菜单信息
        'sub': '系统介绍'//当前的菜单信息
      },
      //面包屑下的标签数据
      tags: [
        {
          'name': '系统介绍',
          'url': '/dashboard',
          'highlight': true
        }
      ],
      //跟新当前用户的信息的对话框
      updateCurrentUserDialog: false,
      //当前用户的信息
      currentUserInfo2: {},
      //更新信息表单信息
      updateUserFormRules: {
        trueName: [
          {
            required: true,
            message: '请输入真实姓名',
            trigger: 'blur'
          }
        ],
        password: [
          {
            validator: validatePassword,
            trigger: 'blur'
          }
        ],
        email:[
          {
            pattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
            message: "请填写正确的邮箱",
            trigger: "blur"
          }
        ]
      }
    }
  },
  created () {
    this.getMenu()
    //获取登录用户信息
    this.getUserInfoByCheckToken()
  },
  mounted () {
    //根据当前链接的hash设置对应高亮的菜单
    this.activeMenu = window.location.hash.substring(1)
    document.querySelector('.el-container').style.maxHeight = screen.height + 'px'
    // 根据设备大小调整侧边栏
    if (screen.width <= 1080) {
      this.isCollapse = !this.isCollapse
      document.querySelector('#aside').style.width = 65 + 'px'
      document.querySelector('.el-container').style.minWidth = 1080 + 'px'
    }
  },
  watch: {
    //监察路径变化,改变菜单的高亮
    '$route.path': function (o, n) {
      this.activeMenu = o
      //如果没有该标签就创建改标签
      let flag = false
      //判断是否含有改标签
      this.tags.map(item => {
        if (item.url === this.activeMenu) {//如果有含有该标签
          flag = true
        }
      })
      if (!flag) {//对应链接的标签不存在
        //先找到该标签的名字
        this.createHighlightTag()
      } else {//改标签存在,则高亮
        this.tags.map(item => {
          //取消高亮别的标签
          item.highlight = false
          //高亮当前标签
          if (item.url === this.activeMenu) {
            item.highlight = true
          }
        })
      }
    }
  },
  methods: {
    //查看系统公告
    showSystemNotice () {
      notice.getCurrentNewNotice().then((resp) => {
        if (resp.code === 200) {
          this.$alert(resp.data, '最新公告', {
            dangerouslyUseHTMLString: true,
            closeOnPressEscape: true,
            lockScroll: false
          })
        } else {
          this.$notify({
            title: 'Tips',
            message: '公告获取失败',
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    //根据token后台判断用户权限,传递相对应的菜单
    getMenu () {
      menu.getMenuInfo().then((resp) => {
        if (resp.code === 200) {
          this.menuInfo = JSON.parse(resp.data)
          //根据链接创建不存在的tag标签并高亮
          this.createHighlightTag()
        } else {//后台认证失败,跳转登录页面
          this.$message.error('权限认证失败')
          this.$router.push('/')
        }
      })
    },
    //放大缩小侧边栏
    changeIsCollapse () {
      const aside = document.querySelector('#aside')
      if (this.isCollapse) {
        aside.style.width = 210 + 'px'
      } else {
        aside.style.width = 65 + 'px'
      }
      this.isCollapse = !this.isCollapse
    },
    //是否全屏显示
    fullShow () {
      let docElm = document.documentElement
      const full = document.querySelector('#full')
      if (this.isFullScreen) {//退出全屏模式
        //切换图标样式
        full.className = 'el-icon-full-screen'
        //W3C
        if (document.exitFullscreen) {
          document.exitFullscreen()
        }
        //FireFox
        else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        }
        //Chrome等
        else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        }
        //IE11
        else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {//进入全屏模式
        //W3C
        //切换图标样式
        full.className = 'el-icon-switch-button'
        if (docElm.requestFullscreen) {
          docElm.requestFullscreen()
        }
        //FireFox
        else if (docElm.mozRequestFullScreen) {
          docElm.mozRequestFullScreen()
        }
        //Chrome等
        else if (docElm.webkitRequestFullScreen) {
          docElm.webkitRequestFullScreen()
        }
        //IE11
        else if (docElm.msRequestFullscreen) {
          docElm.msRequestFullscreen()
        }
      }
      //改变标志位
      this.isFullScreen = !this.isFullScreen
    },
    //处理右上角下拉菜单的处理事件
    handleCommand (command) {
      if (command === 'logout') {//退出
        this.logout()
      } else if (command === 'personInfo') {
        this.updateCurrentUserDialog = true
        user.getCurrentUser().then((resp) => {
          if (resp.code === 200) {
            resp.data.password = ''
            this.currentUserInfo2 = resp.data
          }
        })
      }
    },
    //退出登录
    async logout () {
      window.localStorage.removeItem('authorization')
      //右侧提示通知
      this.$notify({
        title: 'Tips',
        message: '注销成功',
        type: 'success',
        duration: 2000
      })
      await this.$router.push('/')
    },
    //检查token获取其中的用户信息
    getUserInfoByCheckToken () {
      auth.checkToken().then(resp => {
        this.currentUserInfo = resp.data
        localStorage.setItem('username', this.currentUserInfo.user.username)
      })
    },
    //关闭tag标签
    handleClose (index) {//当前点击的tag的下标
      if (this.tags[index].highlight) {
        this.tags[index - 1].highlight = true
        //关闭之后,路由调跳转,高亮菜单和标签
        this.$router.push(this.tags[index - 1].url)
        this.handleSelect(this.tags[index - 1].url)
      }
      this.tags.splice(index, 1)
    },
    //菜单的高亮变化
    handleSelect (currentMenu) {
      this.activeMenu = currentMenu
    },
    //处理面包屑信息和面包屑下的标签信息
    changeBreadInfo (curTopMenuName, curMenuName, url) {
      //面包屑信息
      this.breadInfo.top = curTopMenuName
      this.breadInfo.sub = curMenuName
      //标签信息
      let flag = false//当前是否有此菜单信息(防止无限点击,无线生成)
      this.tags.map(item => {
        if (item.name === curMenuName) flag = true
      })
      if (!flag) {//不存在当前点击的菜单
        this.tags.push({
          'name': curMenuName,
          'url': url,
          'highlight': true
        })
      } //高亮菜单tag
      this.changeHighlightTag(curMenuName)
    },
    //处理高亮的tag
    changeHighlightTag (curMenuName) {//当前需要高亮的名字
      let curMenu
      this.tags.map((item, i) => {
        if (item.name === curMenuName) curMenu = item
        item.highlight = item.name === curMenuName
      })
      //调用改变面包屑的方法
      this.changeTopBreakInfo(curMenu.name)
      this.$router.push(curMenu.url)
    },
    //创建当前高亮的tags
    createHighlightTag () {
      //根据链接创建不存在的tag标签并高亮
      let menuName
      this.menuInfo.map(item => {
        if (item.submenu !== undefined) {
          item.submenu.map(subItem => {
            if (subItem.url === this.activeMenu) menuName = subItem.name
          })
        }
      })
      if (menuName !== undefined && this.tags.indexOf(menuName) === -1) {
        this.tags.push({
          'name': menuName,
          'url': this.activeMenu,
          'highlight': true
        })
        //高亮对应的标签
        this.tags.map(item => {
          if (item.url === window.location.hash.substring(1)) this.changeHighlightTag(item.name)
        })
      }
    },
    //改变头部的面包屑信息
    changeTopBreakInfo (subMenuName) {
      let topMenuName
      this.menuInfo.map(item => {
        if (item.submenu !== undefined) {
          item.submenu.map(i2 => {
            if (i2.name === subMenuName) topMenuName = item.topMenuName
          })
        }
      })
      this.breadInfo.top = topMenuName
      this.breadInfo.sub = subMenuName
    },
    //提供给子组件改变面包屑最后的信息
    giveChildChangeBreakInfo (subMenuName, topMenuName) {
      this.breadInfo.sub = subMenuName
      this.breadInfo.top = topMenuName
    },
    //提供给子组件创建tag标签使用
    giveChildAddTag (menuName, url) {
      this.tags.map(item => {
        item.highlight = false
      })
      this.tags.push({
        'name': menuName,
        'url': url,
        'highlight': true
      })
    },
    //提供给子组件修改tag标签使用
    updateTagInfo (menuName, url) {
      this.tags.map((item, index) => {
        item.highlight = false
        if (item.name === menuName) {
          this.tags.splice(index, 1)
        }
      })
      this.tags.push({
        'name': menuName,
        'url': url,
        'highlight': true
      })
    },
    //更新当前用户
    updateCurrentUser () {
      utils.validFormAndInvoke(this.$refs['updateUserForm'], () => {
        user.updateCurrentUser(this.currentUserInfo2).then((resp) => {
          if (resp.code === 200) {
            this.$notify({
              title: 'Tips',
              message: "修改成功",
              type: 'success',
              duration: 2000
            })
            let password = this.currentUserInfo2.password
            if (password != null && password !== ''){
              this.logout()
            }
            this.updateCurrentUserDialog = false
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/css/index/main";

</style>
