import { defineStore } from "pinia";
import { markRaw } from "vue";
import * as S3 from 'aws-sdk/clients/s3';


import localforage from "localforage";
import { useFilesStore } from "./files";

const fs = localforage.createInstance({
  name: "dbdiagram-oss",
  storeName: "repo"
});
const filesfs = localforage.createInstance({
    name: "dbdiagram-oss",
    storeName: "files"
  });
 

export const useRepoStore = defineStore("repo", {
  state: () => ({
    host : "",
    bucket: "",
    path: "",
    region:"",
    access_key: "",
    secret_key: "",
    files : []
    
    }
  ),
  getters: {
    getHost(state){
        return state.host;
    },
    getBucket(state){
        return state.bucket;
    },
    getPath(state){
        return state.path;
    },
    getAccessKey(state){
        return state.access_key;
    },
    getSecretKey(state){
        return state.secret_key;
    },
    getFiles(state){
        return state.files;
    },
    
    save(state) {
      return {
        host: state.host,
        bucket: state.bucket,
        region:state.region,
        path:state.path,
        access_key: state.access_key,
        secret_key: state.secret_key,
      };
    }
  },
  actions: {
    loadRepoConfig(){
        fs.getItem("cfg").then((val) => {
            if (val){
                this.load(JSON.parse(val));
            }
            
        }
       
        );
       
    },
    load(data) {
        this.$patch({
            host : data.host,
            bucket : data.bucket,
            region: data.region,
            path : data.path,
            access_key : data.access_key,
            secret_key : data.secret_key,
        })
          
        
      },
      saveLoadedFiles(err,data){
        var files = data.Contents;
        if (files.length > 0) console.log(files);
        var all_files = [];
        files.forEach((val)=>{
            if (String(val.Key).startsWith(this.path) && String(val.Key).endsWith(".json")){
                all_files.push(val.Key);
            }
        });
        console.log(all_files);
        this.$patch({
            files: all_files
        }) ;
      },
      loadRepoFiles(){
        this.getClient().listObjects({
            Bucket:this.bucket, 
        },this.saveLoadedFiles)
      },
     getRepoFiles(){
    
       this.loadRepoFiles();
    
        
    },
    saveRepoConfig(){
        fs.setItem("cfg",JSON.stringify(this.save)).then(()=>{
            console.log('repo config saved')
        });
    },
    
    async loadFromRepo(file){
        const fstore = useFilesStore();
        console.log(file);
        await this.getClient().getObject({
            Key:file,
            Bucket:this.bucket,
        }).promise().then((result)=> {
            console.log(result)
            var data = result.Body.toString('utf-8')
            filesfs.setItem(file,JSON.parse(data)).then(
                ()=>{
                    fstore.loadFile(file);
                }
            );
            
        });
       
        
    },

    sendInRepo(){
        const fstore = useFilesStore();
        var key = fstore.getCurrentFile;
        
        
        if (!key.startsWith(this.path)){
            key = this.path +'/'+key+'.json';
        } 
        console.log(key);
        var parts = [];
        fstore.saveFile(fstore.getCurrentFile);
        parts.push(JSON.stringify(filesfs.getItem(fstore.getCurrentFile)));
      
        filesfs.getItem(fstore.getCurrentFile).then(
            (file) => {
               var data = new Blob([JSON.stringify(file)]);
               this.getClient().putObject({
                Bucket:this.bucket,
                Key:key,
                Body: data,
            },this.sendInRepoCallback);
            }
        )
        
        fstore.renameFile(key);
       
        
    },
    sendInRepoCallback(data){
        console.log(data);
    },
    getClient(){ 
        var s3client = new S3({
            apiVersion: 'latest',
            region:this.region,
            endpoint: `${this.host}`,
            
            credentials: {
                accessKeyId: this.access_key,
                secretAccessKey: this.secret_key,
            },
        });
        return s3client;
        
    }
  }
});
