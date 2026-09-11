import type { Route } from "./+types/home";
import { authMiddleware } from "~/middleware/auth";
import { RouterAuthContext } from "~/middleware/auth";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Decathlon - TP React" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  async ({ context }, next) => {
    await authMiddleware({ context });
    await next();
  },
];

export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  return { user: context.get(RouterAuthContext) };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <main>Welcome, {loaderData.user!.username}.</main>;
}
