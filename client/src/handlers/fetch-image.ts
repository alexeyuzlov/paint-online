import {setImageHandler} from "./set-image-handler";
import {ImageService} from "../services/image.service";

export const fetchImage = async (canvasRef: HTMLCanvasElement, imageId: string) => {
    const response = await ImageService.getById(imageId);

    if (response?.data) {
        return setImageHandler(canvasRef, response.data);
    }
};