<template>
  <div class="main">
    <div class="main-page">
      <main class="main-page_content">
        <div class="sidebar"
             style="transition: all .2s linear"
             ref="sidebar"
             @touchstart="touchStart($event)"
             @touchend="touchEnd($event)"
             @touchmove="touchMove($event)">
          <button style="background:#2654ac; padding: 5px; color:#fff;" class="toggler" @click="toggleSidebar($event)">X</button>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css'
import Swipeable from './services/swipeDetect'

export default {
  name: 'App',
  data() {
    return {
      swipeable: new Swipeable({offset: 2}),
      currentPosition: 0,
      isSidebarOpened: true,
    }
  },
  methods: {
    handleLeftTouch(e, x) {
      const blockInstance = e.target;
      const blockInstanceWidth = blockInstance.offsetWidth
      
      if (x + this.currentPosition > 0) {
        blockInstance.style.left = `0`
      } else if (Math.abs(x + this.currentPosition) >  blockInstanceWidth / 2) {
        blockInstance.style.left = `-${e.target.offsetWidth}px`
        this.isSidebarOpened = false;
      } else {
        blockInstance.style.left = `${x + this.currentPosition}px`
        console.log('свайп на ', x, 'px влево')
      }
    },
    handleRightTouch(e, x) {
      const blockInstance = e.target;
      if (x + this.currentPosition > 0) {
        blockInstance.style.left = `0`
        return;
      }
      blockInstance.style.left = `${x + this.currentPosition}px`
      console.log('свайп на ', x, 'px вправо')
    },
    touchStart(e) {
      this.swipeable.touchStart(e)
    },
    touchMove(e) {
      this.swipeable.touchMove(e, {onLeft: this.handleLeftTouch, onRight: this.handleRightTouch})
    },
    touchEnd(e) {
      this.currentPosition = parseInt(e.target.style.left, 10)
      this.swipeable.touchEnd(e)
    },
    toggleSidebar(e) {
      const sidebarNode = e.target.offsetParent
      
      if (this.isSidebarOpened) {
        sidebarNode.style.left = `-${sidebarNode.offsetWidth}px`
        this.isSidebarOpened = false;
      } else {
        sidebarNode.style.left = "0";
        this.currentPosition = 0;
        this.isSidebarOpened = true;
      }
    },
  }
}
</script>

<style>
@import './styles/reset.css';

.main-page_content {
  display: flex;
  width: 100%;
}

.sidebar {
  width: 50%;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 10000000000;
  background: #2654ac;
}

.toggler {
  top: 0;
  position: relative;
  right: -100%;
  z-index: 100000000001;
}

.main-page {
  width:100%;
  height:100%;
  background: darkgrey;
}
</style>
