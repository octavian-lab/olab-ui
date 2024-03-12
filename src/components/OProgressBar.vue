<template>
  <ProgressBar
    id="o-progressbar"
    ref="progressbarRef"
    :value="value"
    :showValue="showValue && value >= 10"
  >
    <span>{{ value.toFixed(0) }} &percnt;</span>
  </ProgressBar>
</template>

<script>
import { ref, onMounted, nextTick, watch } from 'vue'
import { imgUrl } from '@/js/GlobalFunctions'

export default {
  name: 'OProgressBar',
  props: {
    value: { type: Number, default: () => 0, required: true },
    showValue: { type: Boolean, default: () => false },
    imgType: { type: String, default: () => 'common' },
    imgName: { type: String, required: true },
    imgStyle: { type: Object },
    borderRadius: { type: Boolean, default: () => true },
    customColor: { type: Boolean, default: () => false },
    shadowAnimation: { type: Boolean, default: () => true },
    barAnimation: { type: Boolean, default: () => true }
  },
  setup(props) {
    const borderRadiusValue = props.borderRadius ? '1rem' : '0'
    const progressbarRef = ref(null)
    let progressBarFx
    const color = props.customColor ? 'var(--primary-color)' : 'limegreen'

    const appendProgressBarImg = () => {
      const progressBarValue = progressbarRef.value.$el.querySelector('.p-progressbar-value')
      const progressBarImg = document.createElement('img')
      progressBarImg.src = imgUrl(props.imgName, props.imgType)
      progressBarImg.classList.add('o-progressbar__image')

      const style = props.imgStyle || {
        transform: 'translate(50%, -50%)'
      }
      Object.assign(progressBarImg.style, style)

      progressBarValue.append(progressBarImg)
    }

    const generateProgressBarFX = () => {
      const progressBarValue = progressbarRef.value.$el.querySelector('.p-progressbar-value')
      let progressBarWidth = progressbarRef.value.$el.offsetWidth

      if (props.shadowAnimation) {
        if (props.customColor) {
          progressBarValue.classList.add('custom-animation')
        } else {
          progressBarValue.classList.add('default-animation')
        }
      }

      if (!props.barAnimation) return

      progressBarFx = document.createElement('div')
      progressBarFx.classList.add('o-progressbar__fx', 'hidden')
      progressBarValue.append(progressBarFx)

      if (!progressBarWidth) {
        progressBarWidth = (window.innerWidth * props.value) / 100
      }

      let animationDuration
      if (progressBarWidth > 1000) {
        animationDuration = 2500
      } else if (progressBarWidth > 500) {
        animationDuration = 2000
      } else {
        animationDuration = 1500
      }

      const animKeyframes = [
        {
          left: '4px',
          opacity: '0.1'
        },
        {
          opacity: '0.5'
        },
        {
          opacity: '0.5'
        },
        {
          left: 'calc(100% - 40px - 4px)',
          opacity: '0.1'
        }
      ]

      const animProperties = {
        duration: animationDuration,
        iterations: Infinity
      }

      progressBarFx.animate(animKeyframes, animProperties)
    }

    onMounted(() => {
      nextTick(() => {
        if (!progressbarRef.value) return

        appendProgressBarImg()
        generateProgressBarFX()

        if (!props.barAnimation) return

        watch(
          () => props.value,
          (val) => {
            if (val >= 10) {
              progressBarFx.classList.remove('hidden')
            }
          },
          {
            immediate: true
          }
        )
      })
    })

    return {
      borderRadiusValue,
      progressbarRef,
      color
    }
  }
}
</script>

<style lang="scss">
#o-progressbar {
  &.p-progressbar {
    overflow: visible;
    border-radius: v-bind(borderRadiusValue);
    background-color: black;
    height: 1rem;

    .p-progressbar-value {
      overflow: visible;
      border-radius: v-bind(borderRadiusValue);
      background-color: v-bind(color);
      position: relative;

      .p-progressbar-label {
        display: block;
      }
    }
  }

  .o-progressbar__image {
    height: 1.75rem;
    position: absolute;
    top: 50%;
    right: 0;
    z-index: 3;

    border-radius: 50%;
  }

  .o-progressbar__fx {
    content: '';
    width: 40px;
    height: 100%;
    background-color: white;
    opacity: 0.1;
    transform: skewX(50deg);

    position: absolute;
    top: 0;
    left: 4px;
    z-index: 2;

    &.hidden {
      visibility: hidden;
    }
  }

  .default-animation {
    animation: o-progressbar__default-animation 1s infinite ease-in-out alternate;
  }
  .custom-animation {
    animation: o-progressbar__custom-animation 1s infinite ease-in-out alternate;
  }

  @keyframes o-progressbar__default-animation {
    from {
      filter: drop-shadow(0 0 3px rgba(50, 205, 50, 0)); // limegreen
    }
    to {
      filter: drop-shadow(0 0 3px rgba(50, 205, 50, 1)); // limegreen
    }
  }
  @keyframes o-progressbar__custom-animation {
    from {
      filter: drop-shadow(0 0 3px rgba(var(--primary-color-rgb), 0));
    }
    to {
      filter: drop-shadow(0 0 3px rgba(var(--primary-color-rgb), 1));
    }
  }
}
</style>
