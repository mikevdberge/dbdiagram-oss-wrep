
import { defineStore } from "pinia";
import { markRaw } from "vue";

export const useChartStore = defineStore("chart", {
  state: () => ({
    zoom: 1.0,
    pan: { x: 0, y: 0 },
    ctm: [1, 0, 0, 1, 0, 0],
    inverseCtm: [1, 0, 0, 1, 0, 0],
    tableGroups: {},
    tables: {},
    tablesColors:{},
    actualTables:{},
    refs: {},
    grid: {
      size: 100,
      divisions: 10,
      snap: 5
    },
    loaded: false,
    tooltip: {
      x: 0,
      y: 0,
      show: false,
      target: null,
      component: null,
      binds: null,
      width: 0,
      height: 0
    },
    panel: {
      x: 0,
      y: 0,
      show: false,
      target: null,
      component: null,
      binds: null,
      width: 0,
      height: 0,
      datetime:null
    },
    refspanel: {
      x: 0,
      y: 0,
      show: false,
      target: null,
      component: null,
      binds: null,
      width: 0,
      height: 0,
      datetime:null
    },
  }),
  getters: {
    subGridSize(state) {
      return state.grid.size / state.grid.divisions;
    },
    persistenceData(state) {
      const { zoom, pan, ctm, inverseCtm, tables, refs } = state;
      return  { zoom, pan, ctm, inverseCtm, tables, refs };
    },
    getPan(state) {
      return state.pan;
    },
    getZoom(state) {
      return state.zoom;
    },
    getCTM(state) {
      return state.ctm;
    },
    getTables(){
      return this.tables;
    },
    getRefs(){
      return this.refs;
    },
    getTableGroups(){
      return this.tableGroups;
    },
    getTable(state) {
      return (tableId) => {
        if (!(tableId in state.tables))
          state.tables[tableId] = {
            x: 0,
            y: 0,
            width: 220,
            height: 32
          };
        return state.tables[tableId];
      };
    },
    getTableColor(state) {
      return (tablename, tableId, schema) => {
        let tfn = `${schema}.${tablename}`;
       
        if (tableId in state.tablesColors) {

          if (Object.keys(state.tablesColors[tableId]).includes('color')){
            const c = state.tablesColors[tableId].color;
            state.tablesColors[tableId][tfn] = {color:c}
            delete state.tablesColors[tableId].color
          }

          if (!(tfn in state.tablesColors[tableId])){
            let founded = false;
            for (const obj in state.tablesColors){
              if (tfn in state.tablesColors[obj] && obj != tableId){
                state.tablesColors[tableId][tfn] = state.tablesColors[obj][tfn]
                delete state.tablesColors[obj][tfn]
                founded = true
              }
            }
            if (!founded) {
              if (Object.keys(state.tablesColors[tableId]).length > 0) {
                if (!(tfn in state.tablesColors[tableId])){
                  const k = Object.keys(state.tablesColors[tableId])[0]
                  state.tablesColors[tableId][tfn] = state.tablesColors[tableId][k]
                  delete state.tablesColors[tableId][k]
                }  
              } else {
                state.tablesColors[tableId] = {};
                state.tablesColors[tableId][tfn] = {color:null} 
              }     
            }
          }
        } else {

          state.tablesColors[tableId] = {};
          state.tablesColors[tableId][tfn] = {color:null} 

          if (tablename in state.tablesColors) {
            state.tablesColors[tableId] = {};
            state.tablesColors[tableId][tfn] = state.tablesColors[tablename];
            delete state.tablesColors[tablename];
          } else {
            state.tablesColors[tableId] = {};
            state.tablesColors[tableId][tfn] = {color:null} 
          }

          if (tfn in state.tablesColors) {
            state.tablesColors[tableId] = {};
            state.tablesColors[tableId][tfn] = state.tablesColors[tfn]
            delete state.tablesColors[tfn];
          } else {
            state.tablesColors[tableId] = {};
            state.tablesColors[tableId][tfn] = {color:null} 
          }
          
        }   
        return state.tablesColors[tableId][tfn];
      };
    },
    getTableGroup(state) {
      return (tableGroupId) => {
        if (!(tableGroupId in state.tableGroups))
          state.tableGroups[tableGroupId] = {
            x: 0,
            y: 0,
            width: 200,
            height: 32
          };
        return state.tableGroups[tableGroupId];
      };
    },
    getRef(state) {
      return (refId) => {
        if (!(refId in state.refs))
          state.refs[refId] = {
            endpoints: [],
            vertices: [],
            auto: true
          };
        return state.refs[refId];
      };
    },
    save(state) {
      return {
        zoom: state.zoom,
        pan: state.pan,
        ctm: state.ctm,
        inverseCtm: state.inverseCtm,
        tables: state.tables,
        refs: state.refs,
        tablesColors:state.tablesColors,
        grid: state.grid
      };
    }
  },
  actions: {
    showTooltip(target, component, binds) {
      this.tooltip = {
        x: target.x,
        y: target.y,
        component: markRaw(component),
        binds,
        show: true
      };
    },
    hideTooltip() {
      this.tooltip = {
        x:0,
        y:0,
        width:0,
        height:0,
        component: null,
        binds: null,
        show: false
      };
    },
    showPanel(target, component, binds) {
      this.panel = {
        x: target.x,
        y: target.y,
        component: markRaw(component),
        binds,
        show: true,
        datetime: Date.now()
      };
    },
    showRefPanel(target, component, binds) {
      this.refspanel = {
        x: target.x,
        y: target.y,
        component: markRaw(component),
        binds,
        show: true,
        datetime: Date.now()
      };
    },
    hidePanel() {
      this.panel = {
        x:0,
        y:0,
        width:0,
        height:0,
        component: null,
        binds: null,
        show: false,
        datetime:null
      };
    },
    hideRefPanel() {
      this.refspanel = {
        x:0,
        y:0,
        width:0,
        height:0,
        component: null,
        binds: null,
        show: false,
        datetime:null
      };
    },
    loadDatabase(database) {
      let tablesList = [];
      for (const schema of database.schemas){
        for(const tableGroup of schema.tableGroups)
        {
          this.getTableGroup(tableGroup.id);
        }
        
        for(const table of schema.tables)
        {
          this.getTable(table.id);
          this.getTableColor(table.name,table.id,schema.name)
        }
        tablesList.push(...schema.tables.map((x)=> x.id));
       
        for(const ref of schema.refs)
        {
          this.getRef(ref.id);
        }
        console.log(schema);
      }
      
      
      this.$patch({
        actualTables:tablesList
      })
      this.loaded = true;
    },
    load(state) {      
      console.log(Object.values(this.actualTables))
      for (const tbl in state.tables) {
          if (!(Object.values(this.actualTables).includes(Number(tbl)))){
            delete state.tables[tbl]
          } 
      }
      this.$reset();
      this.$patch({
        ...state,
        ctm: DOMMatrix.fromMatrix(state.ctm),
        inverseCtm: DOMMatrix.fromMatrix(state.inverseCtm).inverse()
      });
    },
    updatePan(newPan) {
      this.$patch({
        pan: {
          x: newPan.x,
          y: newPan.y
        }
      });
    },

    updateZoom(newZoom) {
      this.$patch({
        zoom: newZoom
      });
    },

    updateCTM(newCTM) {
      this.$patch({
        ctm: DOMMatrix.fromMatrix(newCTM),
        inverseCtm: DOMMatrix.fromMatrix(newCTM).inverse()
      });
    },
    updateTableColor(tablename,id, color,schema) {
      let tfn = `${schema}.${tablename}`;
      this.$patch({
        tablesColors:{[id]: { [tfn]: {'color': color }}}
      });
    },
    updateTable(tableId, newTable) {
      this.$patch({
        tables:{[tableId]: newTable}
      });
    },
    updateRef(refId, newRef) {
      this.$patch({
        refs:{ [refId]: newRef}
       
      });
    }
  }
});
