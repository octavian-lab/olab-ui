<template>
  <div id="o-draggable" class="relative">
    <Skeleton
      v-if="useApi && isLoading"
      id="o-draggable-skeleton"
      class="absolute"
      :width="skeletonRect.width"
      :height="skeletonRect.height"
    />

    <Button
      v-if="!isDragAlwaysActiveComp"
      icon="fas fa-up-down-left-right"
      @click="dragEnabledToggle()"
      id="o-draggable__btn"
      :class="[
        'o-draggable__btn o-draggable__btn-custom absolute',
        { active: isDragEnabled, 'opacity-0': isLoading }
      ]"
      :label="isLabelActive ? $translate('admin.draggable.function.info') : undefined"
      v-tooltip.left="isTooltipActive ? $translate('admin.draggable.function.info') : undefined"
    />

    <div
      v-show="!isLoading"
      id="o-draggable-container"
      :class="['lg:px-3 lg:pt-3', { grid: isGridActive }]"
    >
      <div
        v-for="(el, i) in elements"
        :key="el"
        :class="[
          'o-draggable-container__item',
          isGridActive && colClassMap[el] ? colClassMap[el] : '',
          { 'pointer-grab': !isDragAlwaysActiveComp && isDragEnabled }
        ]"
      >
        <div
          :class="[
            {
              'shake-animation': !isDragAlwaysActiveComp && isDragEnabled && !isDragActive
            },
            { 'pointer-events-none': isDragActive || isDragEnabled }
          ]"
          :style="animationDelay(i)"
        >
          <slot :name="`draggable-${el}`" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sortable, { AutoScroll } from 'sortablejs/modular/sortable.core.esm.js'
import { nextTick } from 'vue'
import { useSettingsStore } from '@/store/settings.js'

export default {
  name: 'ODraggable',
  props: {
    elementsNumber: { type: Number, required: true, default: () => 0 },
    isDragAlwaysActive: { type: Boolean, default: () => false },
    isGridActive: { type: Boolean, default: () => false },
    colClassMap: { type: Object, default: () => {} },
    useApi: { type: Boolean, default: () => false },
    isTooltipActive: { type: Boolean, default: () => true },
    isLabelActive: { type: Boolean, default: () => false }
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
      isDragEnabled: false,
      isLoading: true, // No Lazy render ($loading...)
      skeletonRect: {
        width: '75vw',
        height: '75vh'
      }
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
      for (let i = 0; i < this.elementsNumber; i++) {
        arr.push(i)
      }
      return arr
    },
    createDraggable() {
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
        },

        plugins: [AutoScroll]
      })

      if (!this.isDragAlwaysActiveComp) this.draggable.options.disabled = true
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
      this.isLoading = false
      const arr = this.useSettingsStore.getDraggableTemplates(this.currentPageName)

      if (arr.length) {
        if (this.elements.length === arr.length) {
          this.elements = arr
        }
      }

      return
    }

    if (this.useApi) {
      const site = localStorage.getItem('site')

      const module = await import(`../api/${site}/index.js`)
      this.API = module.default
      await this.doSearchPageSettings()
      this.isLoading = false
    }
  },
  mounted() {
    nextTick(() => {
      const layout = document.querySelector('.layout-content')
      if (layout) {
        const rect = layout.getBoundingClientRect()
        const width = rect.width + 'px'
        this.skeletonRect.width = `calc(${width} - 4rem)`
      }

      this.createDraggable()
    })
  }
}
</script>

<style lang="scss">
#o-draggable {
  #o-draggable-skeleton {
    z-index: 100;
    top: 0;
    left: 0;
  }

  .sortable-ghost {
    position: relative;

    &::before {
      content: '';
      width: calc(100% - 5px - 5px);
      height: calc(100% - 5px - 5px);
      background-color: var(--surface-200);
      border: 5px dashed var(--surface-400);
      position: absolute;
      top: 0;
      left: 0;
      z-index: 10;
    }
  }

  .o-draggable__btn {
    border: none;
    &.o-draggable__btn-custom {
      top: -0.75rem;
      right: -1.75rem;
      z-index: 99;

      background-color: var(--surface-ground);
      color: var(--text-color);

      border-radius: 50%;
      width: 1.75rem;
      aspect-ratio: 1;
      font-size: 1.125rem;
      line-height: 1.75rem;
      text-align: center;

      @media (min-width: 992px) {
        top: 0;
        right: -1rem;
        font-size: 1.25rem;
        width: 2rem;
        line-height: 2rem;
      }

      &:hover:not(.active) {
        background-color: var(--surface-hover);
      }
    }

    &.active {
      background-color: var(--primary-color);
    }
  }

  .pointer-grab {
    cursor: move;
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
