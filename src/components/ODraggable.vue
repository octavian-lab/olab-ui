<template>
  <div id="o-draggable" class="relative">
    <i
      v-if="!isDragAlwaysActiveComp"
      @click="dragEnabledToggle()"
      :class="['fas fa-up-down-left-right text-xl pointer absolute', { active: isDragEnabled }]"
    ></i>

    <div id="o-draggable-container" :class="{ grid: isGridActive }">
      <div
        v-for="(el, i) in elements"
        :key="el"
        :class="['o-draggable-container__item', isGridActive ? colClass : '']"
      >
        <div
          :class="{
            'shake-animation pointer': !isDragAlwaysActiveComp && isDragEnabled && !isDragActive
          }"
          :style="animationDelay(i)"
        >
          <slot :name="`draggable-${el}`" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import { nextTick } from 'vue'
import { useSettingsStore } from '@/store/settings.js'

export default {
  name: 'ODraggable',
  props: {
    numberElements: { type: Number, required: true },
    isDragAlwaysActive: { type: Boolean, default: () => false },
    isGridActive: { type: Boolean, default: () => false },
    colClass: { type: String, default: () => '' },
    useApi: { type: Boolean, default: () => false }
  },
  data() {
    return {
      API: null,
      useSettingsStore: useSettingsStore(),
      elements: this.createElements(),
      draggable: null,
      isFirstTime: false,
      pageSettingId: null,
      isDragActive: false,
      isDragEnabled: false
    }
  },
  computed: {
    isDragAlwaysActiveComp() {
      if (this.isDesktop) {
        return this.isDragAlwaysActive
      } else {
        return false
      }
    }
  },
  methods: {
    createElements() {
      const arr = []
      for (let i = 0; i < this.numberElements; i++) {
        arr.push(i)
      }
      return arr
    },
    dragActiveToggle() {
      this.isDragActive = !this.isDragActive
    },
    dragEnabledToggle() {
      if (this.isDragAlwaysActiveComp) return

      this.isDragEnabled = !this.isDragEnabled
      this.draggable.options.disabled = !this.draggable.options.disabled
    },
    onDrop({ oldIndex, newIndex }) {
      if (oldIndex === newIndex) return

      const tmp = this.elements[oldIndex]
      this.elements.splice(oldIndex, 1)
      this.elements.splice(newIndex, 0, tmp)

      if (!this.useApi) {
        this.useSettingsStore.updateDraggableTemplates({
          page: this.currentPageName,
          value: this.elements
        })
        this.elements = this.useSettingsStore.getDraggableTemplates(this.currentPageName)
      }

      if (this.useApi) {
        if (this.isFirstTime) this.doAddPageSettings()
        else this.doEditPageSettings()
      }
    },
    async doSearchPageSettings() {
      try {
        const { data } = await this.API.pagesetting.search({ key: this.currentPageName })

        if (data.data.length) {
          this.pageSettingId = data.data[0].id
          const arr = JSON.parse(data.data[0].value)

          if (this.elements.length === arr.length) {
            this.elements = arr
          }
        } else this.isFirstTime = true
      } catch (e) {
        console.log(e)
      }
    },
    async doAddPageSettings() {
      const json = {
        key: this.currentPageName,
        name: `${this.currentPageName}-layout`,
        value: JSON.stringify(this.elements),
        mode: 0,
        type: 2
      }

      try {
        await this.API.pagesetting.add(json)
        this.isFirstTime = false
        await this.doSearchPageSettings()
      } catch (e) {
        console.log(e)
      }
    },
    async doEditPageSettings() {
      const json = {
        name: this.currentPageName,
        value: JSON.stringify(this.elements),
        mode: 0,
        type: 2
      }

      try {
        await this.API.pagesetting.edit(this.pageSettingId, json)
        await this.doSearchPageSettings()
      } catch (e) {
        console.log(e)
      }
    },
    animationDelay(index) {
      if (this.isDragAlwaysActiveComp) return ''

      const delay = index * 0.1
      return `animation-delay: ${delay}s`
    }
  },
  async created() {
    this.isDragEnabled = this.isDragAlwaysActiveComp

    if (!this.useApi) {
      const arr = this.useSettingsStore.getDraggableTemplates(this.currentPageName)

      if (arr.length) {
        if (this.elements.length === arr.length) {
          this.elements = arr
        }
      }
    }

    if (this.useApi) {
      const site = localStorage.getItem('site')
      const module = await import(`../api/${site}/index.js`)
      this.API = module.default
      await this.doSearchPageSettings()
    }
  },
  mounted() {
    nextTick(() => {
      const container = document.getElementById('o-draggable-container')
      this.draggable = Sortable.create(container, {
        draggable: '.o-draggable-container__item',
        animation: 150,
        easing: 'cubic-bezier(1, 0, 0, 1)',
        ghostClass: 'sortable-ghost',

        onStart: () => {
          this.dragActiveToggle()
        },
        onEnd: (event) => {
          this.dragActiveToggle()
          this.onDrop(event)
        }
      })

      if (!this.isDragAlwaysActiveComp) this.draggable.options.disabled = true
    })
  }
}
</script>

<style lang="scss">
#o-draggable {
  .sortable-ghost {
    position: relative;

    &::after {
      content: '';
      width: calc(100% - 5px - 5px);
      height: calc(100% - 5px - 5px);
      background-color: var(--surface-200);
      border: 5px dashed var(--surface-400);
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  .fa-up-down-left-right {
    top: -1rem;
    left: -1rem;
    z-index: 99;

    width: 2rem;
    aspect-ratio: 1;
    line-height: 2rem;
    text-align: center;
    border-radius: 50%;
    background-color: var(--surface-200);
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: var(--surface-300);
    }
    &.active {
      background-color: var(--primary-color);
    }
  }

  .shake-animation {
    -webkit-animation: shake 2s infinite ease-in-out;
    animation: shake 2s infinite ease-in-out;
  }
  @-webkit-keyframes shake {
    from,
    to {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
      -webkit-transform: translate3d(-1px, 0, 0);
      transform: translate3d(-1px, 0, 0);
    }
    20%,
    40%,
    60%,
    80% {
      -webkit-transform: translate3d(1px, 0, 0);
      transform: translate3d(1px, 0, 0);
    }
  }
  @keyframes shake {
    from,
    to {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
      -webkit-transform: translate3d(-1px, 0, 0);
      transform: translate3d(-1px, 0, 0);
    }
    20%,
    40%,
    60%,
    80% {
      -webkit-transform: translate3d(1px, 0, 0);
      transform: translate3d(1px, 0, 0);
    }
  }
}
</style>
