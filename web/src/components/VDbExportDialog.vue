<template>
<q-dialog ref="dialogRef" @hide="onDialogHide">
<q-card class="q-dialog-plugin ace-preferences-dialog">
    <q-bar>
        <q-icon name="download"></q-icon>
        <h6 :style="{'margin':'10px'}">Export {{ props.id }}</h6>
    </q-bar>
    <q-card-section>
        <div class="q-gutter-y-lg">
            <q-input class="col-md-4 col-lg-3"
                 v-model="props.file_name"
                 type="string"
                 stack-label
                 :label="`File name`"
        />
        </div>
    </q-card-section>

   
    <q-card-actions align="right">
        <q-btn flat color="primary" label="Cancel" @click="onDialogCancel" />
        <q-btn flat color="primary" label="OK" @click="onOKClick" />
      </q-card-actions>
</q-card>
</q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar } from 'quasar';
import { computed, defineProps,ref } from 'vue';
import { useFilesStore } from '../store/files';
import localforage from "localforage";
import { PresignedPost } from 'aws-sdk/clients/s3';
import { useChartStore } from '../store/chart';

const $q = useQuasar();

const chart = useChartStore();

const props = defineProps({
    id: {
      type: String,
      required: true
    },
    file_name:{
        type: String,
        required: false
    }
    
  })

  defineEmits([
    ...useDialogPluginComponent.emits
  ]);

  function saveAs(data){
    const a = document.createElement("a");
  const file = data;
  const url = window.URL.createObjectURL(file);
  a.setAttribute('href',url);
  a.setAttribute('download',props.file_name);
  a.click();
  URL.revokeObjectURL(url);

}

  const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

  function onOKClick () {

    const fstore = useFilesStore();
    const filesfs = localforage.createInstance({
    name: "dbdiagram-oss",
    storeName: "files"
  });
    

    if (props.id == 'json'){
        filesfs.getItem(fstore.getCurrentFile).then(
            (file) => {
                saveAs(new Blob([JSON.stringify(file)], {type:"image/svg+xml"}));
            }
        )
       
    }
    if (props.id == 'svg'){
      let svg = saveSvg();
       saveAs(new Blob([svg.svg.outerHTML.trim()]));
    }
    
    if (props.id == 'png'){
        
    let fake_svg = saveSvg();
   
      var image = new Image();
      image.height = fake_svg.size.height;
      image.width = fake_svg.size.width;
      image.src = 'data:image/svg+xml;base64,'+ window.btoa(new XMLSerializer().serializeToString(fake_svg.svg));

      image.onload = function() {
          console.log('load image');
        var canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        var context = canvas.getContext('2d');
        context.drawImage(image, 0,0);

        var a = document.createElement('a');
        a.download = props.file_name;
        a.href = canvas.toDataURL('image/png');
        document.body.appendChild(a);
        a.click();
      }
        
      }  
      $q.notify({
                caption:"Export",
                message:`File *.${props.id} successfully exported`,
                color: 'green',
                icon: 'task',
                position: 'bottom-right'
            })
      onDialogOK()
}

function saveSvg(){
  let container = document.createElement('div');
  let fake_svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    fake_svg.setAttribute('class',"db-chart db-chart__bg");
    fake_svg.setAttribute("version", "1.1");
    
    fake_svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    fake_svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
  
    //not good solution, but i'm lazy
    let bounds = getBounds({l:0, r:0, t:0, b:0},chart.getTables);
    bounds = getBounds(bounds, chart.getTableGroups);
    let chartRefs = chart.getRefs;
    console.log(chartRefs);
    for (let rf in chartRefs){
      
      if (chartRefs[rf].vertices.length > 0){
        bounds = getBounds(bounds, chartRefs[rf].vertices,true);
      }
    }
    let size = {
      width: Math.abs(bounds.l)+bounds.r+40,
      height:Math.abs(bounds.t)+bounds.b+40
    }
    fake_svg.setAttribute('viewBox',`${bounds.l-20} ${bounds.t-20} ${size.width}  ${size.height}`);

    var tablegroups = document.getElementById('tablegroups-layer');
    fake_svg.appendChild(tablegroups.cloneNode(true));
    var tables = document.getElementById('tables-layer');
    fake_svg.appendChild(tables.cloneNode(true));
    let color_icons = fake_svg.getElementById('tables-layer').getElementsByClassName('db-table-header__color-icon');
    while (color_icons.length > 0) {
      color_icons[0].parentNode.removeChild(color_icons[0]);
    }
    let note_icons = fake_svg.getElementById('tables-layer').getElementsByClassName('db-field__note-icon');
    while (note_icons.length > 0) {
      note_icons[0].parentNode.removeChild(note_icons[0]);
    }
    var refs = document.getElementById('refs-layer');
    fake_svg.appendChild(refs.cloneNode(true));
    let fake_refs = fake_svg.getElementById('refs-layer').children;
    for (let ref of fake_refs){
      ref.removeChild(ref.getElementsByClassName("db-ref__control-points")[0]);
    }
    

    container.appendChild(fake_svg);
    applyCSS(container, 
    ["fill", "font-family", "font-size","stroke","stroke-width",
    "stroke-linejoin", "stroke-opacity","stroke-linecap",
    "transform","text-anchor","font-weight","vertical-align"],
    ["background-color"])

  return { svg: fake_svg, size:size} ;
}

