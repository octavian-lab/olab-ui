<template>
  <transition
    appear
    enter-active-class="fadeInUp-custom"
    leave-active-class="fadeOutDown-custom"
    mode="out-in"
  >
    <Button
      v-if="requiredFilters.length === 0"
      :class="['search-btn', { 'fadeInUp-custom': fastfilter }]"
      :label="$translate('admin.action.search')"
      icon="fad fa-magnifying-glass"
      :disabled="btnDisabled"
      :loading="$loading.isLoading('search')"
      @click="doRefreshData()"
    />
    <div class="flex align-items-center justify-content-center" v-else>
      <i
        v-tooltip="
          fastfilter
            ? {
                value: $translate('admin.filter.panel.compile.required.filters')
              }
            : undefined
        "
        :class="[
          'fad fa-exclamation-triangle animate__animated animate__heartBeat animate__infinite text-warning fa-2x',
          fastfilter ? 'ml-3' : 'mr-3'
        ]"
      />
      <span v-if="!fastfilter" class="font-bold text-responsive font-uppercase">
        {{ $translate('admin.filter.panel.compile.required.filters') }}
      </span>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'OFiltersPanelBtnSearch',
  inject: {
    doRefreshData: { default: undefined }
  },
  props: {
    fastfilter: { type: Boolean, default: () => false },
    btnDisabled: { type: Boolean },
    requiredFilters: { type: Array }
  }
}
</script>

<style lang="scss" scoped>
.fadeInUp-custom {
  animation: fadeInUp;
  animation-duration: 0.2s;
}
.fadeOutDown-custom {
  animation: fadeOutDown;
  animation-duration: 0.2s;
}
</style>
