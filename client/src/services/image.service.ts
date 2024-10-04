import axios from "axios";
import {API_URL} from "../entities/server";

export class ImageService {
    static get api() {
        return `${API_URL}/image`;
    }

    static async getById(id: string) {
        try {
            return await axios.get(`${this.api}?id=${id}`);
        } catch (e) {
            console.error(e);
        }
    }

    static async setImage(id: string, url: string) {
        try {
            await axios.post(`${this.api}?id=${id}`, {img: url});
        } catch (e) {
            console.error(e);
        }
    }
}