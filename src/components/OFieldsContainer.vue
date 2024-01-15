<template>
  <div id="o-fields-container" :class="['grid formgrid p-fluid', { striped: striped }]">
    <slot />
  </div>
  <small v-if="showRequiredText" class="ml-1">
    {{ $translate('admin.generic.text.required') }}
  </small>
</template>

<script>
export default {
  name: 'OFieldsContainer',
  props: {
    striped: { type: Boolean, default: () => true },
    showRequiredText: { type: Boolean, default: () => true }
  }
}
</script>
<style lang="scss">
$defaultInputHeight: 34px;
#o-fields-container {
  width: 100%;
  margin-left: 0;
  margin-right: 0;

  .inline-field {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &.striped {
    .o-field:nth-child(even) {
      background: var(--bluegray-100);
    }
  }

  .o-field {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;

    .p-dropdown .p-inputtext {
      display: flex;
      align-items: center;
    }

    [class*='p-input']:not([class*='p-chips'],[class*='p-inputswitch']) {
      height: $defaultInputHeight;
    }

    .o-field__label {
      font-size: 0.87rem;
      text-transform: uppercase;
    }

    &:first-child:not(i, .p-inputgroup, .p-calendar .p-chips-token, &[class*='col-']) {
      width: 100%;
    }

    &:first-child#o-calendar .p-calendar {
      width: 100% !important;
    }

    .o-field__value {
      width: 33.3%;

      > .p-component:not(.p-tag) {
        width: 100%;
      }

      @media screen and (max-width: 1200px) {
        width: 57%;
      }

      display: flex;
      align-items: center;
      justify-content: flex-end;

      .p-inputswitch {
        width: 3rem !important;
        height: 1.75rem !important;
      }

      .p-inputgroup-addon,
      .p-multiselect-token {
        width: auto !important;
      }

      .p-multiselect-label-container {
        width: 0;
      }
    }
  }
}
</style>
