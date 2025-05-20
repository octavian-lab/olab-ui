<template>
  <transition
    appear
    enter-active-class="fadeInUp-custom"
    leave-active-class="fadeOutDown-custom"
    mode="out-in"
  >
    <div v-if="requiredFilters.length === 0 && doRefreshData != null">
      <Button
        :class="['search-btn', { 'fadeInUp-custom': fastfilter }]"
        :label="$translate('admin.action.search')"
        icon="fad fa-magnifying-glass"
        :disabled="btnDisabled"
        :loading="btnLoading || $loading.isLoading('search')"
        @click="doRefreshData()"
      />
    </div>

    <div
      class="flex align-items-center justify-content-center"
      v-else-if="requiredFilters.length !== 0 && doRefreshData != null"
    >
      <i
        v-tooltip="
          fastfilter
            ? {
                value: $translate(requiredFieldsText)
              }
            : undefined
        "
        :class="[
          'fad fa-exclamation-triangle animate__animated animate__heartBeat animate__infinite text-warning fa-2x',
          fastfilter ? 'ml-3' : 'mr-3'
        ]"
      />
      <span v-if="!fastfilter" class="font-bold text-responsive text-uppercase">
        {{ $translate(requiredFieldsText) }}
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
    requiredFilters: { type: Array },
    btnLoading: Boolean,
    requiredFieldsText: {
      type: String,
      default: () => 'admin.filter.panel.compile.required.filters'
    }
  }
}
</script>

<style lang="scss" scoped>
.search-btn {
  height: 100%;
}
.fadeInUp-custom {
  animation: fadeInUp;
  animation-duration: 0.2s;
}
.fadeOutDown-custom {
  animation: fadeOutDown;
  animation-duration: 0.2s;
}
</style>
