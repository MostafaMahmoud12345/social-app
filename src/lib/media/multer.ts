import multer, { diskStorage, memoryStorage } from 'multer'
export function multerUpload(){
    return multer({storage:diskStorage({})})
}
export function uploadSingle(feildName:string) {
  return multerUpload().single(feildName);
}
export function uploadFilesArray(feildName:string, maxCount:number) {
  return multerUpload().array(feildName, maxCount);
}
 

