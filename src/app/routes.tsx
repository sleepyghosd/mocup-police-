import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Gallery } from "./components/Gallery";
import { Transcription } from "./components/Transcription";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Gallery },
      { path: "transcription", Component: Transcription },
      { path: "*", Component: Gallery },
    ],
  },
]);
