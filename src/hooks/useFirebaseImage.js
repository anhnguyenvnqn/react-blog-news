import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";

export default function useFirebaseImage(setValue, getValues, imageName = null, cb = null) {

  const [progress, setProgress] = useState(0)
  const [image, setImage] = useState("")
  if (!setValue || !getValues) return

  const handleUploadImage = (file) => {
    //lấy từ docs về
    const storage = getStorage();
    const storageRef = ref(storage, 'images/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file,);
    uploadTask.on('state_changed',
      (snapshot) => {
        //làm thanh progress hiển thị tiến độ upload
        const progressPercent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progressPercent)
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
          default:
            console.log("Nothing at all");
        }
      },
      (error) => {
        console.log("Error");
      },
      () => {
        //khi upload thành công, lấy về 1 đường dẫn của ảnh
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          setImage(downloadURL)
        });
      }
    );
  }

  const handleSelectImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setValue("image_name", file.name)
    handleUploadImage(file)
  }

  const handleDeleteImage = () => {
    //lấy từ docs về
    const storage = getStorage();
    const imageRef = ref(storage, 'images/' + ( getValues("image_name")));

    deleteObject(imageRef)
      .then(() => {
        console.log('Remove image successfuly');
        //sau khi delete, set lại các giá trị về ban đầu  
        setImage("");
        setProgress(0);
       
      })
      .catch((error) => {
        console.log('Can not delete image');

      });
  }
  const handleResetUploadImg = () => {
    setImage("");
    setProgress(0)
  }
  return {
    image,
    setImage,
    handleResetUploadImg,
    progress,
    handleSelectImage,
    handleDeleteImage,
    handleUploadImage
  }

}