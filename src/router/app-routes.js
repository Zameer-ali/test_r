import {
    SupHome,
    AdUser,
    ClShowFiles,
    SupCategories,
    AdDropFiles,
    ShowFiles,
    AdDropFiles1,
    ShowFiles1
} from "../pages";

export const appRoutes = [
    {
        path: "/",
        component: <SupHome />,
        protected: true,
        layout: true,
        type: 'SUPER_ADMIN',
    },
    {
        path: "/categories",
        component: <SupCategories />,
        protected: true,
        layout: true,
        type: 'SUPER_ADMIN',
    },
    {
        path: "/projects",
        component: <AdUser />,
        protected: true,
        layout: true,
        type: 'ADMIN',
    },
    {
        path: "/project/:id",
        component: <AdDropFiles />,
        protected: true,
        layout: true,
        type: 'ADMIN',
    },
    {
        path: "/project/category",
        component: <ShowFiles />,
        protected: true,
        layout: true,
        type: 'ADMIN',
    },
    {
        path: "/category/files",
        component: <ShowFiles1 />,
        protected: true,
        layout: true,
        type: 'CLIENT',
    },
    {
        path: "/categories",
        component: <AdDropFiles1 />,
        protected: true,
        layout: true,
        type: 'CLIENT',
    },
    {
        path: "/files",
        component: <ClShowFiles />,
        protected: true,
        layout: true,
        type: 'CLIENT',
    },
];