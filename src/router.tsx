import { createBrowserRouter } from "react-router-dom";
import { MarketingPage } from "./pages/MarketingPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { SignupPasswordPage } from "./pages/SignupPasswordPage";
import { SignupProfilePage } from "./pages/SignupProfilePage";
import { HomePage } from "./pages/HomePage";
import { GroupDetailPage } from "./pages/GroupDetailPage";
import { EventDetailPage } from "./pages/EventDetailPage";
import { ApplyCompletePage } from "./pages/ApplyCompletePage";
import { ApplyFailedPage } from "./pages/ApplyFailedPage";
import { MyGroupsPage } from "./pages/MyGroupsPage";
import { MyGroupDetailPage } from "./pages/MyGroupDetailPage";
import { ChatPage } from "./pages/ChatPage";
import { MeetupVotePage } from "./pages/MeetupVotePage";
import { MyPagePage } from "./pages/MyPagePage";

export const router = createBrowserRouter([
  { path: "/", element: <MarketingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/signup/password", element: <SignupPasswordPage /> },
  { path: "/signup/profile", element: <SignupProfilePage /> },
  { path: "/home", element: <HomePage /> },
  { path: "/groups/:groupId", element: <GroupDetailPage /> },
  { path: "/events/:eventId", element: <EventDetailPage /> },
  { path: "/apply/complete", element: <ApplyCompletePage /> },
  { path: "/apply/failed", element: <ApplyFailedPage /> },
  { path: "/my-groups", element: <MyGroupsPage /> },
  { path: "/my-groups/:groupId", element: <MyGroupDetailPage /> },
  { path: "/chat", element: <ChatPage /> },
  { path: "/chat/vote", element: <MeetupVotePage /> },
  { path: "/mypage", element: <MyPagePage /> },
]);
