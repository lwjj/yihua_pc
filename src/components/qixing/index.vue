<template>

  <div id='manage'>
    <div v-if="showChildNum==1" @click="cancel()" class="black-bg"></div>
    <div v-if="showChildNum==1" class="user-list" v-bind:style="chatIndex==1?'padding-bottom:90px':'padding-bottom:10px'">
      <el-row>
        <el-col :span="2" style="line-height: 50px">&nbsp;</el-col>
      <el-col :span="10"><el-input v-if="chatIndex==1" style="line-height: 50px" v-model="input" placeholder="请输入群名称"></el-input></el-col>
      <el-col :span="4" style="line-height: 50px"><el-button>查询</el-button></el-col>
      </el-row>
      <el-tree v-if="userList.length>0" style="max-height: 500px;overflow: hidden"
               :data="userList"
               :props="defaultProps"
               @node-click="selectIt"
               :show-checkbox="chatIndex==1"
               node-key="userId"
               ref="tree"
               :expand-on-click-node="false">
      </el-tree>
      <div class="sure-btn" v-if="chatIndex==1">
        <el-button style="flex: 1;line-height: 30px;border-right: 1px solid #e6e6e6;border-radius: 0px;color: #999999" type="text" @click="cancel()">取消</el-button>
        <el-button style="flex: 1;line-height: 30px" type="text" @click="sureAdd()">确定</el-button>
      </div>
    </div>
    <!-- 头部 -->
    <div class="all_header">
      <!-- 搜索栏 -->
      <el-autocomplete
        class="inline-input"
        placeholder="搜索内容"
      ></el-autocomplete>
      <!-- 标题栏 -->
      <div class="title">
        {{title}}
      </div>
    </div>
    <!-- 物业管理二级菜单 -->
    <div class="submenu">
      <!--<router-link to="/meeting">-->
      <div class="menu">
        <div class="chat-list" v-bind:class="showChildNum==1&&chatIndex==1?'selected-active':''"
             @click="showChild(1,1)">
          <!--<img class="m-right l-right" >-->
          <div>创建群聊</div>
        </div>
        <div class="chat-list" v-bind:class="showChildNum==1&&chatIndex==1?'selected-active':''"
             @click="showChild(1,2)">
          <!--<img class="m-right l-right" src="../../../assets/images/rent/my/left_job_list.png">-->
          <div>联系人</div>
        </div>

        <div>
          <div class="chat-list" v-bind:class="showChildNum==2&&chatIndex==index?'selected-active':''"
               v-for="item,index in data.teams" @click="showChild(2,index)">
            <img class="m-right l-right" src="http://yx-web.nos.netease.com/webdoc/h5/im/icons.png">
            <div class="get-ms-list">{{item.name}}<br>
              <div class="warn-circle text-center"
                   v-for="it in data.sessions" v-if="data.sessions&&item.teamId==it.id.split('-')[1]&&it.unread*1!=0">
                {{it.unread}}未读
              </div>
              <span v-for="it in data.sessions" v-if="it.id.split('-')[1]*1==item.teamId*1">
  {{it.lastMsg.fromNick?it.lastMsg.fromNick+'：'+it.lastMsg.text:''}}
