import { main } from "./worker.logic";
import { RequestListener } from "@giancosta86/worker-facade";

RequestListener.register(self, main);
