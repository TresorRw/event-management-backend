export interface registerUser {
    username: string,
    password: string,
    contact: string,
    userType: string
}
export interface logUser {
    username: string,
    password: string
}

export interface EventDetails {
    name: string,
    date_time: string,
    duration: string,
    location: string,
    description: string,
}

export interface AppContext {
    token?: String;
}