function getBounds(bounds, objects,isRef = false){
    for (let item in objects){
        if (objects[item].x < bounds.l) {
           bounds.l = objects[item].x
        }
        if (objects[item].y < bounds.t) {
          bounds.t = objects[item].y
        }
        if (!isRef){
          if (objects[item].x+objects[item].width > bounds.r) {
          bounds.r = objects[item].x+objects[item].width 
          }
          if (objects[item].y+objects[item].height > bounds.b) {
            bounds.b = objects[item].y+objects[item].height 
          }
        }
       
    }
    return bounds;
}

function applyCSS(root, copyProperties, inStylesProperties){
    let bodyStyles = window.getComputedStyle(document.body);
    let styleSheets = document.styleSheets;
    for (let s = 0; s < styleSheets.length; s++){
      let rules = styleSheets[s].cssRules;
      for (let r = 0; r < rules.length; r++){
          let rule = rules[r];
          if (typeof(rule.style) != "undefined"){
            let objects = root.querySelectorAll(rule.selectorText);
            
            if (objects.length > 0){
                for (let item of objects){
                  if (rule.style.length > 0){
                      for (let rs = 0; rs < rule.style.length; rs++){
                          if (copyProperties.some((x)=> x === rule.style[rs])){
                              let value = getCSSVariable(rule.style[rule.style[rs]],bodyStyles);
                              if (value == null){
                                 value = rule.style[rule.style[rs]];
                              }
                              if (rule.style[rs] == "transform"){
                                value = transformCSStoSVG(value);
                              }
                                                            
                              item.setAttribute(rule.style[rs],value);
                          }
                          if (inStylesProperties.some((x)=> x === rule.style[rs])){
                              let value = getCSSVariable(rule.style[rule.style[rs]],bodyStyles);
                              if (value == null){
                                 value = rule.style[rule.style[rs]];
                              }
                              let stl = item.getAttribute('style')
                              if (stl != null){
                                item.setAttribute('style',`${stl} ${rule.style[rs]}:${value};`);
                              } else {
                                item.setAttribute('style',`${rule.style[rs]}:${value};`);
                              }
                             
                          }
                      }
                  } 
                }
               
            } 
          }
      }
    }
}

function transformCSStoSVG(value){
  const variable_regex = RegExp(/translateX\(([+-]?\d+\.?\d*)(.*?)\) translateY\(([+-]?\d+\.?\d*)(.*?)\)/,"iu");
  if (variable_regex.test(value)){
    let matches = variable_regex.exec(value);    
    return `translate(${convertPxnEm(matches[1],matches[2])} ${convertPxnEm(matches[3],matches[4])})`;
   } else {
    return value;
   }
}

function convertPxnEm(value,dimension){
    if (dimension == 'px') {
        return value;
    } 
    if (dimension == 'em'){
      return Number(value)*16;
    }
    return value+dimension;
}

function getCSSVariable(variable, bodyStyles){
   const variable_regex = RegExp(/var\((--.*?)\)/,"iu");
   if (variable_regex.test(variable)){
    let matches = variable_regex.exec(variable);
    return bodyStyles.getPropertyValue(matches[1]);
   } else {
    return null;
   }
}

</script>
