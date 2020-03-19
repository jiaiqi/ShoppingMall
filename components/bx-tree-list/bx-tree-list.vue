<template>
  <view>
    <view class="parent-list">
      <view class="parent-node" v-for="(parent, index) in parentList" :key="index">
        <view class="parent-name" @click="clickParent(parent, index)">{{ parent['name'] }}</view>
        <view class="parent-detail">
          <!-- <view class="">[{{ parent.shop_name }}]</view> -->
          <view class="child-list">
            <view class="child-node" v-for="(child, childIndex) in parent.childList" :key="childIndex">{{ child.name }}</view>
          </view>
          <!-- <view class="child-node" v-for="(child, childIndex) in parent.childList" :key="childIndex">{{child.name}}</view> -->
        </view>
      </view>
    </view>
    <!--  <view class="search-bar">
      <view class="cu-bar search bg-white">
        <view class="search-form round">
          <text class="cuIcon-search"></text>
          <input @focus="searchBarFocus" @blur="serachBarBlur" :adjust-position="false" type="text" v-model="listConfig.searchVal" placeholder="搜索类别" confirm-type="search" />
        </view>
        <view class="action"><button class="cu-btn bg-blue shadow-blur round" @click="toSearch">搜索</button></view>
      </view>
    </view> -->
    <view class="child-list">
      <!-- <bx-list
        ref="bxList"
        :serviceName="listConfig.serviceName"
        :rowButtons="rowButton"
        :condition="listConfig.condition"
        :pageType="listConfig.pageType"
        :viewTemp="listConfig.viewTemp"
        :listConfig="listConfig.listConfig"
        :searchWords="listConfig.searchVal"
        :searchColumn="listConfig.keyColumn"
        :rownumber="5"
        :heightStyle="listConfig.heightStyle"
        :fixed="false"
        @click-list-item="clickItem"
        @list-change="listChange"
        @clickFootBtn="clickFootBtn"
        @loadEnd="loadEnd"
      ></bx-list> -->
    </view>
  </view>
</template>

