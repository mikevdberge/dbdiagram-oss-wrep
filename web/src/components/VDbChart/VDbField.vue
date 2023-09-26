<template>
  <svg
    ref="root"
    :id="`field-${id}`"
    :class="{
      'db-field':true,
      'db-field__highlight': highlight,
      'db-field__dragging': dragging,
      'db-field__pk': pk,
      'db-field__unique': unique,
      'db-field__not_null': not_null,
      'db-field__increment': increment,
      'db-field__ref': endpoints.length > 0
    }"
    :x="position.x"
    :y="position.y"
    :width="size.width"
    :height="size.height"
    @mousedown.passive="onMouseDown"
    @mouseup.passive="onMouseUp"
    @mouseenter.passive="onMouseEnter"
    @mouseleave.passive="onMouseLeave"
  >
    <rect
      :height="size.height"
      :width="size.width"
    />
    <text class="db-field__name"
          :y="size.height/2">
      {{ name }}
    </text>
    <svg v-if="pk" class="db-field__pk-icon" xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"
    :x="state.name_width"
          :y="size.height/4" >
      <path d="M280-400q-33 0-56.5-23.5T200-480q0-33 23.5-56.5T280-560q33 0 56.5 23.5T360-480q0 33-23.5 56.5T280-400Zm0 160q-100 0-170-70T40-480q0-100 70-170t170-70q67 0 121.5 33t86.5 87h352l120 120-180 180-80-60-80 60-85-60h-47q-32 54-86.5 87T280-240Zm0-80q56 0 98.5-34t56.5-86h125l58 41 82-61 71 55 75-75-40-40H435q-14-52-56.5-86T280-640q-66 0-113 47t-47 113q0 66 47 113t113 47Z"/>
    </svg>
    <text class="db-field__type"
          :x="size.width"
          :y="size.height/2">
      {{ type.type_name }}
    </text>
    <title>{{name}} ({{type.type_name}}) {{note ? ": "+note : null}}</title>
  </svg>
</template>

<script setup>
  import { computed, onMounted, ref, watch } from 'vue'

  const props = defineProps({
    id: Number,
    selection: String,
    token: Object,
    name: String,
    type: Object,
    unique: Boolean,
    pk: Boolean,
    dbState: Object,
    not_null: Boolean,
    note: String,
    dbdefault: Object,
    increment: Boolean,
    width: Number,
    table: Object,
    endpoints: Array,
    _enum: Object,
  })
  const root = ref(null)

  const size = computed(() => ({
    width: props.width,
    height: 30
  }))

  const state = computed(()=>({
    name_width:props.name.length*(16/2)+16,
  }))

 const updateNameWidth = ()=>{
    if (!root.value) return;
    state.value.name_width = root.value.querySelectorAll(".db-field__name")[0].getComputedTextLength()+(1.5*16);
  };

  watch(() => props.name, value =>{
      updateNameWidth();
  });

  const position = computed(() => ({
    x: 0,
    y: 35 + (props.table.fields.findIndex(f => f.id === props.id) * 30)
  }))

  const mounted = onMounted(() => {
    // nothing so far
  })

  const highlight = ref(false)
  const dragging = ref(false)
  const onMouseEnter = (e) => {
    highlight.value = true
  }
  const onMouseLeave = (e) => {
    highlight.value = false
    dragging.value = false
  }
  const onMouseUp = (e) => {
    dragging.value = false
  }
  const onMouseDown = (e) => {
    dragging.value = true
  }

</script>
