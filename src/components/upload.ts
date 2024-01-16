import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    const upload = path.join(__dirname, '..', 'public', 'uploads');
    cb(null, upload);
  },
  filename: function (req: any, file: any, cb: any) {
    cb(null, `${uuidv4()}.${file.originalname.split('.').pop()}`);
  }
});

const storageExcel = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    const upload = path.join(__dirname, '..', 'public', 'excel');
    cb(null, upload);
  },
  filename: function (req: any, file: any, cb: any) {
    cb(null, `${uuidv4()}.${file.originalname.split('.').pop()}`);
  }
});

function fileFilter(req: any, file: any, cb: any) {
  const type = file.mimetype;
  const typeArray = type.split('/');
  cb(null, true);
}


function fileFilterExcel(req: any, file: any, cb: any) {
  if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
    return cb(new Error('only excel files are allowed'));
  } else {
    cb(null, true);
  }
}


export = {
  upload: multer({ storage, fileFilter }),
  excel: multer({ storage: storageExcel, fileFilter: fileFilterExcel })
};
