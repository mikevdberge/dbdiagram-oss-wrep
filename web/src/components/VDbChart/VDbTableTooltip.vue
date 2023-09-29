<template>
  <q-card-section style="padding: 8px 8px;">
    <div class="text-subtitle2">{{ table.name }}</div>
  </q-card-section>
  <q-separator />
  <q-card-section>
    <div class="text-caption"><b>Info</b></div>
    <div v-if="table.note">Note: {{ table.note }}</div>
    <div v-if="table.alias">Alias: {{ table.alias }}</div>
  </q-card-section>
  <q-card-section v-if="table.indexes.lenght > 0">
    <div class="text-caption"><b>Indexes</b></div>
    <q-list>
      <q-item v-for="index of table.indexes">
        <q-item-label>{{index.name}}</q-item-label>
      </q-item>
    </q-list>
  </q-card-section>
  
</template>

<script setup>

  const props = defineProps({
    table: Object,
  });
   
</script>

