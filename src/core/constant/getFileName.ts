
export const FileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = '.' + file.originalname.split('.')[1];
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

export const FolderName = (req, file, callback) => {
  const path = req.params.path;
  // const validPath = [
  //   UPLOAD_PATH.LEGAL_DOC, UPLOAD_PATH.IMAGE, UPLOAD_PATH.GIFT, UPLOAD_PATH.MOVIES, UPLOAD_PATH.USER
  // ]
  // console.log(validPath)
        callback(null, `public/${path}`);

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  // for (let i:number = 0; i <= validPath.length - 1; i++) {
  //   if (path === validPath[i]) {
  //     callback(null, `public/${path}`);
  //     continue;
  //   }
  // }
  // const res = new ResponseData();
  // res.statusCode = HttpStatus.NOT_FOUND
  // res.message = [RESPOSE_CODE_message.CHANGEFILEPATH]
  // callback(res, false);

};