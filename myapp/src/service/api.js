import axios from 'axios';
import { API_NOTIFICATION_MESSAGES, SERVICE_URLS } from '../constants/config';
import { getAccessToken,getType } from '../utils/commonutils';


const API_URL = 'http://localhost:8000';
const axiosInstance = axios.create({
         baseURL: API_URL,
         timeout: 30000,
         headers:{
            "Accept": "application/json, multipart/form-data", 
            "Content-Type": "application/json"
    //         'Accept': 'application/json,  form-data',
    // 'Accept-Language': 'en-US,en;q=0.8',
    // 'Content-Type': `multipart/form-data; application/json`
            
         }
})

axiosInstance.interceptors.request.use(
    function(config){
        if(config.TYPE.params){
            config.params = config.TYPE.params;
        }else if(config.TYPE.query){
            config.url = config.url + '/' + config.TYPE.query;
        }
        // const token = getAccessToken();
        // if (token) {
        //   config.headers['Authorization'] = `Bearer ${token}`;
        // }
        return config;
    },
    function(error){
        return Promise.reject(error);
    }
)

axiosInstance.interceptors.response.use(
    function(response){
       //stop global loader here.
       return processResponse(response);
    },
    function(error){
        //stop global loader here.
        return Promise.reject(processError(error));
    }
)
/////////////////////////////
// if success -> return { issuccess:true,data:object}
// if fail -> return (isfailure: true,status:string,msg:string,code:init)

const processResponse = (response) => {
     if(response?.status ===200){
        return {issuccess:true,data: response.data}
     }else{
        return{
           isFailure: true,
           status: response?.status,
           msg: response?.msg,
           code:response?.code  
        }
     }
}


const processError = (error) =>{
    if(error.response){
    // request made ans server responded with a status other
    //thats fall out of the range 2.x.x
    console.log('Error in Response:',error.toJSON());
    return {
        isError: true,
        msg:API_NOTIFICATION_MESSAGES.responseFailure,
        code:error.response.status
    }
    }else if(error.request){
      //request made but no response was received
    console.log('Error in Request:',error.toJSON());

      return {
        isError: true,
        msg:API_NOTIFICATION_MESSAGES.requestFailure,
        code:""
    }
   
    }else{
       // something happen in frontend.
    console.log('Error in Network:',error.toJSON());

       return {
        isError: true,
        msg:API_NOTIFICATION_MESSAGES.networkError,
        code:""
    }
    }
}

const API = {};

for(const [key,value] of Object.entries(SERVICE_URLS)){
    API[key] = (body,showUploadProgress, showDownloadProgress) =>
        axiosInstance({
            method: value.method,
             url: value.url,
             data: value.method === 'DELETE'? {} :body,
            //url: value.method === 'DELETE' ? `${value.url}/${body}` : value.url, // Append the ID directly for DELETE
           // data: value.method === 'DELETE' ? null : body, // No body for DELETE
            responseType: value.responseType,
            headers: {
                authorization: getAccessToken()
            },
            TYPE: getType(value,body),
            onUploadProgress: function(progressEvent){
                if(showUploadProgress){
                    let percentageCompleted = Math.round((progressEvent.loaded*100) / progressEvent.total)
                    showUploadProgress(percentageCompleted);
                }
            },
            onDownloadProgress: function(progressEvent){
                if(showDownloadProgress){
                    let percentageCompleted = Math.round((progressEvent.loaded*100) / progressEvent.total)
                    showDownloadProgress(percentageCompleted);
                }
            }
        })
    }

    export { API};
