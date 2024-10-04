import {makeAutoObservable} from "mobx";

class AuthState {
    private _sessionId!: string;

    private _username!: string;

    public get getUsername() {
        return this._username;
    }

    public get getSessionId() {
        return this._sessionId;
    }

    constructor() {
        makeAutoObservable(this);
    }

    public setSessionId(id: string) {
        this._sessionId = id;
    }

    public setUsername(username: string) {
        this._username = username;
    }
}

const authState = new AuthState();

export default authState;