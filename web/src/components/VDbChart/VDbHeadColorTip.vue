<template>
  <q-card-section>
    <div class="text-subtitle2">{{ table.name }}</div>
  </q-card-section>
  <q-separator />
  <q-card-section>
    <div class="text-caption">Colors</div>
    <div class="q-pm-xs row">
     
      <div v-for="row of palette" ref="cp">
        <div class="col">
        <q-item v-for="cl of row" :key="cl" >
        
            <rect class="db-tooltip__colorblock">
              <rect class="db-tooltip__colorblock" :style="{'background': cl, 'height':'1.4em', width: '1.4em'}" @click.passive="setColor($event, cl)"></rect>
            </rect>
 
      </q-item>
    </div>
  </div>      
  
    </div>
  </q-card-section>
</template>

<script setup>

import {ref} from 'vue'
  
  const props = defineProps({
    table: Object, 
  });

  const cp = ref(null);

  const emit = defineEmits([
    'click:color-block'
  ])

  const palette = [['#1E69FD','#4B82B0','#121212','#24BAB1','#126E7A'],
              ['#2D6512','#79AD51','#E4A62E','#EB801B','#8F8DD8'],
              ['#990D0D','#CA4242','#DE65C3','#6724BB','#A15CF5']];
  
  const setColor = (e,color) => { 
    emit('click:color-block',e, props.table.id, color)
  };
  
</script>

