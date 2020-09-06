<template>
  <div id="detail">
    <detail-nav-bar @itemClick="titleClick" :current-index="currentIndex"></detail-nav-bar>
    <scroll class="content"
            ref="scroll"
            @scroll="contentScroll"
            :data="[topImages, goods, shop, detailInfo, paramInfo, commentInfo, recommendList]"
            :probe-type="3">
      <div>
        <detail-swiper ref="base" :images="topImages"></detail-swiper>
        <detail-base-info :goods="goods"></detail-base-info>
        <detail-shop-info :shop="shop"></detail-shop-info>
        <detail-goods-info :detail-info="detailInfo"></detail-goods-info>
        <detail-param-info ref="param" :param-info="paramInfo"></detail-param-info>
        <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
        <detail-recommend-info ref="recommend" :recommend-list="recommendList"></detail-recommend-info>
      </div>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"></detail-bottom-bar>
    <back-top @backTop="backTop" class="back-top" v-show="showBackTop">
      <img src="~assets/img/common/top.png" alt="">
    </back-top>
  </div>
</template>

<script>
  import Scroll from 'common/scroll/Scroll'

  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import DetailRecommendInfo from './childComps/DetailRecommendInfo'

  import DetailBottomBar from './childComps/DetailBottomBar'
  import BackTop from 'content/backTop/BackTop'

  import {getDetail, getRecommend, Goods, Shop, GoodsParam} from "network/detail";
  import {backTopMixin} from "@/common/mixin";
  import {BACKTOP_DISTANCE} from "@/common/const";

  export default {
		name: "Detail",
    components: {
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailRecommendInfo,
      DetailBottomBar,
		  Scroll,
		  DetailNavBar,
      DetailSwiper,
      BackTop
    },
    mixins: [backTopMixin],
    data() {
		  return {
		    iid: '',
		    topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommendList: [],
        themeTops: [],
        currentIndex: 0
      }
    },
    created() {
		  this._getDetailData()
      this._getRecommend()
    },
    updated() {
		 
      this._getOffsetTops()
    },
    methods: {
		  _getOffsetTops() {
		    this.themeTops = []
        this.themeTops.push(this.$refs.base.$el.offsetTop)
        this.themeTops.push(this.$refs.param.$el.offsetTop)
        this.themeTops.push(this.$refs.comment.$el.offsetTop)
        this.themeTops.push(this.$refs.recommend.$el.offsetTop)
        this.themeTops.push(Number.MAX_VALUE)
      },
      contentScroll(position) {
		    
        this.showBackTop = position.y < -BACKTOP_DISTANCE

        this._listenScrollTheme(-position.y)
      },
      _listenScrollTheme(position) {
        let length = this.themeTops.length;
        for (let i = 0; i < length; i++) {
          let iPos = this.themeTops[i];
          
          if (position >= iPos && position < this.themeTops[i+1]) {
            if (this.currentIndex !== i) {
              this.currentIndex = i;
            }
            break;
          }
        }
      },
      titleClick(index) {
        console.log(this.themeTops[index]);
        this.$refs.scroll.scrollTo(0, -this.themeTops[index], 100)
      },
      addToCart() {
       
        const obj = {}
        
        obj.iid = this.iid;
        obj.imgURL = this.topImages[0]
        obj.title = this.goods.title
        obj.desc = this.goods.desc;
        obj.newPrice = this.goods.nowPrice;
       
        this.$store.commit('addCart', obj)
      },
		  _getDetailData() {
		   
        const iid = this.$route.query.iid
        this.iid = iid

       
        getDetail(iid).then(res => {
          
          const data = res.result;

         
          this.topImages = data.itemInfo.topImages;

          
          this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services);

          
          this.shop = new Shop(data.shopInfo);

          
          this.detailInfo = data.detailInfo

          
          this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule);

          
          if (data.rate.list) {
            this.commentInfo = data.rate.list[0];
          }
        })
      },
      _getRecommend() {
        getRecommend().then((res, error) => {
          if (error) return
          this.recommendList = res.data.list
        })
      }
    }
	}
</script>

<style scoped>
  #detail {
    height: 100vh;
    position: relative;
    z-index: 1;
    background-color: #fff;
  }

  .content {
    position: absolute;
    top: 44px;
    bottom: 60px;
  }

  .back-top {
    position: fixed;
    right: 10px;
    bottom: 65px;
  }
</style>
