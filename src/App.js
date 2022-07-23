import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/auth-context";
import React, { Suspense } from "react";
import UserProfileTest from "components/module/user/UserProfileTest";

//Suspense: vào trang nào load trang đó
//thực hiện một số công việc (như fetch data từ api) trước khi component có thể render.
const HomePage = React.lazy(() => import("./pages/HomePage"));
const DashboardPage = React.lazy(() => import("./pages/DashboardPage"));
const Categorypage = React.lazy(() => import("./pages/Categorypage"));
const NotFoundPage = React.lazy(() => import("./pages/NotFoundPage"));
const PostDetailsPage = React.lazy(() => import("./pages/PostDetailsPage"));
const SignInpage = React.lazy(() => import("./pages/SignInpage"));
const SignUpPage = React.lazy(() => import("./pages/SignUpPage"));
const MyprojectPage = React.lazy(() => import("./pages/MyprojectPage"));

const UserAddNew = React.lazy(() =>
  import("./components/module/user/UserAddNew")
);
const UserManage = React.lazy(() =>
  import("./components/module/user/UserManage")
);
const AuthorPage = React.lazy(() =>
  import("./components/module/user/AuthorPage")
);
const UserProfile = React.lazy(() =>
  import("./components/module/user/UserProfile")
);
const UserUpdate = React.lazy(() =>
  import("./components/module/user/UserUpdate")
);

const PostAddNew = React.lazy(() =>
  import("./components/module/post/PostAddNew")
);
const PostManage = React.lazy(() =>
  import("./components/module/post/PostManage")
);
const PostUpdate = React.lazy(() =>
  import("./components/module/post/PostUpdate")
);

const CategoryAddNew = React.lazy(() =>
  import("./components/module/category/CategoryAddNew")
);
const CategoryManage = React.lazy(() =>
  import("./components/module/category/CategoryManage")
);
const CategoryUpdate = React.lazy(() =>
  import("./components/module/category/CategoryUpdate")
);
const DashboardLayout = React.lazy(() =>
  import("./components/module/dashboard/DashboardLayout")
);

function App() {
  return (
    <AuthProvider>
      <Suspense>
        <Routes>
          <Route path="/" element={<HomePage></HomePage>}></Route>
          <Route
            path="/myproject"
            element={<MyprojectPage></MyprojectPage>}
          ></Route>
          <Route path="/sign-up" element={<SignUpPage></SignUpPage>}></Route>
          <Route path="/sign-in" element={<SignInpage></SignInpage>}></Route>
          <Route path="*" element={<NotFoundPage></NotFoundPage>}></Route>
          <Route
            path="/category/:slug"
            element={<Categorypage></Categorypage>}
          ></Route>
          <Route
            path="/author/:slug"
            element={<AuthorPage></AuthorPage>}
          ></Route>
          <Route
            path="/:slug"
            element={<PostDetailsPage></PostDetailsPage>}
          ></Route>

          <Route element={<DashboardLayout></DashboardLayout>}>
            <Route
              path="/dashboard"
              element={<DashboardPage></DashboardPage>}
            ></Route>
            <Route
              path="/manage/posts"
              element={<PostManage></PostManage>}
            ></Route>
            <Route
              path="/manage/add-post"
              element={<PostAddNew></PostAddNew>}
            ></Route>
            <Route
              path="/manage/update-posts"
              element={<PostUpdate></PostUpdate>}
            ></Route>
            <Route
              path="/manage/category"
              element={<CategoryManage></CategoryManage>}
            ></Route>
            <Route
              path="/manage/add-category"
              element={<CategoryAddNew></CategoryAddNew>}
            ></Route>
            <Route
              path="/manage/update-category"
              element={<CategoryUpdate></CategoryUpdate>}
            ></Route>
            <Route
              path="/manage/user"
              element={<UserManage></UserManage>}
            ></Route>
            <Route
              path="/manage/add-user"
              element={<UserAddNew></UserAddNew>}
            ></Route>
            <Route
              path="/manage/update-user"
              element={<UserUpdate></UserUpdate>}
            ></Route>
            <Route
              path="/profile"
              element={<UserProfile></UserProfile>}
            ></Route>
            <Route
              path="/profile-test"
              element={<UserProfileTest></UserProfileTest>}
            ></Route>
          </Route>
        </Routes>
        ;
      </Suspense>
    </AuthProvider>
  );
}

export default App;
