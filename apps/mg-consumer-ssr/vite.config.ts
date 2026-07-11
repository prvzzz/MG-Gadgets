import react from '@vitejs/plugin-react'
import ssr from 'vite-plugin-ssr/plugin'
import { UserConfig } from 'vite'
import tailwindcss from "@tailwindcss/vite";
import flowbiteReact from "flowbite-react/plugin/vite";

const config: UserConfig = {
  plugins: [react(), ssr(), tailwindcss(), flowbiteReact()]
}

export default config
