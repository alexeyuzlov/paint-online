import Toolbar from "./Toolbar";
import SettingBar from "./SettingBar";
import Canvas from "./Canvas";
import React, {useEffect, useState} from "react";
import {handleModal} from "../handlers/handle-modal";
import UserRegisterModal from "./UserRegisterModal";

const DrawingScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        handleModal(setModalVisible);
    }, []);

    return (
        <>
            {modalVisible && <UserRegisterModal/>}
            <Toolbar />
            <SettingBar />
            <Canvas />
        </>
    )
}

export default DrawingScreen;