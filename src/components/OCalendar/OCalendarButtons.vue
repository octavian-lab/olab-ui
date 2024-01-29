<template>
  <div id="o-calendar-buttons" class="flex flex-column">
    <Button icon="fad fa-angle-up" class="border-noround px-2" @click="$emit('onAddDay',1)"/>
    <Button icon="fad fa-angle-down" class="border-noround px-2"  @click="$emit('onAddDay',-1)"/>
  </div>
</template>

<script>
export default {
  name: "OCalendarButtons"
}
</script>