<script>
import bxList from '../bx-list/bx-list.vue';
export default {
  components: { bxList },
  data() {
    return {
      parentList: [], //父节点数据
      childList: [], //子节点数据
      parent_no: '', //父节点编号
      gridButton: [],
      rowButton: [],
      listConfig: {
        heightStyle: 'calc(100vh - 300px)',
        serviceName: 'srvshop_goods_category_select',
        condition: [{ colName: 'parent_no', ruleType: 'isnull' }],
        pageType: 'list',
        viewTemp: {
          title: 'name',
          img: 'img',
          footer: 'shop_name'
        },
        listConfig: null,
        searchVal: '',
        keyColumn: 'name'
      },
      page: {
        pageNo: 1,
        rownumber: 10,
        total: 0
      },
      columnV2Data: {
        main_table: 'bxshop_goods_category',
        his_version: false,
        encryptedCols: [],
        rowButton: [],
        service_name: 'srvshop_goods_category_select',
        parent_no_col: 'parent_no', // 父节点编号列名
        tabs: [],
        is_map: false,
        service_view_name: '商品分类表查询',
        srv_cols: [],
        key_disp_col: 'id',
        is_tree: true,
        gridButton: [],
        foreignkeys: [],
        card_cfg: null,
        more_config: null,
        no_col: 'no'
      }
    };
  },
  props: {
    serviceName: {
      type: String,
      default: ''
    }
  },
  methods: {
    clickParent(e, index) {
      console.log('click-line:', e, index);
      this.page.pageNo = 1;
      // if (index < this.parentList.length - 1) {
      //   this.parentList = this.parentList.slice(0, index + 1);
      // }
      if (e && e.no) {
        // this.outputData = e;
        this.$emit('clickLine', e);
        let condition = [
          {
            colName: 'parent_no',
            ruleType: 'eq',
            value: e.no
          }
        ];
        this.parent_no = e.no;
        this.listConfig.condition = condition;
        this.getChildList(e).then(data => {
          let item = e;
          item.childList = data;
          this.$set(this.parentList, index, item);
          // this.listChange()
        });
        // this.$refs.bxList.onRefresh();
        // if (e.is_leaf === '是') {
        //   this.showSelect = false;
        // } else {
        //   this.showSelect = true;
        // }
      } else if (!e) {
        this.parentList = [];
      }
    },
    listChange(e) {
      console.log('listChange', e);
      // this.childList = e
      let parentList = this.parentList;
      let childList = this.childList;
      // this.parentList.map((parent,index) => {
      //   const childNoList = []
      //   if(parent.childList&&parent.childList.length>0){
      //    childNoList =  parent.childList.map(item=>item.no)
      //   }
      //   if(this.childList){
      //     this.childList.map(child => {
      //       console.log(childNoList,child.parent_no)
      //       if (child.parent_no === parent.no&&!childNoList.includes(child.no) ) {
      //         parent.childList = [...parent.childList, child];
      //         console.log(parent.childList)
      //       }
      //       console.log(parent,child)
      //     });
      //   }
      //   // this.$set('parentList',index,parent)
      //   return parent;
      // });
      // this.parentList = parentList
      // this.parentList = this.parentList.map(parent => {
      //   this.childList.map(child => {
      //     if (child.parent_no === parent.no) {
      //       parent.childList = [...parent.childList, child];
      //     }
      //     return parent;
      //   });
      // });
    },
    clickItem(e) {
      e.childList = [];
      let parentList = [...this.parentList, e];
      this.parentList = parentList;
      this.parent_no = e.no;
      console.log('clickItem', e, parentList);
      if (e.no) {
        this.listConfig.condition = [{ colName: this.columnV2Data['parent_no_col'], ruleType: 'eq', value: e.no }];
        this.$refs.bxList.onRefresh();
      }
    },
    clickFootBtn(e) {
      console.log('clickFootBtn', e);
    },
    loadEnd(e) {
      console.log('loadEnd', e);
    },
    toSearch() {
      let keywords = this.listConfig.searchVal;
      this.$refs.bxList.toSearch();
    },
    async getColV2() {
      uni.showLoading({
        mask: true
      });
      this.getServiceV2(this.serviceName, 'list', 'treelist', 'shop').then(res => {
        console.log('getServiceV2', res);
      });
    },
    async getChildList(item) {
      console.log(item);
      let parent_no = '';
      if (item) {
        parent_no = item.no;
        // this.parent_no = item.parent_no;
      }
      // let parent_no = item && item[this.columnV2Data['no_col']];
      if (!item || item['is_leaf'] !== '是') {
        uni.showLoading({
          mask: true
        });
        let url = this.getServiceUrl(uni.getStorageSync('activeApp'), 'srvshop_goods_category_select', 'select');
        let req = {
          serviceName: 'srvshop_goods_category_select',
          colNames: ['*'],
          condition: [{ colName: 'parent_no', ruleType: parent_no ? 'eq' : 'isnull', value: parent_no }],
          page: { pageNo: 1, rownumber: 10 },
          order: []
        };
        let res = await this.$http.post(url, req);
        uni.hideLoading();
        if (res.data.state === 'SUCCESS') {
          if (parent_no) {
            // this.childList = res.data.data;
            // this.listChange();
            return res.data.data;
          } else {
            this.parentList = res.data.data;
          }
        }
      }
    },
    getButtons(e) {
      // let columnV2Data = this.columnV2Data;
      // let typeList = columnV2Data.service_name.split('_');
      // let type = typeList[typeList.length - 1];
      // this.gridButton = columnV2Data.gridButton.filter(item => item['client_type'].indexOf('APP') != -1);
      // this.rowButton = columnV2Data.rowButton.filter(item => item['client_type'].indexOf('APP') != -1);
    },
    async getPicture(file_no) {
      const serviceName = 'srvfile_attachment_select';
      const url = this.getServiceUrl('file', serviceName, 'select');
      const req = {
        serviceName: serviceName,
        colNames: ['*'],
        condition: [{ colName: 'file_no', value: file_no, ruleType: 'eq' }]
      };
      if (file_no !== null && file_no !== '' && file_no !== undefined) {
        let res = await this.$http.post(url, req);
        if (res.data.state === 'SUCCESS') {
          const data = res.data.data[0];
          if (data) {
            const fileurl = this.$api.srvHost + '/file/download?filePath=' + data.fileurl + '&thumbnailType=' + this.$api.imgThumbnailType;
            return fileurl;
          }
        }
      }
    },
    searchBarFocus(e) {},
    serachBarBlur(e) {}
  },
  mounted() {
    // this.getColV2().then(() => {
    //   this.getButtons(this.columnV2Data.rowButton);
    // });
    this.getChildList();
  }
};
</script>

<style lang="scss" scoped>
.parent-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  .parent-node {
    width: 95%;
    min-height: 100upx;
    margin: 20upx auto 0;
    padding: 10upx 0;
    display: flex;
    border-bottom: 2upx solid #999;
    flex-direction: column;
    .parent-name {
      font-weight: 600;
      font-size: 34upx;
      padding: 10upx;
    }
    .parent-detail {
      padding: 0 20upx;
      display: flex;
      justify-content: center;
      flex-direction: column;
    }
  }
}
.child-list {
  width: 95%;
  margin: 20upx auto;
}
</style>
