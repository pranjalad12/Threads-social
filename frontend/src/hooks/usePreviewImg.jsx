import { useState } from "react";
import useShowText from "./useShowToast";

const usePreviewImg = () => {
	const [imgUrl, setImgUrl] = useState(null);
	const showToast = useShowText();
	const handleImageChange = (e) => {
		const file = e.target.files[0];
        console.log(file);
		if (file && file.type.startsWith("image/")) {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onloadend = () => {
				setImgUrl(reader.result);
			};
			console.log(imgUrl);
			
		} else {
			showToast("Invalid file type", " Please select an image file", "error");
			setImgUrl(null);
		}
	};
	return { handleImageChange, imgUrl, setImgUrl };
};

export default usePreviewImg;