</span>
            </div>
            <div class="right-time pull-right">
              {{
              (new Date(item.updateTime * 1)).getMinutes() / 10 >= 1 ?
              (new Date(item.updateTime * 1)).getHours() + ":" + (new Date(item.updateTime * 1)).getMinutes() :
              (new Date(item.updateTime * 1)).getHours() + ":" + '0' + (new Date(item.updateTime * 1)).getMinutes()}}
            </div>
          </div>
          <div class="chat-list" v-for="item,index in data.sessions" @click="showChild(4)"
               v-if="item.id&&item.scene!='team'&&!item.teamId">
            <p v-head style="height: 0"><img class="m-right l-right" :src="item.id"></p>
            <div class="get-ms-list" v-for="it in data.users" v-if="item.id.split('-')[1]==it.account">
              {{it.nick}}{{item.from}}<br>
              <div class="warn-circle text-center" v-if="item.unread*1!=0">{{item.unread}}未读</div>
              <span>
{{item.lastMsg.text ||'文件'||'暂无消息'}}
</span></div>
            <div class="right-time pull-right">{{
              (new Date(item.updateTime * 1)).getMinutes() / 10 >= 1 ?
              (new Date(item.updateTime * 1)).getHours() + ":" + (new Date(item.updateTime * 1)).getMinutes() :
              (new Date(item.updateTime * 1)).getHours() + ":" + '0' + (new Date(item.updateTime * 1)).getMinutes()}}
            </div>
          </div>
        </div>
      </div>
      <!--</router-link>-->
    </div>
    <div class="show-chat-title">{{chatTitle}}</div>
    <div class="mainContent">
      <div v-if="showChildNum==2">
        <div class="chatItem" v-if="data.msgs&&data.msgs!=''&&!isHistory">
          <div class="chat-msg text-left" v-for="item,index in data.msgs[type]">
            <div v-if="item.type=='text'" style="width: 100%;float: left;margin: 0.5em">
              <img class="chat-msg-img" v-bind:class="item.from*1!=data.myInfo.account*1?'pull-left':'pull-right'"
                   v-bind:style="item.from*1!=data.myInfo.account*1?'':'margin-left:0.5em'"
                   :src="item.from*1!=data.myInfo.account*1?friendImg(item.from):data.myInfo.avatar" alt="321">
              <div v-if="item.from*1!=data.myInfo.account*1&&type.split('-')[0]!='p2p'" style="margin-bottom: -1.5em">
                {{item.fromNick}}
              </div>
              <span v-bind:class="item.from*1!=data.myInfo.account*1?'pull-left':'pull-right'"
                    v-bind:style="item.from*1!=data.myInfo.account*1?'background-color: #5cacde;color: #fff;'
              :'color: #666;background-color: ##fff;'" v-emoji>{{item.text}}</span>
            </div>
            <div v-if="item.type=='image'&&data" style="width: 100%;float: left;margin: 0.5em">
              <img class="chat-msg-img pull-left" v-if="item.from*1!=data.myInfo.account*1"
                   :src="item.from*1!=data.myInfo.account*1?friendImg(item.from):data.myInfo.avatar" alt="321">
              <div v-if="item.from*1!=data.myInfo.account*1&&type.split('-')[0]!='p2p'" style="margin-bottom: -1.5em">
                {{item.fromNick}}
              </div>
              <a :href="item.file.url">
                <img class="recieve-img pull-left" v-if="item.from*1!=data.myInfo.account*1" :src="item.file.url"
                     alt="321">
              </a>
              <img class="chat-msg-img pull-right" style="margin-left:0.5em" v-if="item.from*1==data.myInfo.account*1"
                   :src="item.from*1!=data.myInfo.account*1?friendImg(item.from):data.myInfo.avatar" alt="321">
              <a :href="item.file.url" download="">
                <img class="recieve-img pull-right" v-if="item.from*1==data.myInfo.account*1" :src="item.file.url"
                     alt="321">
              </a>
            </div>
            <div v-if="item.type=='file'&&data" style="width: 100%;float: left;margin: 0.5em">
              <img class="chat-msg-img pull-left" v-if="item.from*1!=data.myInfo.account*1"
                   :src="item.from*1!=data.myInfo.account*1?friendImg(item.from):data.myInfo.avatar" alt="321">
              <span v-if="item.from*1!=data.myInfo.account*1"
                    v-bind:class="item.from*1!=data.myInfo.account*1?'pull-left':'pull-right'"
                    v-bind:style="item.from*1!=data.myInfo.account*1?'background-color: #5cacde;color: #fff;'
              :'color: #666;background-color: ##fff;'" v-emoji>
          <a class="pull-left" :href="item.file.url">{{item.file.name}}<br>
            <div class="text-center" style="width: 100%">点击下载</div></a></span>

              <img class="chat-msg-img pull-right" style="margin-left:0.5em" v-if="item.from*1==data.myInfo.account*1"
                   :src="item.from*1!=data.myInfo.account*1?friendImg(item.from):data.myInfo.avatar" alt="321">

              <span v-if="item.from*1==data.myInfo.account*1"
                    v-bind:class="item.from*1!=data.myInfo.account*1?'pull-left':'pull-right'"
                    v-bind:style="item.from*1!=data.myInfo.account*1?'background-color: #5cacde;color: #fff;'
              :'color: #666;background-color: ##fff;'" v-emoji><a class="pull-right" :href="item.file.url">
               {{item.file.name}}<br><div class="text-center" style="width: 100%">点击下载</div></a></span>
            </div>
          </div>
          <input class="focus-input" id="txt" type="tel" autofocus="autofocus">
        </div>
        <div class="chatItem" v-if="historyList&&historyList!=''&&isHistory">
          <div class="chat-msg text-left" v-for="item,index in historyList">
            <div v-if="item.type=='text'" style="width: 100%;float: left;margin: 0.5em">
              <img class="chat-msg-img" v-bind:class="item.from*1!=data.myInfo.account*1?'pull-left':'pull-right'"
                   v-bind:style="item.from*1!=data.myInfo.account*1?'':'margin-left:0.5em'"
                   :src="item.from*1!=data.myInfo.account*1?friendImg(item.from):data.myInfo.avatar" alt="321">
              <div v-if="item.from*1!=data.myInfo.account*1&&type.split('-')[0]!='p2p'" style="margin-bottom: -1.5em">
                {{item.fromNick}}
              </div>
              <span v-bind:class="item.from*1!=data.myInfo.account*1?'pull-left':'pull-right'"
                    v-bind:style="item.from*1!=data.myInfo.account*1?'background-color: #5cacde;color: #fff;'
              :'color: #666;background-color: ##fff;'" v-emoji>{{item.text}}</span>
            </div>
            <div v-if="item.type=='image'&&data" style="width: 100%;float: left;margin: 0.5em">
              <img class="chat-msg-img pull-left" v-if="item.from*1!=data.myInfo.account*1"
                   :src="item.from*1!=data.myInfo.account*1?friendImg(item.from):data.myInfo.avatar" alt="321">
              <div v-if="item.from*1!=data.myInfo.account*1&&type.split('-')[0]!='p2p'" style="margin-bottom: -1.5em">
                {{item.fromNick}}
              </div>
              <a :href="item.file.url">
                <img class="recieve-img pull-left" v-if="item.from*1!=data.myInfo.account*1" :src="item.file.url"
                     alt="321">
              </a>
              <img class="chat-msg-img pull-right" style="margin-left:0.5em" v-if="item.from*1==data.myInfo.account*1"
                   :src="item.from*1!=data.myInfo.account*1?friendImg(item.from):data.myInfo.avatar" alt="321">
              <a :href="item.file.url" download="">
                <img class="recieve-img pull-right" v-if="item.from*1==data.myInfo.account*1" :src="item.file.url"
                     alt="321">
              </a>
            </div>
            <div v-if="item.type=='amr'&&data" style="width: 100%;float: left;margin: 0.5em">
              <img class="chat-msg-img pull-left" v-if="item.from*1!=data.myInfo.account*1"
                   :src="item.from*1!=data.myInfo.account*1?friendImg(item.from):data.myInfo.avatar" alt="321">
              <div v-if="item.from*1!=data.myInfo.account*1&&type.split('-')[0]!='p2p'" style="margin-bottom: -1.5em">
                {{item.fromNick}}
              </div>
              <a :href="item.file.url">
                <img class="recieve-img pull-left" v-if="item.from*1!=data.myInfo.account*1" :src="item.file.url"
                     alt="321">
              </a>
              <img class="chat-msg-img pull-right" style="margin-left:0.5em" v-if="item.from*1==data.myInfo.account*1"
                   :src="item.from*1!=data.myInfo.account*1?friendImg(item.from):data.myInfo.avatar" alt="321">
              <a :href="item.file.url" download="">
                <img class="recieve-img pull-right" v-if="item.from*1==data.myInfo.account*1" :src="item.file.url"
                     alt="321">
              </a>
            </div>
            <div v-if="item.type=='file'&&data" style="width: 100%;float: left;margin: 0.5em">
              <img class="chat-msg-img pull-left" v-if="item.from*1!=data.myInfo.account*1"
                   :src="item.from*1!=data.myInfo.account*1?friendImg(item.from):data.myInfo.avatar" alt="321">
              <span v-if="item.from*1!=data.myInfo.account*1"
                    v-bind:class="item.from*1!=data.myInfo.account*1?'pull-left':'pull-right'"
                    v-bind:style="item.from*1!=data.myInfo.account*1?'background-color: #5cacde;color: #fff;'
              :'color: #666;background-color: ##fff;'" v-emoji>
          <a class="pull-left" :href="item.file.url">{{item.file.name}}<br>
            <div class="text-center" style="width: 100%">点击下载</div></a></span>

              <img class="chat-msg-img pull-right" style="margin-left:0.5em" v-if="item.from*1==data.myInfo.account*1"
                   :src="item.from*1!=data.myInfo.account*1?friendImg(item.from):data.myInfo.avatar" alt="321">

              <span v-if="item.from*1==data.myInfo.account*1"
                    v-bind:class="item.from*1!=data.myInfo.account*1?'pull-left':'pull-right'"
                    v-bind:style="item.from*1!=data.myInfo.account*1?'background-color: #5cacde;color: #fff;'
              :'color: #666;background-color: ##fff;'" v-emoji><a class="pull-right" :href="item.file.url">
               {{item.file.name}}<br><div class="text-center" style="width: 100%">点击下载</div></a></span>
            </div>
          </div>
          <input class="focus-input" id="txt" type="tel" autofocus="autofocus">
        </div>
        <div class="bottom-emoji" v-if="showEmojiList">
          <div v-for="item,index in emojiUrl" :key="index">
            <img :src="item" @click="selectThisEmoji(item)" alt="">
            <!--<br v-if="(index+1)%8==0">-->
          </div>
        </div>
        <div class="bottom-input">
          <!--<textarea v-model='sendMsg' type="text">-->
          <!--</textarea>-->
          <p id="p" class="needsclick" contenteditable="true"></p>
          <a class="top-emoj">
            <img @click="toSelectEmoji" class="emoji-select-pic pull-left"
                 src="http://yx-web.nos.netease.com/webdoc/h5/im/chat-editor-1.png" alt="">
            <span class="u-editor-icon pull-right">
          <img class="selectPic" src="http://yx-web.nos.netease.com/webdoc/h5/im/chat-editor-2.png">
      <input class="file" name="file" type="file" ref="fileToSent" accept="" @change="update"/>
      </span>
          </a>

          <a class="pull-right send-btn" @click="send">发送</a>
        </div>
      </div>
      <div v-if="showChildNum==3">
        <div class="chatItem" v-if="data.msgs&&data.msgs!=''&&!isHistory">
          <div class="chat-msg text-left" v-for="item,index in data.msgs['team-'+id]">
            <div v-if="item.type=='text'" style="width: 100%;float: left;margin: 0.5em">
              <img class="chat-msg-img" v-bind:class="item.from*1!=data.myInfo.account*1?'pull-left':'pull-right'"
                   v-bind:style="item.from*1!=data.myInfo.account*1?'':'margin-left:0.5em'"
                   :src="item.from*1!=data.myInfo.account*1?friendImg(item.from):data.myInfo.avatar" alt="321">
              <div v-if="item.from*1!=data.myInfo.account*1&&type.split('-')[0]!='p2p'" style="margin-bottom: -1.5em">
                {{item.fromNick}}
              </div>
              <span v-bind:class="item.from*1!=data.myInfo.account*1?'pull-left':'pull-right'"
                    v-bind:style="item.from*1!=data.myInfo.account*1?'background-color: #5cacde;color: #fff;'
              :'color: #666;background-color: ##fff;'" v-emoji>{{item.text}}</span>
            </div>
            <div v-if="item.type=='image'&&data" style="width: 100%;float: left;margin: 0.5em">
              <img class="chat-msg-img pull-left" v-if="item.from*1!=data.myInfo.account*1"
                   :src="item.from*1!=data.myInfo.account*1?friendImg(item.from):data.myInfo.avatar" alt="321">
              <div v-if="item.from*1!=data.myInfo.account*1&&type.split('-')[0]!='p2p'" style="margin-bottom: -1.5em">
                {{item.fromNick}}
              </div>
              <a :href="item.file.url">
                <img class="recieve-img pull-left" v-if="item.from*1!=data.myInfo.account*1" :src="item.file.url"
                     alt="321">
              </a>
              <img class="chat-msg-img pull-right" style="margin-left:0.5em" v-if="item.from*1==data.myInfo.account*1"
                   :src="item.from*1!=data.myInfo.account*1?friendImg(item.from):data.myInfo.avatar" alt="321">
              <a :href="item.file.url" download="">
                <img class="recieve-img pull-right" v-if="item.from*1==data.myInfo.account*1" :src="item.file.url"
                     alt="321">
              </a>
            </div>
            <div v-if="item.type=='file'&&data" style="width: 100%;float: left;margin: 0.5em">
              <img class="chat-msg-img pull-left" v-if="item.from*1!=data.myInfo.account*1"
                   :src="item.from*1!=data.myInfo.account*1?friendImg(item.from):data.myInfo.avatar" alt="321">
              <span v-if="item.from*1!=data.myInfo.account*1"
                    v-bind:class="item.from*1!=data.myInfo.account*1?'pull-left':'pull-right'"
                    v-bind:style="item.from*1!=data.myInfo.account*1?'background-color: #5cacde;color: #fff;'
              :'color: #666;background-color: ##fff;'" v-emoji>
          <a class="pull-left" :href="item.file.url">{{item.file.name}}<br>
            <div class="text-center" style="width: 100%">点击下载</div></a></span>

              <img class="chat-msg-img pull-right" style="margin-left:0.5em" v-if="item.from*1==data.myInfo.account*1"
                   :src="item.from*1!=data.myInfo.account*1?friendImg(item.from):data.myInfo.avatar" alt="321">

              <span v-if="item.from*1==data.myInfo.account*1"
                    v-bind:class="item.from*1!=data.myInfo.account*1?'pull-left':'pull-right'"
                    v-bind:style="item.from*1!=data.myInfo.account*1?'background-color: #5cacde;color: #fff;'
              :'color: #666;background-color: ##fff;'" v-emoji><a class="pull-right" :href="item.file.url">
               {{item.file.name}}<br><div class="text-center" style="width: 100%">点击下载</div></a></span>
            </div>
          </div>
          <input class="focus-input" id="txt" type="tel" autofocus="autofocus">
        </div>
        <div class="chatItem" v-if="historyList&&historyList!=''&&isHistory">
          <div class="chat-msg text-left" v-for="item,index in historyList">
            <div v-if="item.type=='text'" style="width: 100%;float: left;margin: 0.5em">
              <img class="chat-msg-img" v-bind:class="item.from*1!=data.myInfo.account*1?'pull-left':'pull-right'"
                   v-bind:style="item.from*1!=data.myInfo.account*1?'':'margin-left:0.5em'"
                   :src="item.from*1!=data.myInfo.account*1?friendImg(item.from):data.myInfo.avatar" alt="321">
              <div v-if="item.from*1!=data.myInfo.account*1&&type.split('-')[0]!='p2p'" style="margin-bottom: -1.5em">
                {{item.fromNick}}
              </div>
              <span v-bind:class="item.from*1!=data.myInfo.account*1?'pull-left':'pull-right'"
                    v-bind:style="item.from*1!=data.myInfo.account*1?'background-color: #5cacde;color: #fff;'
              :'color: #666;background-color: ##fff;'" v-emoji>{{item.text}}</span>
            </div>
            <div v-if="item.type=='image'&&data" style="width: 100%;float: left;margin: 0.5em">
              <img class="chat-msg-img pull-left" v-if="item.from*1!=data.myInfo.account*1"
                   :src="item.from*1!=data.myInfo.account*1?friendImg(item.from):data.myInfo.avatar" alt="321">
              <div v-if="item.from*1!=data.myInfo.account*1&&type.split('-')[0]!='p2p'" style="margin-bottom: -1.5em">
                {{item.fromNick}}
              </div>
              <a :href="item.file.url">
                <img class="recieve-img pull-left" v-if="item.from*1!=data.myInfo.account*1" :src="item.file.url"
                     alt="321">
              </a>
              <img class="chat-msg-img pull-right" style="margin-left:0.5em" v-if="item.from*1==data.myInfo.account*1"
                   :src="item.from*1!=data.myInfo.account*1?friendImg(item.from):data.myInfo.avatar" alt="321">
              <a :href="item.file.url" download="">
                <img class="recieve-img pull-right" v-if="item.from*1==data.myInfo.account*1" :src="item.file.url"
                     alt="321">
              </a>
            </div>
            <div v-if="item.type=='amr'&&data" style="width: 100%;float: left;margin: 0.5em">
              <img class="chat-msg-img pull-left" v-if="item.from*1!=data.myInfo.account*1"
                   :src="item.from*1!=data.myInfo.account*1?friendImg(item.from):data.myInfo.avatar" alt="321">
              <div v-if="item.from*1!=data.myInfo.account*1&&type.split('-')[0]!='p2p'" style="margin-bottom: -1.5em">
                {{item.fromNick}}
              </div>
              <a :href="item.file.url">
                <img class="recieve-img pull-left" v-if="item.from*1!=data.myInfo.account*1" :src="item.file.url"
                     alt="321">
              </a>
              <img class="chat-msg-img pull-right" style="margin-left:0.5em" v-if="item.from*1==data.myInfo.account*1"
                   :src="item.from*1!=data.myInfo.account*1?friendImg(item.from):data.myInfo.avatar" alt="321">
              <a :href="item.file.url" download="">
                <img class="recieve-img pull-right" v-if="item.from*1==data.myInfo.account*1" :src="item.file.url"
                     alt="321">
              </a>
            </div>
            <div v-if="item.type=='file'&&data" style="width: 100%;float: left;margin: 0.5em">
              <img class="chat-msg-img pull-left" v-if="item.from*1!=data.myInfo.account*1"
                   :src="item.from*1!=data.myInfo.account*1?friendImg(item.from):data.myInfo.avatar" alt="321">
              <span v-if="item.from*1!=data.myInfo.account*1"
                    v-bind:class="item.from*1!=data.myInfo.account*1?'pull-left':'pull-right'"
                    v-bind:style="item.from*1!=data.myInfo.account*1?'background-color: #5cacde;color: #fff;'
              :'color: #666;background-color: ##fff;'" v-emoji>
          <a class="pull-left" :href="item.file.url">{{item.file.name}}<br>
            <div class="text-center" style="width: 100%">点击下载</div></a></span>

              <img class="chat-msg-img pull-right" style="margin-left:0.5em" v-if="item.from*1==data.myInfo.account*1"
                   :src="item.from*1!=data.myInfo.account*1?friendImg(item.from):data.myInfo.avatar" alt="321">

              <span v-if="item.from*1==data.myInfo.account*1"
                    v-bind:class="item.from*1!=data.myInfo.account*1?'pull-left':'pull-right'"
                    v-bind:style="item.from*1!=data.myInfo.account*1?'background-color: #5cacde;color: #fff;'
              :'color: #666;background-color: ##fff;'" v-emoji><a class="pull-right" :href="item.file.url">
               {{item.file.name}}<br><div class="text-center" style="width: 100%">点击下载</div></a></span>
            </div>
          </div>
          <input class="focus-input" id="txt" type="tel" autofocus="autofocus">
        </div>
        <div class="bottom-emoji" v-if="showEmojiList">
          <div v-for="item,index in emojiUrl" :key="index">
            <img :src="item" @click="selectThisEmoji(item)" alt="">
            <!--<br v-if="(index+1)%8==0">-->
          </div>
        </div>
        <div class="bottom-input">
          <!--<textarea v-model='sendMsg' type="text">-->
          <!--</textarea>-->
          <p id="p" class="needsclick" contenteditable="true"></p>
          <a class="top-emoj">
            <img @click="toSelectEmoji" class="emoji-select-pic pull-left"
                 src="http://yx-web.nos.netease.com/webdoc/h5/im/chat-editor-1.png" alt="">
            <span class="u-editor-icon pull-right">
          <img class="selectPic" src="http://yx-web.nos.netease.com/webdoc/h5/im/chat-editor-2.png">
      <input class="file" name="file" type="file" ref="fileToSent" accept="" @change="update"/>
      </span>
          </a>

          <a class="pull-right send-btn" @click="send">发送</a>
        </div>
      </div>
    </div>
    <div v-if="showChildNum==4">444444444444</div>
  </div>
  </div>
