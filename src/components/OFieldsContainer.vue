<template>
    <div :class="['o-fields-container', { 'striped': striped }]">
        <slot />
    </div>
    <small v-if="showRequiredText" class="ml-1">
        {{ $translate("admin.generic.text.required") }}
    </small>
</template>

<script>
export default {
    name: "OFieldsContainer",
    props: {
        striped: { type: Boolean, default: () => true },
        showRequiredText: { type: Boolean, default: () => true },
    }
};
</script>