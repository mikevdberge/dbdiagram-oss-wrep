<template>
  <q-card-section>
    <div class="text-subtitle2">{{ table.name }}</div>
  </q-card-section>
  <q-separator />
  <q-card-section>
    <div class="text-caption">Indexes</div>
    <q-list>
      <q-item v-for="index of table.indexes">
        <q-item-label>{{index.name}}</q-item-label>
      </q-item>
    </q-list>
    <div class="text-caption">Colors</div>
    <div class="q-pm-xs row">
     
      <q-item v-for="row of palette">
        <div class="col">
        <q-item v-for="cl of row" :key="cl">
          <svg height="1em" width="1em" @click="()=>setColor(table.id, cl)">
            <rect class="db-tooltip__colorblock" :fill="cl"/>
          </svg>
 
      </q-item>
    </div>
      </q-item>      
  
    </div>
  </q-card-section>
</template>

<script setup>

  const props = defineProps({
    table: Object,
    
  });
  let selectedColor;
  const palette = [['#1E69FD','#4B82B0','#011B4E','#24BAB1','#126E7A'],
              ['#2D6512','#79AD51','#E4A62E','#EB801B','#8F8DD8'],
              ['#990D0D','#CA4242','#DE65C3','#6724BB','#A15CF5']];
  
  const setColor = (id,color) => { console.log(id,color)};
  
</script>

