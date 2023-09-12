import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../layout";
import { SplashScreen } from "../components";
import { appRoutes } from "./app-routes";
import { useSelector, useDispatch } from "react-redux";
import { Page404, SignIn, SetPassword,QrViewer } from "../pages";
import API from "../axios";
import { storeUser } from "../store/reducer";

export default function Router() {
    const [isLoading, setIsLoading] = useState(true);
    const { isLogged, user } = useSelector((state) => state.storeReducer);
    const _token = localStorage.getItem('@ACCESS_TOKEN');
    const dispatch = useDispatch();
    
    useEffect(() => {
        if (!!_token) {
            getUser();
            return
        }
        setIsLoading(false);
    }, []);

    const getUser = async () => {
        try {
            let { data } = await API('get', 'me');
            dispatch(storeUser(data));
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    }

    return (
        <>
            {isLoading ? (
                <SplashScreen />
            ) : (
                <Routes>
                    <Route
                        path='/sign-in'
                        exact
                        element={<SignIn />}
                    />
                    <Route
                        path='/set-password/:token'
                        exact
                        element={<SetPassword />}
                    />
                    <Route
                        path='/qr'
                        exact
                        element={<QrViewer />}
                    />
                    {appRoutes.map((_v, _i) => {
                        return (
                            <Route
                                key={_i}
                                path={_v.path}
                                exact
                                element={<Protected isLogged={isLogged} user={user} ele={_v} children={_v.component} />}
                            />
                        );
                    })}
                    <Route path="*" element={<Page404 />} />

                </Routes>
            )}
        </>
    );
}

const Protected = ({ isLogged, ele, user, children }) => {

    if (!isLogged && ele.protected) {
        return <Navigate to="/sign-in" replace />;
    }
    return ele.layout ? <Layout children={children} /> : children;
}