</template>
<script>
  export default {
    name: "",
    data() {
      return {
        chatTitle: '企业通信',
        input: '',
        title: '',
        chatIndex: 0,
        userInfo: {},
        organInfo: {},
        chatList: {},
        showChildNum: 0,
        msg: '',
        isChat: true,
        friendList: [],
        data: {},
        value1: '',
        selectItem: true,
        nim: '',
        teamName: '',
        list: [],
        userList: {},
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        show: false,
        showEmojiList: false,
        isHistory: false,
        id: '',
        teamId: '',
        sendMsg: '',
        emojiList: {
          "[大笑]": {file: "emoji_0.png"},
          "[可爱]": {file: "emoji_01.png"},
          "[色]": {file: "emoji_02.png"},
          "[嘘]": {file: "emoji_03.png"},
          "[亲]": {file: "emoji_04.png"},
          "[呆]": {file: "emoji_05.png"},
          "[口水]": {file: "emoji_06.png"},
          "[汗]": {file: "emoji_145.png"},
          "[呲牙]": {file: "emoji_07.png"},
          "[鬼脸]": {file: "emoji_08.png"},
          "[害羞]": {file: "emoji_09.png"},
          "[偷笑]": {file: "emoji_10.png"},
          "[调皮]": {file: "emoji_11.png"},
          "[可怜]": {file: "emoji_12.png"},
          "[敲]": {file: "emoji_13.png"},
          "[惊讶]": {file: "emoji_14.png"},
          "[流感]": {file: "emoji_15.png"},
          "[委屈]": {file: "emoji_16.png"},
          "[流泪]": {file: "emoji_17.png"},
          "[嚎哭]": {file: "emoji_18.png"},
          "[惊恐]": {file: "emoji_19.png"},
          "[怒]": {file: "emoji_20.png"},
          "[酷]": {file: "emoji_21.png"},
          "[不说]": {file: "emoji_22.png"},
          "[鄙视]": {file: "emoji_23.png"},
          "[阿弥陀佛]": {file: "emoji_24.png"},
          "[奸笑]": {file: "emoji_25.png"},
          "[睡着]": {file: "emoji_26.png"},
          "[口罩]": {file: "emoji_27.png"},
          "[努力]": {file: "emoji_28.png"},
          "[抠鼻孔]": {file: "emoji_29.png"},
          "[疑问]": {file: "emoji_30.png"},
          "[怒骂]": {file: "emoji_31.png"},
          "[晕]": {file: "emoji_32.png"},
          "[呕吐]": {file: "emoji_33.png"},
          "[拜一拜]": {file: "emoji_160.png"},
          "[惊喜]": {file: "emoji_161.png"},
          "[流汗]": {file: "emoji_162.png"},
          "[卖萌]": {file: "emoji_163.png"},
          "[默契眨眼]": {file: "emoji_164.png"},
          "[烧香拜佛]": {file: "emoji_165.png"},
          "[晚安]": {file: "emoji_166.png"},
          "[强]": {file: "emoji_34.png"},
          "[弱]": {file: "emoji_35.png"},
          "[OK]": {file: "emoji_36.png"},
          "[拳头]": {file: "emoji_37.png"},
          "[胜利]": {file: "emoji_38.png"},
          "[鼓掌]": {file: "emoji_39.png"},
          "[握手]": {file: "emoji_200.png"},
          "[发怒]": {file: "emoji_40.png"},
          "[骷髅]": {file: "emoji_41.png"},
          "[便便]": {file: "emoji_42.png"},
          "[火]": {file: "emoji_43.png"},
          "[溜]": {file: "emoji_44.png"},
          "[爱心]": {file: "emoji_45.png"},
          "[心碎]": {file: "emoji_46.png"},
          "[钟情]": {file: "emoji_47.png"},
          "[唇]": {file: "emoji_48.png"},
          "[戒指]": {file: "emoji_49.png"},
          "[钻石]": {file: "emoji_50.png"},
          "[太阳]": {file: "emoji_51.png"},
          "[有时晴]": {file: "emoji_52.png"},
          "[多云]": {file: "emoji_53.png"},
          "[雷]": {file: "emoji_54.png"},
          "[雨]": {file: "emoji_55.png"},
          "[雪花]": {file: "emoji_56.png"},
          "[爱人]": {file: "emoji_57.png"},
          "[帽子]": {file: "emoji_58.png"},
          "[皇冠]": {file: "emoji_59.png"},
          "[篮球]": {file: "emoji_60.png"},
          "[足球]": {file: "emoji_61.png"},
          "[垒球]": {file: "emoji_62.png"},
          "[网球]": {file: "emoji_63.png"},
          "[台球]": {file: "emoji_64.png"},
          "[咖啡]": {file: "emoji_65.png"},
          "[啤酒]": {file: "emoji_66.png"},
          "[干杯]": {file: "emoji_67.png"},
          "[柠檬汁]": {file: "emoji_68.png"},
          "[餐具]": {file: "emoji_69.png"},
          "[汉堡]": {file: "emoji_70.png"},
          "[鸡腿]": {file: "emoji_71.png"},
          "[面条]": {file: "emoji_72.png"},
          "[冰淇淋]": {file: "emoji_73.png"},
          "[沙冰]": {file: "emoji_74.png"},
          "[生日蛋糕]": {file: "emoji_75.png"},
          "[蛋糕]": {file: "emoji_76.png"},
          "[糖果]": {file: "emoji_77.png"},
          "[葡萄]": {file: "emoji_78.png"},
          "[西瓜]": {file: "emoji_79.png"},
          "[光碟]": {file: "emoji_80.png"},
          "[手机]": {file: "emoji_81.png"},
          "[电话]": {file: "emoji_82.png"},
          "[电视]": {file: "emoji_83.png"},
          "[声音开启]": {file: "emoji_84.png"},
          "[声音关闭]": {file: "emoji_85.png"},
          "[铃铛]": {file: "emoji_86.png"},
          "[锁头]": {file: "emoji_87.png"},
          "[放大镜]": {file: "emoji_88.png"},
          "[灯泡]": {file: "emoji_89.png"},
          "[锤头]": {file: "emoji_90.png"},
          "[烟]": {file: "emoji_91.png"},
          "[炸弹]": {file: "emoji_92.png"},
          "[枪]": {file: "emoji_93.png"},
          "[刀]": {file: "emoji_94.png"},
          "[药]": {file: "emoji_95.png"},
          "[打针]": {file: "emoji_96.png"},
          "[钱袋]": {file: "emoji_97.png"},
          "[钞票]": {file: "emoji_98.png"},
          "[银行卡]": {file: "emoji_99.png"},
          "[手柄]": {file: "emoji_100.png"},
          "[麻将]": {file: "emoji_101.png"},
          "[调色板]": {file: "emoji_102.png"},
          "[电影]": {file: "emoji_103.png"},
          "[麦克风]": {file: "emoji_104.png"},
          "[耳机]": {file: "emoji_105.png"},
          "[音乐]": {file: "emoji_106.png"},
          "[吉他]": {file: "emoji_107.png"},
          "[火箭]": {file: "emoji_108.png"},
          "[飞机]": {file: "emoji_109.png"},
          "[火车]": {file: "emoji_110.png"},
          "[公交]": {file: "emoji_111.png"},
          "[轿车]": {file: "emoji_112.png"},
          "[出租车]": {file: "emoji_113.png"},
          "[警车]": {file: "emoji_114.png"},
          "[自行车]": {file: "emoji_115.png"}
        },
        getEmoji: [],
        emojiBaseUrl: `http://yx-web.nosdn.127.net/webdoc/h5/emoji`,
        emojiUrl: [],
        count: 123,
        type: '',
        historyList: [],
        timerId: ''
      };
    },
    directives: {
      emoji: {
        inserted: function (el, binding) {
          let emojiList = {
            "[大笑]": {file: "emoji_0.png"},
            "[可爱]": {file: "emoji_01.png"},
            "[色]": {file: "emoji_02.png"},
            "[嘘]": {file: "emoji_03.png"},
            "[亲]": {file: "emoji_04.png"},
            "[呆]": {file: "emoji_05.png"},
            "[口水]": {file: "emoji_06.png"},
            "[汗]": {file: "emoji_145.png"},
            "[呲牙]": {file: "emoji_07.png"},
            "[鬼脸]": {file: "emoji_08.png"},
            "[害羞]": {file: "emoji_09.png"},
            "[偷笑]": {file: "emoji_10.png"},
            "[调皮]": {file: "emoji_11.png"},
            "[可怜]": {file: "emoji_12.png"},
            "[敲]": {file: "emoji_13.png"},
            "[惊讶]": {file: "emoji_14.png"},
            "[流感]": {file: "emoji_15.png"},
            "[委屈]": {file: "emoji_16.png"},
            "[流泪]": {file: "emoji_17.png"},
            "[嚎哭]": {file: "emoji_18.png"},
            "[惊恐]": {file: "emoji_19.png"},
            "[怒]": {file: "emoji_20.png"},
            "[酷]": {file: "emoji_21.png"},
            "[不说]": {file: "emoji_22.png"},
            "[鄙视]": {file: "emoji_23.png"},
            "[阿弥陀佛]": {file: "emoji_24.png"},
            "[奸笑]": {file: "emoji_25.png"},
            "[睡着]": {file: "emoji_26.png"},
            "[口罩]": {file: "emoji_27.png"},
            "[努力]": {file: "emoji_28.png"},
            "[抠鼻孔]": {file: "emoji_29.png"},
            "[疑问]": {file: "emoji_30.png"},
            "[怒骂]": {file: "emoji_31.png"},
            "[晕]": {file: "emoji_32.png"},
            "[呕吐]": {file: "emoji_33.png"},
            "[拜一拜]": {file: "emoji_160.png"},
            "[惊喜]": {file: "emoji_161.png"},
            "[流汗]": {file: "emoji_162.png"},
            "[卖萌]": {file: "emoji_163.png"},
            "[默契眨眼]": {file: "emoji_164.png"},
            "[烧香拜佛]": {file: "emoji_165.png"},
            "[晚安]": {file: "emoji_166.png"},
            "[强]": {file: "emoji_34.png"},
            "[弱]": {file: "emoji_35.png"},
            "[OK]": {file: "emoji_36.png"},
            "[拳头]": {file: "emoji_37.png"},
            "[胜利]": {file: "emoji_38.png"},
            "[鼓掌]": {file: "emoji_39.png"},
            "[握手]": {file: "emoji_200.png"},
            "[发怒]": {file: "emoji_40.png"},
            "[骷髅]": {file: "emoji_41.png"},
            "[便便]": {file: "emoji_42.png"},
            "[火]": {file: "emoji_43.png"},
            "[溜]": {file: "emoji_44.png"},
            "[爱心]": {file: "emoji_45.png"},
            "[心碎]": {file: "emoji_46.png"},
            "[钟情]": {file: "emoji_47.png"},
            "[唇]": {file: "emoji_48.png"},
            "[戒指]": {file: "emoji_49.png"},
            "[钻石]": {file: "emoji_50.png"},
            "[太阳]": {file: "emoji_51.png"},
            "[有时晴]": {file: "emoji_52.png"},
            "[多云]": {file: "emoji_53.png"},
            "[雷]": {file: "emoji_54.png"},
            "[雨]": {file: "emoji_55.png"},
            "[雪花]": {file: "emoji_56.png"},
            "[爱人]": {file: "emoji_57.png"},
            "[帽子]": {file: "emoji_58.png"},
            "[皇冠]": {file: "emoji_59.png"},
            "[篮球]": {file: "emoji_60.png"},
            "[足球]": {file: "emoji_61.png"},
            "[垒球]": {file: "emoji_62.png"},
            "[网球]": {file: "emoji_63.png"},
            "[台球]": {file: "emoji_64.png"},
            "[咖啡]": {file: "emoji_65.png"},
            "[啤酒]": {file: "emoji_66.png"},
            "[干杯]": {file: "emoji_67.png"},
            "[柠檬汁]": {file: "emoji_68.png"},
            "[餐具]": {file: "emoji_69.png"},
            "[汉堡]": {file: "emoji_70.png"},
            "[鸡腿]": {file: "emoji_71.png"},
            "[面条]": {file: "emoji_72.png"},
            "[冰淇淋]": {file: "emoji_73.png"},
            "[沙冰]": {file: "emoji_74.png"},
            "[生日蛋糕]": {file: "emoji_75.png"},
            "[蛋糕]": {file: "emoji_76.png"},
            "[糖果]": {file: "emoji_77.png"},
            "[葡萄]": {file: "emoji_78.png"},
            "[西瓜]": {file: "emoji_79.png"},
            "[光碟]": {file: "emoji_80.png"},
            "[手机]": {file: "emoji_81.png"},
            "[电话]": {file: "emoji_82.png"},
            "[电视]": {file: "emoji_83.png"},
            "[声音开启]": {file: "emoji_84.png"},
            "[声音关闭]": {file: "emoji_85.png"},
            "[铃铛]": {file: "emoji_86.png"},
            "[锁头]": {file: "emoji_87.png"},
            "[放大镜]": {file: "emoji_88.png"},
            "[灯泡]": {file: "emoji_89.png"},
            "[锤头]": {file: "emoji_90.png"},
            "[烟]": {file: "emoji_91.png"},
            "[炸弹]": {file: "emoji_92.png"},
            "[枪]": {file: "emoji_93.png"},
            "[刀]": {file: "emoji_94.png"},
            "[药]": {file: "emoji_95.png"},
            "[打针]": {file: "emoji_96.png"},
            "[钱袋]": {file: "emoji_97.png"},
            "[钞票]": {file: "emoji_98.png"},
            "[银行卡]": {file: "emoji_99.png"},
            "[手柄]": {file: "emoji_100.png"},
            "[麻将]": {file: "emoji_101.png"},
            "[调色板]": {file: "emoji_102.png"},
            "[电影]": {file: "emoji_103.png"},
            "[麦克风]": {file: "emoji_104.png"},
            "[耳机]": {file: "emoji_105.png"},
            "[音乐]": {file: "emoji_106.png"},
            "[吉他]": {file: "emoji_107.png"},
            "[火箭]": {file: "emoji_108.png"},
            "[飞机]": {file: "emoji_109.png"},
            "[火车]": {file: "emoji_110.png"},
            "[公交]": {file: "emoji_111.png"},
            "[轿车]": {file: "emoji_112.png"},
            "[出租车]": {file: "emoji_113.png"},
            "[警车]": {file: "emoji_114.png"},
            "[自行车]": {file: "emoji_115.png"}
          };
          var getEmoji = [];
          var emojiUrl = [];
          for (let emoji in emojiList) {
            let emojiItem = emojiList[emoji]
            getEmoji.push(emoji)
            for (let key in emojiItem) {
              let item = emojiItem[key];
              emojiUrl.push('http://yx-web.nosdn.127.net/webdoc/h5/emoji/emoji/' + item)
            }
          }
          var object = el.innerHTML;
          if (object.split('[').length > 0 && object.split(']').length > 0) {
            var newEl = object.split('[')[0]
            for (var i = 1; i < object.split('[').length; i++) {
              for (var j = 0; j < getEmoji.length; j++) {
                if (getEmoji[j] == '[' + object.split('[')[i].split(']')[0] + ']') {
                  newEl = newEl + '<img style="margin: 0;margin-bottom: -0.4em" src="' + emojiUrl[j] + '" alt="">' + object.split('[')[i].split(']')[1]
                }
              }
            }
            el.innerHTML = newEl
          }
        }
      }
    },
    methods: {
      send() {
        this.show = true;
        var obj = document.getElementById("p");
        this.showEmojiList = false;
        this.sendMsg = '';
        if (obj.innerHTML.split('emoji_').length > 0) {
          var sendMsg = '';
          for (var i = 0; i < obj.innerHTML.split('alt="">').length; i++) {
            if (i == obj.innerHTML.split('alt="">').length - 1) {
              if (obj.innerHTML.split(' alt="">')[i]) {
                sendMsg = sendMsg + obj.innerHTML.split('alt="">')[i];
                console.log(sendMsg)
              }
            } else {
              sendMsg = sendMsg + obj.innerHTML.split('alt="">')[i].split('<img')[0];

              for (var j = 0; j < this.getEmoji.length; j++) {
                if (obj.innerHTML.split('alt="">')[i].split('emoji_')[1].split('.png')[0] * 1 == this.emojiUrl[j].split('emoji_')[1].split('.png')[0] * 1) {
                  sendMsg = sendMsg + this.getEmoji[j];
                }

              }
            }
//            sendMsg=sendMsg+ obj.innerHTML.split('emoji_')[i].split('alt="">')[1];
          }
          console.log(this.sendMsg + '1234')
          this.sendMsg = sendMsg;
          var lastMsg = ''
          for (var i = 0; i < this.sendMsg.split('<br>').length; i++) {
            lastMsg = lastMsg + this.sendMsg.split('<br>')[i];
          }
          this.sendMsg = lastMsg
          var clearMsg = '';
          console.log(this.sendMsg)
          if (this.sendMsg.split('&nbsp;').length > 0) {
            for (var i = 0; i < this.sendMsg.split('&nbsp;').length; i++) {
              console.log(this.sendMsg.split('&nbsp;')[i])
              clearMsg = clearMsg + this.sendMsg.split('&nbsp;')[i];
            }
            this.sendMsg = clearMsg
          }
          setTimeout(function () {
            document.getElementById('txt').focus();
            document.getElementById("txt").blur();
          }, 100)
          // this.show=false;
          console.log(this.sendMsg + '1111')
        }
        else {
          this.sendMsg = obj.innerHTML
        }
        this.getFriendList();
        if (this.sendMsg && this.sendMsg != '' && !this.teamId) {
          console.log(this.sendMsg);
          var msg = this.nim.sendText({
            scene: 'p2p',
            to: this.id.split('-')[this.id.split('-').length - 1],
            text: this.sendMsg,
            done: this.sendMsgDone
          });
          obj.innerHTML = '';
          console.log('正在发送p2p text消息, id=' + msg.idClient);
          this.pushMsg(msg);
        } else if (this.sendMsg && this.sendMsg != '' && this.teamId) {
          console.log(this.teamId * 1)
          var msg = this.nim.sendText({
            scene: 'team',
            to: this.type.split('-')[this.type.split('-').length - 1],
            text: this.sendMsg,
            done: this.sendMsgDone
          });
          obj.innerHTML = '';
          console.log(msg)
          console.log('正在发送p2p text消息, id=' + msg.idClient);
          this.pushMsg(msg);
        }
      },
      update(e) {
        console.log(this.$refs.fileToSent)
        let file = e.target.files[0];
        console.log(file)
        if (file.type.split('image')) {

        }
        var toType = file.type.split('image').length > 1 ? 'image' : 'file'
        let d = new Date();
        let type = file.name.split('.');
//        let tokenParem = {
//          'putPolicy':'{\"name\":\"$(fname)\",\"size\":\"$(fsize)\",\"w\":\"$(imageInfo.width)\",\"h\":\"$(imageInfo.height)\",\"hash\":\"$(etag)\"}',
//          'key':'orderReview/'+d.getFullYear()+'/'+(d.getMonth()+1)+'/'+d.getDate()+'/'+d.valueOf()+'.'+type[type.length-1],
//          'bucket':this.getHearLog.domain,//七牛的地址，这个是你自己配置的（变量）
//        };
        let param = new FormData(); //创建form对象
        param.append('chunk', '0');//断点传输
        param.append('chunks', '1');
        param.append('file', file, file.name);
        var goType = this.teamId ? 'team' : 'p2p';
        this.nim.sendFile({
          scene: goType,
          to: this.type.split('-')[this.type.split('-').length - 1],
          type: toType,
          fileInput: this.$refs.fileToSent,
          beginupload: this.beginupload,
          uploadprogress: this.uploadprogress,
          uploaddone: this.uploaddone,
          beforesend: this.beforesend,
          done: this.sendMsgDone
        });
      },
      toSelectEmoji() {
        this.showEmojiList = !this.showEmojiList
      },
      getCheckedKeys() {
        console.log(this.$refs.tree.getCheckedKeys());
        this.id = this.$refs.tree.getCheckedKeys().userId;
        this.data.msgs[sessionId] = this.nim.mergeMsgs(this.data.msgs[sessionId], msgs);
        this.type = this.id;
      },
      showKey(data) {
        console.log(data)
      },
      handleCheckChange(data, checked, indeterminate) {
        console.log(data, checked, indeterminate);
      },
      cancel() {
        this.showChildNum = 0;
      },
      selectIt(data) {
        this.id = data.userId;
        if (data.userId && this.chatIndex != 1) {
          this.type = this.id;
          this.chatTitle=data.label;
          this.showChildNum = 3;
        }
        // this.cancel()
      },
      getUserList() {
        var data = {
          token: localStorage.getItem('to'),
          organId: this.organInfo.guid,
        }
        this.$ajax(
          `${this.subUrl.user}/admin/deptManage/organDepartmentInfo`,
          data,
          res => {
            this.userList = JSON.parse(JSON.stringify(res.data).replace(/empList/g, "children"));
            this.userList = JSON.parse(JSON.stringify(this.userList).replace(/deptName/g, "label"));
            this.userList = JSON.parse(JSON.stringify(this.userList).replace(/userName/g, "label"));

            console.log(this.userList);
            // this.$message.success("操作成功");
            // this.back();
          },
          this
        );
      },
      submitHandler(value) {
        this.$dialog.toast({mes: `搜索：${value}`});
      },
      sureAdd() {
        if (this.input && this.input != '') {
          this.createTeam();
          setTimeout(() => {
            // this.$router.go(-1)
          }, 300);
        } else {
          this.$message.success('请输入群名称！');
          // this.$dialog.toast({
          //   mes: '请输入群名称'
          // });
        }
      },
      showChild(type, index) {
        this.chatIndex = index;
        this.chatTitle = this.data.teams[index].name
        this.showChildNum = type;
        console.log(this.chatIndex + ',' + this.showChildNum)
        this.teamId = this.data.teams[index].teamId;
        console.log(this.teamId)
        this.type = 'team-' + this.teamId
        if (this.teamId) {
          for (var i = 0; i < this.data.users.length; i++) {
            if (this.data.teams[i].teamId == this.teamId) {
              this.title = this.data.teams[i].name;
            }
          }
        }
      },
      getTeamNum() {
        this.nim.getTeamMembers({
          teamId: '210020969',
          done: this.getTeamMembersDone
        });
      },
      addNo() {
        this.nim.addTeamMembers({
          teamId: '221336667',
          accounts: ['383935200297484288', '383935200297484288', '385788811705057280', '385788811705057280'],
          ps: '加入我们的群吧',
          done: this.addTeamMembersDone
        })
      },
      addTeamMembersDone(error, obj) {
        console.log(error);
        console.log(obj);
        console.log('入群邀请发送' + (!error ? '成功' : '失败'));
      },
      getTeamMembersDone(error, obj) {
        console.log(error);
        console.log(obj);
        console.log('获取群成员' + (!error ? '成功' : '失败'));
        if (!error) {
          this.onTeamMembers(obj);
        }
      },
      createTeam() {
        this.list = [];
        console.log(this.$refs.tree.getCheckedKeys());
        this.nim.createTeam({
          type: 'normal',
          name: this.input,
          avatar: 'avatar',
          accounts: this.$refs.tree.getCheckedKeys(),
          ps: '我建了群' + this.input,
          done: this.createTeamDone,
          onteams: this.onTeams
        })
        ;
      },
      createTeamDone(error, obj) {
        console.log(error);
        console.log(obj);
        console.log('创建' + obj.team.type + '群' + (!error ? '成功' : '失败'));
        this.nim.getTeams({
          done: this.getTeamsDone
        })
        this.$message.success('创建' + this.input + '群' + (!error ? '成功' : '失败'))
        if (!error) {
          this.onCreateTeam(obj.team, obj.owner);
        }
      },
      getTeamsDone(error, teams) {
        console.log(error);
        console.log(teams);
        console.log('获取群列表' + (!error ? '成功' : '失败'));
        this.cancel();
        if (!error) {
          onTeams(teams);
        }
      },
      toChat(data) {
        this.$router.push('/message/sessions?id=' + data)
      },
      lookFriends() {
        this.$router.push('/message/friends')
      },
      addTeam() {
        this.$router.push('/message/create_team')
      },
      toTeamChat(data) {
        this.$router.push('/message/sessions?teamId=' + data)
      },
      selectList() {
        this.isChat = !this.isChat
      },
      getFriendList() {
        this.nim = NIM.getInstance({
          // 初始化SDK
          debug: false,
//        appKey: 'appKey',
//        account: 'account',
//        token: 'token',
          appKey: '0b6aba3c2b82dedab966de3264037804',
          account: JSON.parse(decodeURIComponent(localStorage.getItem('userInfo'))).guid,
          token: JSON.parse(decodeURIComponent(localStorage.getItem('userInfo'))).imToken,
          onconnect: this.onConnect,
          onerror: this.onError,
          onwillreconnect: this.onWillReconnect,
          ondisconnect: this.onDisconnect,
          // 多端登录
          onloginportschange: this.onLoginPortsChange,
          // 用户关系
          onblacklist: this.onBlacklist,
          onsyncmarkinblacklist: this.onMarkInBlacklist,
          onmutelist: this.onMutelist,
          onsyncmarkinmutelist: this.onMarkInMutelist,
          // 好友关系
          onfriends: this.onFriends,
          onsyncfriendaction: this.onSyncFriendAction,
          // 用户名片
          onmyinfo: this.onMyInfo,
          onupdatemyinfo: this.onUpdateMyInfo,
          onusers: this.onUsers,
          onupdateuser: this.onUpdateUser,
          onrobots: this.onRobots,
          // 群组
          onteams: this.onTeams,
          onsynccreateteam: this.onCreateTeam,
          onteammembers: this.onTeamMembers,
          onsyncteammembersdone: this.onSyncTeamMembersDone,
          onupdateteammember: this.onUpdateTeamMember,
          // 会话
          onsessions: this.onSessions,
          onupdatesession: this.onUpdateSession,
          // 消息
          onroamingmsgs: this.onRoamingMsgs,
          onofflinemsgs: this.onOfflineMsgs,
          onmsg: this.onMsg,
          // 系统通知
          onofflinesysmsgs: this.onOfflineSysMsgs,
          onsysmsg: this.onSysMsg,
          onupdatesysmsg: this.onUpdateSysMsg,
          onsysmsgunread: this.onSysMsgUnread,
          onupdatesysmsgunread: this.onUpdateSysMsgUnread,
          onofflinecustomsysmsgs: this.onOfflineCustomSysMsgs,
          oncustomsysmsg: this.onCustomSysMsg,
          onbroadcastmsg: this.onBroadcastMsg,
          onbroadcastmsgs: this.onBroadcastMsgs,
          // 同步完成
          onsyncdone: this.onSyncDone,
          done: this.createTeamDone,
          onteams: this.onTeams
        })
        localStorage.setItem('nim', this.nim)
      },
      onConnect() {
        console.log('连接成功');
      },
      onWillReconnect(obj) {
        // 此时说明 `SDK` 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
        console.log('即将重连');
        console.log(obj.retryCount);
        console.log(obj.duration);
      },
      onDisconnect(error) {
        // 此时说明 `SDK` 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
        console.log('丢失连接');
        console.log(error);
        if (error) {
          switch (error.code) {
            // 账号或者密码错误, 请跳转到登录页面并提示错误
            case 302:
              break;
            // 被踢, 请提示错误后跳转到登录页面
            case 'kicked':
              break;
            default:
              break;
          }
        }
      },
      onError(error) {
        console.log(error);
      },

      onLoginPortsChange(loginPorts) {
        console.log('当前登录帐号在其它端的状态发生改变了', loginPorts);
      },

      onBlacklist(blacklist) {
        console.log('收到黑名单', blacklist);
        this.data = {}
        this.data.blacklist = this.nim.mergeRelations(this.data.blacklist, blacklist);
        this.data.blacklist = this.nim.cutRelations(this.data.blacklist, blacklist.invalid);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.refreshBlacklistUI();
      },
      onMarkInBlacklist(obj) {
        console.log(obj);
        console.log(obj.account + '被你在其它端' + (obj.isAdd ? '加入' : '移除') + '黑名单');
        if (obj.isAdd) {
          addToBlacklist(obj);
        } else {
          removeFromBlacklist(obj);
        }
      },
      addToBlacklist(obj) {
        this.data.blacklist = this.nim.mergeRelations(this.data.blacklist, obj.record);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.refreshBlacklistUI();
      },
      removeFromBlacklist(obj) {
        this.data.blacklist = this.nim.cutRelations(this.data.blacklist, obj.record);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.refreshBlacklistUI();
      },
      refreshBlacklistUI() {
        // 刷新界面
      },
      onMutelist(mutelist) {
        console.log('收到静音列表', mutelist);
        this.data.mutelist = this.nim.mergeRelations(this.data.mutelist, mutelist);
        this.data.mutelist = this.nim.cutRelations(this.data.mutelist, mutelist.invalid);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.refreshMutelistUI();
      },
      onMarkInMutelist(obj) {
        console.log(obj);
        console.log(obj.account + '被你' + (obj.isAdd ? '加入' : '移除') + '静音列表');
        if (obj.isAdd) {
          addToMutelist(obj);
        } else {
          removeFromMutelist(obj);
        }
      },
      addToMutelist(obj) {
        this.data.mutelist = this.nim.mergeRelations(this.data.mutelist, obj.record);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.refreshMutelistUI();
      },
      removeFromMutelist(obj) {
        this.data.mutelist = this.nim.cutRelations(this.data.mutelist, obj.record);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.refreshMutelistUI();
      },
      refreshMutelistUI() {
        // 刷新界面
      },

      onFriends(friends) {
        console.log('收到好友列表', friends);
        this.data.friends = this.nim.mergeFriends(this.data.friends, friends);
        this.data.friends = this.nim.cutFriends(this.data.friends, friends.invalid);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.refreshFriendsUI();
      },
      onSyncFriendAction(obj) {
        console.log(obj);
        switch (obj.type) {
          case 'addFriend':
            console.log('你在其它端直接加了一个好友' + obj.account + ', 附言' + obj.ps);
            this.onAddFriend(obj.friend);
            break;
          case 'applyFriend':
            console.log('你在其它端申请加了一个好友' + obj.account + ', 附言' + obj.ps);
            break;
          case 'passFriendApply':
            console.log('你在其它端通过了一个好友申请' + obj.account + ', 附言' + obj.ps);
            this.onAddFriend(obj.friend);
            break;
          case 'rejectFriendApply':
            console.log('你在其它端拒绝了一个好友申请' + obj.account + ', 附言' + obj.ps);
            break;
          case 'deleteFriend':
            console.log('你在其它端删了一个好友' + obj.account);
            onDeleteFriend(obj.account);
            break;
          case 'updateFriend':
            console.log('你在其它端更新了一个好友', obj.friend);
            onUpdateFriend(obj.friend);
            break;
        }
      },
      onAddFriend(friend) {
        this.data.friends = this.nim.mergeFriends(this.data.friends, friend);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.refreshFriendsUI();
      },
      onDeleteFriend(account) {
        this.data.friends = this.nim.cutFriendsByAccounts(this.data.friends, account);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.refreshFriendsUI();
      },
      onUpdateFriend(friend) {
        this.data.friends = this.nim.mergeFriends(this.data.friends, friend);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.refreshFriendsUI();
      },
      refreshFriendsUI() {
        // 刷新界面
      },

      onMyInfo(user) {
        console.log('收到我的名片', user);
        this.data.myInfo = user;
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.updateMyInfoUI();
      },
      onUpdateMyInfo(user) {
        console.log('我的名片更新了', user);
        this.data.myInfo = this.nim.util.merge(this.data.myInfo, user);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.updateMyInfoUI();
      },
      updateMyInfoUI() {
        // 刷新界面
      },
      onUsers(users) {
        console.log('收到用户名片列表', users);
        this.data.users = this.nim.mergeUsers(this.data.users, users);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
      },
      onUpdateUser(user) {
        console.log('用户名片更新了', user);
        this.data.users = this.nim.mergeUsers(this.data.users, user);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
      },
      onRobots(robots) {
        console.log('收到机器人列表', robots);
        this.data.robots = robots;
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
      },
      onTeams(teams) {
//        this.friendList = teams
//        console.log('群列表', teams);
//        localStorage.setItem('friendList', encodeURIComponent(JSON.stringify(this.friendList)));
        this.data.teams = this.nim.mergeTeams(this.data.teams, teams);
        console.log(123)
        var data = this.data;
        this.data = '';
        this.data = data;
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.onInvalidTeams(teams.invalid);
      },
      onInvalidTeams(teams) {
        this.data.teams = this.nim.cutTeams(this.data.teams, teams);
        var data = this.data;
        this.data = '';
        this.data = data;
        this.data.invalidTeams = this.nim.mergeTeams(this.data.invalidTeams, teams);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.refreshTeamsUI();
      },
      onCreateTeam(team) {
        console.log('你创建了一个群', team);
        this.data.teams = this.nim.mergeTeams(this.data.teams, team);
        var data = this.data;
        this.data = '';
        this.data = data;
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.refreshTeamsUI();
        this.onTeamMembers({
          teamId: team.teamId,
          members: owner
        });
      },
      refreshTeamsUI() {
        // 刷新界面
      },
      onTeamMembers(teamId, members) {
        console.log('群id', teamId, '群成员', members);
//        var teamId = obj.teamId;
//        var members = obj.members;
//         this.data.teamMembers =  this.data.teamMembers || {};
//         this.data.teamMembers[teamId] = this.nim.mergeTeamMembers( this.data.teamMembers[teamId], members);
//         this.data.teamMembers[teamId] = this.nim.cutTeamMembers( this.data.teamMembers[teamId], members.invalid);
        this.refreshTeamMembersUI();
      },
      onSyncTeamMembersDone() {
        var data = this.data;
        this.data = '';
        this.data = data;
        console.log('同步群列表完成');
      },
      onUpdateTeamMember(teamMember) {
        console.log('群成员信息更新了', teamMember);
        onTeamMembers({
          teamId: teamMember.teamId,
          members: teamMember
        });
      },
      refreshTeamMembersUI() {
        // 刷新界面
      },

      onSessions(sessions) {
        this.friendList = sessions
        console.log('群列表', sessions);
        console.log('收到会话列表', sessions);
        this.data.sessions = []
        this.data.sessions = this.nim.mergeSessions(this.data.sessions, sessions);
        var data = this.data;
        this.data = '';
        this.data = data;
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.updateSessionsUI();
      },
      onUpdateSession(session) {
        var data = this.data;
        this.data = '';
        this.data = data;
        console.log('会话更新了', session);
        navigator.vibrate(1000);
        this.data.sessions = this.nim.mergeSessions(this.data.sessions, session);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.updateSessionsUI();
      },
      updateSessionsUI() {
        // 刷新界面
      },

      onRoamingMsgs(obj) {
        console.log('漫游消息', obj);
        this.pushMsg(obj.msgs);
      },
      onOfflineMsgs(obj) {
        console.log('离线消息', obj);
        this.pushMsg(obj.msgs);
      },
      onMsg(msg) {
        console.log(msg)
        console.log('收到消息', msg.scene, msg.type, msg);
        this.pushMsg(msg);
      },
      onBroadcastMsg(msg) {
        console.log('收到广播消息', msg);
      },
      onBroadcastMsgs(msgs) {
        console.log('收到广播消息', msgs);
      },
      pushMsg(msgs) {
        if (!Array.isArray(msgs)) {
          msgs = [msgs];
        }
        var sessionId = msgs[0].sessionId;
        var data = this.data;
        this.data = '';
        this.data = data;
        this.data.msgs = this.data.msgs || {};
        if (this.data.msgs && this.data.msgs.length > 0) {
          setTimeout(function () {
            document.getElementById('txt').focus();
            document.getElementById("txt").blur();
          }, 100)
        }
        this.data.msgs[sessionId] = this.nim.mergeMsgs(this.data.msgs[sessionId], msgs);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
      },

      onOfflineSysMsgs(sysMsgs) {
        console.log('收到离线系统通知', sysMsgs);
        this.pushSysMsgs(sysMsgs);
      },
      onSysMsg(sysMsg) {
        console.log('收到系统通知', sysMsg)
        this.pushSysMsgs(sysMsg);
      },
      onUpdateSysMsg(sysMsg) {
        this.pushSysMsgs(sysMsg);
      },
      pushSysMsgs(sysMsgs) {
        this.data.sysMsgs = this.nim.mergeSysMsgs(this.data.sysMsgs, sysMsgs);
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.refreshSysMsgsUI();
      },
      onSysMsgUnread(obj) {
        console.log('收到系统通知未读数', obj);
        this.data.sysMsgUnread = obj;
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.refreshSysMsgsUI();
      },
      onUpdateSysMsgUnread(obj) {
        console.log('系统通知未读数更新了', obj);
        this.data.sysMsgUnread = obj;
        localStorage.setItem('chatData', encodeURIComponent(JSON.stringify(this.data)));
        this.refreshSysMsgsUI();
      },
      refreshSysMsgsUI() {
        // 刷新界面
      },
      onOfflineCustomSysMsgs(sysMsgs) {
        console.log('收到离线自定义系统通知', sysMsgs);
      },
      onCustomSysMsg(sysMsg) {
        console.log('收到自定义系统通知', sysMsg);
      },

      onSyncDone() {
        console.log('同步完成');
      },
      toSendMsg() {
        var msg = this.nim.sendText({
          scene: 'p2p',
          to: '385788811705057280',
          text: 'hello',
          done: this.sendMsgDone
        });
        console.log('正在发送p2p text消息, id=' + msg.idClient);
        this.pushMsg(msg);
      },
      sendMsgDone(error, msg) {
        console.log(error);
        console.log(msg);
        console.log('发送' + msg.scene + ' ' + msg.type + '消息' + (!error ? '成功' : '失败') + ', id=' + msg.idClient);
        this.pushMsg(msg);
      },
      getHistory() {
        this.nim.getHistoryMsgs({
          scene: 'team',
          to: this.type.split('-')[1],
          done: this.getHistoryMsgsDone
        });
      },
      getHistoryMsgsDone(error, obj) {
        console.log('获取p2p历史消息' + (!error ? '成功' : '失败'));
        console.log(error);
        console.log(obj);
        if (!error) {
          this.historyList = obj.msgs;
        }
      },
      selectThisEmoji(item) {
        var obj = document.getElementById("p");
        this.sendMsg = obj.innerHTML;
        obj.innerHTML = this.sendMsg + '<img style="width: 1.8em;height: 1.8em" src="' + item + '" alt="">';
      },
      hasRead() {
        var session = ''
//        console.log(this.data.sessions);
//        console.log(this.type);
        for (var i = 0; i < this.data.sessions.length; i++) {
          if (this.data.sessions[i].id == this.type || this.data.sessions[i].id == this.type.split('-')[1]) {
            session = this.data.sessions[i];
            // console.log(session.lastMsg)
          }
        }
        this.nim.resetSessionUnread(session.id);
        this.nim.sendMsgReceipt({
          msg: session.lastMsg,
          done: this.sendMsgReceiptDone,
        });
        this.nim.isMsgRemoteRead(session.lastMsg)
      },
      sendMsgReceiptDone(error, obj) {
        console.log('发送消息已读回执' + (!error ? '成功' : '失败'), error, obj);
      },
    },
    mounted() {
      this.organInfo = JSON.parse(
        decodeURIComponent(localStorage.getItem("organInfo"))
      );
      this.getUserList()
//      this.sendMsg();
      if (localStorage.getItem('chatData')) {
        this.data = JSON.parse(decodeURIComponent(localStorage.getItem('chatData')));
      }
      console.log(this.data.teams)
      this.getFriendList();
      this.getTeamNum();
      for (let emoji in this.emojiList) {
        let emojiItem = this.emojiList[emoji];
//        console.log(this.emoji)
        this.getEmoji.push(emoji)
        for (let key in emojiItem) {
          let item = emojiItem[key];
          this.emojiUrl.push('http://yx-web.nosdn.127.net/webdoc/h5/emoji/emoji/' + item)
//          item.img = `${emojiBaseUrl}/${emoji}/${item.file}`
        }
      }
      this.data = JSON.parse(decodeURIComponent(localStorage.getItem('chatData')));
      if (this.$route.query.id) {
        this.id = this.$route.query.id;
        this.type = this.id;
      }
      // if (this.$route.query.teamId) {
      //   this.teamId = this.$route.query.teamId;
      //   this.type = 'team-' + this.teamId
      // }
      if (this.data.users) {
        for (var i = 0; i < this.data.users.length; i++) {
          if (this.data.users[i].account * 1 == this.type.split('-')[1] * 1) {
            this.title = this.data.users[i].nick;
//            this.friendImg = this.data.users[i].avatar
          }
        }
      }
      // if (this.teamId) {
      //   for (var i = 0; i < this.data.users.length; i++) {
      //     if (this.data.teams[i].teamId == this.teamId) {
      //       this.title = this.data.teams[i].name;
      //     }
      //   }
      // }
      if (this.title) {
        document.title = this.title;
      }
      console.log(this.type);
      if (this.$route.path == '/message/chat_history') {
        this.isHistory = true;
        this.getHistory();
      }
      this.hasRead();
//      this.addNo();
//      this.createTeam();
//      console.log(this.data.teams)
//      console.log(this.data.msgs)
    },
  };
