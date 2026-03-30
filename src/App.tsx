import { lazy, Suspense } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";

const MainLayout = lazy(() => import("./components/MainLayout"));
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const AddExercise = lazy(() => import("./pages/AddExercise"));
const Exercises = lazy(() => import("./pages/Exercises"));
const ExerciseDetails = lazy(() => import("./pages/ExerciseDetails"));
const WorkOuts = lazy(() => import("./pages/WorkOuts"));
const AddWorkOut = lazy(() => import("./pages/AddWorkOut"));
const EditWorkout = lazy(() => import("./components/EditWorkout"));
const UsersPage = lazy(() => import("./pages/UsersPage"));
const UserDetailsPage = lazy(() => import("./components/UserDetails"));
const SignUp = lazy(() => import("./pages/SignUp"));
const UserWorkout = lazy(() => import("./pages/UserWorkout"));
const CompleteData = lazy(() => import("./components/CompleteData"));
const NutritionList = lazy(() => import("./pages/NutritionList"));
const AddNutritionProgram = lazy(() => import("./pages/AddNutritionProgram"));
const EditNutrition = lazy(() => import("./pages/EditNutrition"));
const Plans = lazy(() => import("./pages/Plans"));
const Accounting = lazy(() => import("./pages/Accounting"));
const MyBilling = lazy(() => import("./pages/MyBilling"));
const Inventory = lazy(() => import("./pages/Inventory"));
const Balance = lazy(() => import("./pages/Balance"));

const RouteLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="glass-surface-strong inline-flex items-center gap-2 px-5 py-3 text-slate-100">
      <span className="h-4 w-4 rounded-full border-2 border-white/50 border-t-white animate-spin" />
      <span>Loading page...</span>
    </div>
  </div>
);

export default function App() {
  return (
    <HashRouter>
      <div className="font-cairo">
        <Suspense fallback={<RouteLoader />}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/SignUP" element={<SignUp />} />
            <Route path="/CompleteData/:userId" element={<CompleteData />} />
            <Route element={<MainLayout />}>
              <Route path="/Home" element={<Home />} />
              <Route path="/AddExercise" element={<AddExercise />} />
              <Route path="/Exercises" element={<Exercises />} />
              <Route path="/WorkOuts" element={<WorkOuts />} />
              <Route path="/AddWorkOut" element={<AddWorkOut />} />
              <Route path="/editWorkout" element={<EditWorkout />} />
              <Route path="/ExerciseDetails/:exerciseName" element={<ExerciseDetails />} />
              <Route path="/UsersPage" element={<UsersPage />} />
              <Route path="/user/:id" element={<UserDetailsPage />} />
              <Route path="/UserWorkout" element={<UserWorkout />} />
              <Route path="/NutritionList" element={<NutritionList />} />
              <Route path="/AddNutritionProgram" element={<AddNutritionProgram />} />
              <Route path="/EditNutrition/:id" element={<EditNutrition />} />
              <Route path="/Plans" element={<Plans />} />
              <Route path="/Accounting" element={<Accounting />} />
              <Route path="/Inventory" element={<Inventory />} />
              <Route path="/Balance" element={<Balance />} />
              <Route path="/MyBilling" element={<MyBilling />} />
            </Route>
          </Routes>
        </Suspense>
      </div>
    </HashRouter>
  );
}
