import authState from "../store/auth.state";
import {Dispatch, SetStateAction} from "react";
import {USERNAME} from "../entities/keys";

export const handleModal = (setModalVisible: Dispatch<SetStateAction<boolean>>) => {
    const username = localStorage.getItem(USERNAME);

    if (!username) {
        setModalVisible(true);
    } else {
        authState.setUsername(username);
    }
};