</script>
<style lang="scss" scoped>
  .show-chat-title {
    position: absolute;
    top: 0px;
    left: 343px;
    line-height: 70px;
    border-left: 1px solid #e6e6e6;
    padding-left: 55px;
  }

  .black-bg {
    background: #1f2d3d;
    opacity: 0.7;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999
  }

  .user-list {
    background: #fff;
    border-radius: 10px;
    width: 500px;
    height: 500px;
    position: fixed;
    left: 50%;
    margin-left: -250px;
    z-index: 999;
    top: 100px;
    padding: 10px;
    overflow-y: scroll;
    padding-bottom: 100px;
  }

  .sure-btn {
    display: flex;
    width: 500px;
    line-height: 30px;
    position: fixed;
    top: 546px;
    background: #fff;
    left: 50%;
    margin-left: -250px;
    border-top: 1px solid #e6e6e6;
    z-index: 99;
  }

  .all_header {
    margin-left: 70px;
    width: 260px;
    height: 75px;
    border-bottom: 1px solid #e7e7e7;
    position: absolute;
    top: 0;
    left: 0;
  }

  .el-tree-node__content > .el-tree-node__expand-icon {
    padding: 0px !important;
  }

  #manage {
    height: 100%;
    // 第二级内容
    .submenu {
      float: left;
      // overflow: scroll;
      overflow-x: hidden;
      width: 274px;
      height: 100%;
      border-bottom: 1px solid #e6e6e6;
      background: #f3f3f3;
      .menu {
        height: 75px;
        border: 1px solid #e7e7e7;
        .sub_icon {
          width: 45px;
          height: 45px;
          margin: 15px;
          float: left;
          overflow: hidden;
          border-radius: 50%;
          background: #fff;
          img {
            width: 100%;
            height: 100%;
            display: inline-block;
            border-radius: 50%;
          }
        }
        .text {
          line-height: 75px;
        }
      }
    }
  }

  .chat-list {
    cursor: pointer;
    width: 100%;
    display: flex;
    background: #ffffff;
    border-bottom: 1px solid #cccccc;
    line-height: 3em;
    height: 75px;
    padding-left: 1em;
    font-size: 16px;

  }

  // 第三级内容
  .mainContent {
    float: left;
  }

  .selected-active {
    background: rgb(242, 242, 247) !important;
  }

  // 路由激活
  .router-link-active {
    .menu {
      background: #fff;
    }
  }

  .select-item-search {
    position: fixed;
    background: #fff;
    width: 100%;
    z-index: 99;
    min-height: 6em;
    top: 7em;
    left: 0;
  }

  .search-item-title {
    line-height: 3em;
    padding-left: 1em;
    font-size: 13px;
    /*color: #999999;*/
  }

  .search-item-title1 {
    line-height: 2.5em;
    margin-top: 1em;
    padding-left: 1em;
    font-size: 13px;
    border-top: 1px solid #e6e6e6;
  }

  .select-start-end {
    width: 80%;
    margin-left: 10%;
    background: #f6f6f6;
    min-height: 3em;
  }

  .text-center {
    color: #666;
  }

  .date-select {
    line-height: 2em;
    text-align: center;
    display: inline-block;
    width: 40%;
    margin-left: 3%;
    margin-top: 0.5em;
    border: none;
    background: #fff;
    color: #999;

  }

  .date-select1 {
    float: right;
    margin-right: 3%;
  }

  .date-center-line {
    width: 5%;
    margin-left: 3%;
    height: 0.5em;
    display: inline-block;
    border-top: 2px solid #999999;
  }

  .select-item-status {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    padding: 0 1em;
  }

  .select-item-status div {
    width: 25%;
    line-height: 2.5em;
  }

  .select-item-status > div > span {
    padding: 0.5em 1.8em;
    font-size: 13px;
    background: #f6f6f6;
  }

  .bottom-sure-div {
    margin-top: 1.5em;
    color: #666;
  }

  .bottom-sure-div div {
    display: inline-block;
    border-radius: 2px;
    line-height: 2em;
    padding: 0 2em;
    border: 1px solid #f1f1f1;
    margin: 1em;
  }

  .div-btn {
    color: #fff;
    background: #5881ff;
  }

  .comment-content {
    width: 100%;
    background: #fff;
    min-height: 4em;
    padding: 1em 0.8em;
    margin-bottom: .2rem;
  }

  .comment-content > a {
    display: block;
  }

  .right-time {
    font-size: 12px;
    color: #999999;
    line-height: 2em;
    margin-right: 10px;
  }

  .comment-title {
    font-size: .32rem;
    color: #333;
  }

  .this-comment-content {
    background: #f1f1f1;
    display: flex;
    align-items: center;
    width: 100%;
  }

  .this-comment-content img {
    width: 1.5rem;
  }

  .this-comment-content > div {
    flex: 1;
    display: inline-block;
    padding-left: .2rem;
  }

  .this-comment-content > a div:nth-child(1) {
    display: flex;
    overflow: hidden;
  }

  .this-comment-content > div > span {
    width: 100%;
    font-size: .26rem;
    line-height: 1.6em;
    color: #999999;
    overflow: hidden;
  }

  .user-reply-div {
    display: flex;
    height: 1rem;
    align-items: center;
    margin-bottom: .1rem;
  }

  .black-bg {
    top: 0;
  }

  .user-reply-div img {
    width: .8rem;
    height: .8rem;
    border-radius: 50%;
    margin-right: .2rem;
  }

  .user-reply-div > div {
    padding-top: .1rem;
    display: flex;
    flex-flow: column wrap;
    align-items: flex-start;
    justify-content: flex-start;
  }

  .show-friend {
    display: flex;
    margin-bottom: .2rem;
    width: 100%;
    background: #fff;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    padding: .18rem;
  }

  .show-friend .img-div {
    border-radius: 50%;
    width: 20%;
  }

  .img-div img {
    border-radius: 50%;
  }

  .this-friend {
    flex: 1;
    padding-left: 3%;
  }

  .this-friend-name {
    font-size: .32rem;
  }

  .this-friend-content {
    line-height: 1.8em;
    font-size: .26rem;
    color: #999999;
  }

  .this-friend-location {
    font-size: .26rem;
    color: #5881ff;
  }

  .black-this-friend {
    width: 40%;
  }

  .friend-intro {
    margin-top: .3rem;
    background: #fff;
    border-bottom: 1px solid #ddd;
  }

  .friend-intro-title {
    line-height: 2.8em;
    height: .7rem;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    padding-left: 1em;
    position: relative;
  }

  .friend-intro-title div {
    position: absolute;
    height: .8rem;
    color: #fff;
    bottom: 0;
    padding: 0 .3rem;
    line-height: .8rem;
    font-size: .3rem;
    display: inline-block;
  }

  .friend-detail-col {
    display: flex;
    line-height: 3em;
    padding-left: 1em;
  }

  .left-intro {
    width: 22%;
    color: #999999;
  }

  .left-tel-type {
    width: 15%;
    color: #999999;
  }

  .right-intro {
    width: 78%;
    display: flex;
    flex-wrap: wrap;
  }

  .right-intro div {
    width: 30%;
  }

  .right-intro div > span {
    padding: 0.3em 1.3em;
    background: #f6f6f6;
  }

  .right-intro-div {
    height: 6em;
    margin-top: 0.6em;
    margin-right: 2em;
    background: #f6f6f6;
    width: 70%;
    padding: 0 0.5em;
  }

  .del-post {
    position: fixed;
    width: 100%;
    background: #fff;
    height: 3.5em;
    z-index: 99;
    bottom: 0;
    line-height: 3.5em;
    border-top: 1px solid #e6e6e6;
  }

  .del-post img {
    margin-left: 0.8em;
    margin-top: 0.8em;
    margin-right: 0.3em;
    float: left;
  }

  .del-btn {
    right: 0;

    top: 0;
    width: 25%;
    background: red;
    color: #fff;
    position: absolute;
  }

  .chat-list img {
    margin: 2.5px 0;
    height: 70px;
    border-radius: 50%;
    width: 2.5em;
    margin-right: 1em;
  }

  .chat-list div {
    margin-top: 12px;
  }

  .get-ms-list {
    width: 75%;
    line-height: 1.5em;
    position: relative;
  }

  .get-ms-list > span {
    width: 160px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    display: inline-block;
  }

  .warn-circle {
    background: red;
    border-radius: 3px;
    position: absolute;
    font-size: 0.24rem;
    color: #fff;
    /* width: 3em; */
    padding: 0.1em 0.3em;
    line-height: 1.5em;
    right: 0.5em;
    top: -0.5em;
  }

  .right-time {
    color: #999999;
    font-size: 12px;
  }

  .chatItem {
    padding-top: 0.88rem;
    height: 80%;
    width: 100%;
    margin-bottom: -0.88rem;
    position: absolute;
    top: 72px;
    padding-bottom: 50px;
    overflow-x: hidden;
    overflow-y: scroll;
    background: #f2f2f7;
    width: 1000px;
  }

  .focus-input {
    opacity: 0;
    /*margin-top: 2em;*/
    position: relative;
    bottom: 0;
    width: 1px;
    height: 1px;
    left: 0;
  }

  .chat-msg {
    line-height: 3em;
    /*min-height: 3.5em;*/
    width: 100%;
  }

  .chat-msg-img {
    width: 40px;
    height: 40px;
    margin: 11px 23px;
    border-radius: 50%;
  }

  .chat-msg span {
    background: #fff;
    border-radius: 10px;
    padding: 0.3em 1em;
    margin-top: 10px;
    max-width: 60%;
    line-height: 30px;
    min-height: 1.8em;
    word-wrap: break-word;
    font-size: 18px;
    overflow: hidden;
  }

  span {
    font-size: 0.26rem;
    /* color: #999999; */
    word-wrap: break-word;
    overflow: hidden;
  }

  .bottom-input {
    width: 1000px;
    height: 20%;
    background: #ffffff;
    position: absolute;
    bottom: 0;
    border-top: 1px solid #e6e6e6;
  }

  .top-emoj {
    position: absolute;
    top: 0px;
    margin: 0px;
    left: 0;
    border: none;
    max-height: 0.88rem;
  }

  .bottom-input p {
    width: 100%;
    display: inline-block;
    margin-top: 35px;
    background: #fff;
    line-height: 30px;
    height: 110px;
    padding: 0px 20px;
    /* padding-bottom: 5px; */
    font-size: 18px;
    overflow: scroll;
    border-radius: 4px;
    outline: none;
  }
  .bottom-input p:focus {
    border: 1px solid #fff;
  }

  .bottom-input img {
    width: 20px;
    margin-top: 8px;
    margin-left: 16px;
  }

  .selectPic {
    margin-bottom: 0.6em;
  }

  .emoji-select-pic {
    /*float: right;*/
  }

  .bottom-input input {
    width: 20px;
    height: 20px;
    opacity: 0;
    bottom: -12px;
    right: 0px;
    position: absolute;
  }

  .u-editor-icon {
    height: 100%;
  }

  .send-btn {
    cursor: pointer;
    right: 10px;
    bottom: 0;
    position: absolute;
    width: 70px;
    line-height: 2em;
    background: rgb(245,245,245);
    color: #000000;
    margin-bottom: 0.6em;
    margin-right: 0.2em;
    text-align: center;
    border-radius: 4px;
    border: 1px solid #e6e6e6;
  }
  .send-btn:hover {
    background: #e6e6e6;
  }

  .bottom-input p > img {
    width: 3em;
    height: 3em;
  }

  .bottom-emoji {
    width: 1000px;
    height: 300px;
    background: #e5f4ff;
    position: fixed;
    bottom: 180px;
    overflow: auto;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    padding: 0.5em 1em;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap
  }

  .bottom-emoji div {
    width: 12%;
    text-align: center;
    height: auto;
  }

  .bottom-emoji div > img {
    width: 2em;
    height: 2em;
  }

  .recieve-img {
    position: relative;
    display: inline-block;
    margin: 0;
    margin-top: 1em;
    padding: 0;
    max-width: 300px;
    vertical-align: bottom;
  }

  .team-name {
    width: 100%;
    height: 3em;
    padding: 1em;
    background: #fff;
    border: none;
  }

  .team-detail-name {
    width: 100%;

    background: #0093d2;
    padding: 0.5em;
    color: #fff;
    font-size: 0.34rem;
    padding-bottom: 2em;
  }

  .team-detail-name img {
    margin-bottom: 1em;
  }

  .team-detail-people {
    width: 100%;
    background: #fff;
    line-height: 3em;
    padding: 0 1em;
    border-bottom: 1px solid #e6e6e6;
  }

  .m-right {
    width: .32rem;
  }

  .members-pic {
    width: 2em;
    margin-right: 0.4em;
  }

  .team-avatar {
    width: 4em;
  }


</style>
